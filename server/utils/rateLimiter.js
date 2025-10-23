const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const cacheManager = require('./cache');

/**
 * Rate limiting configurations for different endpoints
 */
class RateLimiterManager {
    constructor() {
        this.limiters = new Map();
        this.setupLimiters();
    }

    setupLimiters() {
        // General API rate limiter
        this.limiters.set('general', rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // Limit each IP to 100 requests per windowMs
            message: {
                error: 'Too many requests from this IP, please try again later.',
                retryAfter: '15 minutes'
            },
            standardHeaders: true,
            legacyHeaders: false,
            handler: (req, res) => {
                res.status(429).json({
                    error: 'Rate limit exceeded',
                    message: 'Too many requests from this IP, please try again later.',
                    retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
                });
            }
        }));

        // YouTube API specific rate limiter (more restrictive)
        this.limiters.set('youtube', rateLimit({
            windowMs: 60 * 1000, // 1 minute
            max: 10, // Limit each IP to 10 YouTube API requests per minute
            message: {
                error: 'YouTube API rate limit exceeded',
                retryAfter: '1 minute'
            },
            standardHeaders: true,
            legacyHeaders: false,
            handler: (req, res) => {
                res.status(429).json({
                    error: 'YouTube API rate limit exceeded',
                    message: 'Too many YouTube API requests. Please try again in a minute.',
                    retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
                });
            }
        }));

        // Slow down after certain number of requests
        this.limiters.set('slowDown', slowDown({
            windowMs: 15 * 60 * 1000, // 15 minutes
            delayAfter: 50, // Allow 50 requests per 15 minutes, then...
            delayMs: 500 // Add 500ms delay per request above delayAfter
        }));

        // Strict rate limiter for API endpoints
        this.limiters.set('strict', rateLimit({
            windowMs: 5 * 60 * 1000, // 5 minutes
            max: 20, // Limit each IP to 20 requests per 5 minutes
            message: {
                error: 'API rate limit exceeded',
                retryAfter: '5 minutes'
            },
            standardHeaders: true,
            legacyHeaders: false,
            handler: (req, res) => {
                res.status(429).json({
                    error: 'API rate limit exceeded',
                    message: 'Too many API requests. Please try again later.',
                    retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
                });
            }
        }));
    }

    /**
     * Get rate limiter by name
     * @param {string} name - Name of the rate limiter
     * @returns {Function} Rate limiter middleware
     */
    getLimiter(name) {
        return this.limiters.get(name) || this.limiters.get('general');
    }

    /**
     * Custom rate limiter for YouTube API with cache integration
     * @param {string} identifier - Unique identifier for rate limiting
     * @param {number} maxRequests - Maximum requests allowed
     * @param {number} windowMs - Time window in milliseconds
     * @returns {Function} Custom rate limiter middleware
     */
    createCustomLimiter(identifier, maxRequests = 10, windowMs = 60000) {
        return (req, res, next) => {
            const key = `rateLimit:${identifier}:${req.ip}`;
            const now = Date.now();
            const windowStart = now - windowMs;

            try {
                // Get current request count from cache
                let requestData = cacheManager.get(key, 'rateLimit') || {
                    count: 0,
                    resetTime: now + windowMs,
                    requests: []
                };

                // Remove old requests outside the window
                requestData.requests = requestData.requests.filter(time => time > windowStart);
                
                // Check if limit exceeded
                if (requestData.requests.length >= maxRequests) {
                    const resetTime = Math.ceil((requestData.requests[0] + windowMs) / 1000);
                    
                    return res.status(429).json({
                        error: 'Rate limit exceeded',
                        message: `Too many requests. Limit: ${maxRequests} per ${windowMs / 1000} seconds`,
                        retryAfter: resetTime,
                        limit: maxRequests,
                        remaining: 0,
                        resetTime: resetTime
                    });
                }

                // Add current request
                requestData.requests.push(now);
                requestData.count = requestData.requests.length;

                // Cache the updated data
                cacheManager.set(key, requestData, Math.ceil(windowMs / 1000), 'rateLimit');

                // Add rate limit headers
                res.set({
                    'X-RateLimit-Limit': maxRequests,
                    'X-RateLimit-Remaining': Math.max(0, maxRequests - requestData.count),
                    'X-RateLimit-Reset': Math.ceil((requestData.requests[0] + windowMs) / 1000)
                });

                next();
            } catch (error) {
                console.error('Custom rate limiter error:', error);
                // On error, allow the request but log it
                next();
            }
        };
    }

    /**
     * Get rate limiting statistics
     * @returns {object} Rate limiting statistics
     */
    getStats() {
        const stats = cacheManager.getStats();
        return {
            ...stats,
            activeLimiters: Array.from(this.limiters.keys()),
            totalLimiters: this.limiters.size
        };
    }

    /**
     * Reset rate limiting for a specific IP
     * @param {string} ip - IP address
     * @param {string} identifier - Rate limiter identifier
     */
    resetLimitForIP(ip, identifier) {
        const key = `rateLimit:${identifier}:${ip}`;
        cacheManager.del(key, 'rateLimit');
        console.log(`Rate limit reset for IP: ${ip}, identifier: ${identifier}`);
    }

    /**
     * Get remaining requests for an IP
     * @param {string} ip - IP address
     * @param {string} identifier - Rate limiter identifier
     * @param {number} maxRequests - Maximum requests allowed
     * @returns {object} Remaining requests info
     */
    getRemainingRequests(ip, identifier, maxRequests = 10) {
        const key = `rateLimit:${identifier}:${ip}`;
        const requestData = cacheManager.get(key, 'rateLimit');
        
        if (!requestData) {
            return {
                remaining: maxRequests,
                limit: maxRequests,
                resetTime: Date.now() + 60000
            };
        }

        const now = Date.now();
        const windowStart = now - 60000;
        const validRequests = requestData.requests.filter(time => time > windowStart);
        
        return {
            remaining: Math.max(0, maxRequests - validRequests.length),
            limit: maxRequests,
            resetTime: validRequests.length > 0 ? validRequests[0] + 60000 : now + 60000
        };
    }
}

// Create singleton instance
const rateLimiterManager = new RateLimiterManager();

module.exports = rateLimiterManager;
