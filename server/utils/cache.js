const NodeCache = require('node-cache');

/**
 * Cache utility for managing API responses and reducing external API calls
 */
class CacheManager {
    constructor() {
        // Create cache instances for different types of data
        this.apiCache = new NodeCache({ 
            stdTTL: 300, // 5 minutes default TTL
            checkperiod: 60, // Check for expired keys every minute
            useClones: false // Don't clone objects for better performance
        });
        
        this.rateLimitCache = new NodeCache({ 
            stdTTL: 60, // 1 minute for rate limiting
            checkperiod: 10 // Check every 10 seconds
        });
        
        // Cache statistics
        this.stats = {
            hits: 0,
            misses: 0,
            sets: 0,
            deletes: 0,
            errors: 0
        };
        
        // Setup event listeners for monitoring
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.apiCache.on('set', () => this.stats.sets++);
        this.apiCache.on('del', () => this.stats.deletes++);
        this.apiCache.on('error', () => this.stats.errors++);
    }

    /**
     * Get data from cache
     * @param {string} key - Cache key
     * @param {string} cacheType - Type of cache ('api' or 'rateLimit')
     * @returns {any} Cached data or undefined
     */
    get(key, cacheType = 'api') {
        try {
            const cache = cacheType === 'rateLimit' ? this.rateLimitCache : this.apiCache;
            const data = cache.get(key);
            
            if (data !== undefined) {
                this.stats.hits++;
                console.log(`Cache HIT for key: ${key}`);
                return data;
            } else {
                this.stats.misses++;
                console.log(`Cache MISS for key: ${key}`);
                return undefined;
            }
        } catch (error) {
            console.error('Cache get error:', error);
            this.stats.errors++;
            return undefined;
        }
    }

    /**
     * Set data in cache
     * @param {string} key - Cache key
     * @param {any} data - Data to cache
     * @param {number} ttl - Time to live in seconds
     * @param {string} cacheType - Type of cache ('api' or 'rateLimit')
     */
    set(key, data, ttl = null, cacheType = 'api') {
        try {
            const cache = cacheType === 'rateLimit' ? this.rateLimitCache : this.apiCache;
            
            if (ttl) {
                cache.set(key, data, ttl);
            } else {
                cache.set(key, data);
            }
            
            console.log(`Cache SET for key: ${key}, TTL: ${ttl || 'default'}`);
        } catch (error) {
            console.error('Cache set error:', error);
            this.stats.errors++;
        }
    }

    /**
     * Delete data from cache
     * @param {string} key - Cache key
     * @param {string} cacheType - Type of cache ('api' or 'rateLimit')
     */
    del(key, cacheType = 'api') {
        try {
            const cache = cacheType === 'rateLimit' ? this.rateLimitCache : this.apiCache;
            cache.del(key);
            console.log(`Cache DELETE for key: ${key}`);
        } catch (error) {
            console.error('Cache delete error:', error);
            this.stats.errors++;
        }
    }

    /**
     * Check if key exists in cache
     * @param {string} key - Cache key
     * @param {string} cacheType - Type of cache ('api' or 'rateLimit')
     * @returns {boolean}
     */
    has(key, cacheType = 'api') {
        const cache = cacheType === 'rateLimit' ? this.rateLimitCache : this.apiCache;
        return cache.has(key);
    }

    /**
     * Clear all cache data
     * @param {string} cacheType - Type of cache ('api' or 'rateLimit' or 'all')
     */
    clear(cacheType = 'all') {
        try {
            if (cacheType === 'all' || cacheType === 'api') {
                this.apiCache.flushAll();
            }
            if (cacheType === 'all' || cacheType === 'rateLimit') {
                this.rateLimitCache.flushAll();
            }
            console.log(`Cache CLEARED: ${cacheType}`);
        } catch (error) {
            console.error('Cache clear error:', error);
            this.stats.errors++;
        }
    }

    /**
     * Get cache statistics
     * @returns {object} Cache statistics
     */
    getStats() {
        const apiKeys = this.apiCache.keys();
        const rateLimitKeys = this.rateLimitCache.keys();
        
        return {
            ...this.stats,
            apiCacheSize: apiKeys.length,
            rateLimitCacheSize: rateLimitKeys.length,
            hitRate: this.stats.hits + this.stats.misses > 0 
                ? (this.stats.hits / (this.stats.hits + this.stats.misses) * 100).toFixed(2) + '%'
                : '0%',
            apiKeys: apiKeys.slice(0, 10), // Show first 10 keys for debugging
            rateLimitKeys: rateLimitKeys.slice(0, 10)
        };
    }

    /**
     * Generate cache key for YouTube API requests
     * @param {object} params - API parameters
     * @returns {string} Generated cache key
     */
    generateYouTubeCacheKey(params) {
        const sortedParams = Object.keys(params)
            .sort()
            .reduce((result, key) => {
                result[key] = params[key];
                return result;
            }, {});
        
        return `youtube:${JSON.stringify(sortedParams)}`;
    }

    /**
     * Get or set cache data with automatic fallback
     * @param {string} key - Cache key
     * @param {Function} fetchFunction - Function to fetch data if not cached
     * @param {number} ttl - Time to live in seconds
     * @returns {Promise<any>} Cached or fresh data
     */
    async getOrSet(key, fetchFunction, ttl = null) {
        try {
            // Try to get from cache first
            const cached = this.get(key);
            if (cached !== undefined) {
                return cached;
            }

            // If not in cache, fetch fresh data
            console.log(`Fetching fresh data for key: ${key}`);
            const freshData = await fetchFunction();
            
            // Cache the fresh data
            this.set(key, freshData, ttl);
            
            return freshData;
        } catch (error) {
            console.error('Cache getOrSet error:', error);
            this.stats.errors++;
            
            // Try to return stale data if available
            const staleData = this.get(key);
            if (staleData !== undefined) {
                console.log(`Returning stale data for key: ${key}`);
                return staleData;
            }
            
            throw error;
        }
    }
}

// Create singleton instance
const cacheManager = new CacheManager();

module.exports = cacheManager;
