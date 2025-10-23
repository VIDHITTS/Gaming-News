const express = require('express');
const router = express.Router();
require('dotenv').config();

// Import utilities and services
const youtubeService = require('./services/youtubeService');
const rateLimiterManager = require('./utils/rateLimiter');
const cacheManager = require('./utils/cache');

// Apply rate limiting middleware
router.use('/live-streams', rateLimiterManager.getLimiter('youtube'));
router.use('/search', rateLimiterManager.getLimiter('youtube'));
router.use('/channel', rateLimiterManager.getLimiter('general'));
router.use('/video', rateLimiterManager.getLimiter('general'));

/**
 * GET /api/live-streams
 * Get live gaming streams from YouTube with caching and rate limiting
 */
router.get('/live-streams', async (req, res) => {
    try {
        // Validate API key
        if (!youtubeService.validateApiKey()) {
            return res.status(500).json({
                success: false,
                error: 'YouTube API key is not configured',
                timestamp: new Date().toISOString()
            });
        }

        // Get query parameters
        const {
            maxResults = 10,
            videoCategoryId = 20,
            order = 'relevance',
            publishedAfter,
            regionCode
        } = req.query;

        // Prepare search options
        const options = {
            maxResults: parseInt(maxResults),
            videoCategoryId: parseInt(videoCategoryId),
            order,
            ...(publishedAfter && { publishedAfter }),
            ...(regionCode && { regionCode })
        };

        // Fetch live streams with caching
        const result = await youtubeService.getLiveStreams(options);

        if (result.success) {
            // Add cache information to response headers
            res.set({
                'X-Cache-Status': result.cached ? 'HIT' : 'MISS',
                'X-Cache-Timestamp': result.timestamp,
                'X-Data-Source': result.stale ? 'STALE_CACHE' : (result.cached ? 'CACHE' : 'API')
            });

            return res.json({
                success: true,
                data: result.data,
                meta: {
                    cached: result.cached,
                    stale: result.stale || false,
                    timestamp: result.timestamp,
                    requestId: req.headers['x-request-id'] || generateRequestId()
                }
            });
        } else {
            return res.status(500).json({
                success: false,
                error: result.error,
                timestamp: result.timestamp
            });
        }
    } catch (error) {
        console.error('Live streams endpoint error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to fetch live streams',
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * GET /api/search
 * Search for YouTube videos with caching
 */
router.get('/search', async (req, res) => {
    try {
        const { q, maxResults = 10, order = 'relevance', type = 'video' } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                error: 'Query parameter "q" is required',
                timestamp: new Date().toISOString()
            });
        }

        const options = {
            maxResults: parseInt(maxResults),
            order,
            type
        };

        const result = await youtubeService.searchVideos(q, options);

        if (result.success) {
            res.set({
                'X-Cache-Status': result.cached ? 'HIT' : 'MISS',
                'X-Cache-Timestamp': result.timestamp
            });

            return res.json({
                success: true,
                data: result.data,
                meta: {
                    cached: result.cached,
                    timestamp: result.timestamp,
                    query: q
                }
            });
        } else {
            return res.status(500).json({
                success: false,
                error: result.error,
                timestamp: result.timestamp
            });
        }
    } catch (error) {
        console.error('Search endpoint error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * GET /api/channel/:channelId
 * Get channel information with caching
 */
router.get('/channel/:channelId', async (req, res) => {
    try {
        const { channelId } = req.params;

        if (!channelId) {
            return res.status(400).json({
                success: false,
                error: 'Channel ID is required',
                timestamp: new Date().toISOString()
            });
        }

        const result = await youtubeService.getChannelInfo(channelId);

        if (result.success) {
            res.set({
                'X-Cache-Status': result.cached ? 'HIT' : 'MISS',
                'X-Cache-Timestamp': result.timestamp
            });

            return res.json({
                success: true,
                data: result.data,
                meta: {
                    cached: result.cached,
                    timestamp: result.timestamp,
                    channelId
                }
            });
        } else {
            return res.status(500).json({
                success: false,
                error: result.error,
                timestamp: result.timestamp
            });
        }
    } catch (error) {
        console.error('Channel endpoint error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * GET /api/video/:videoId
 * Get video details with caching
 */
router.get('/video/:videoId', async (req, res) => {
    try {
        const { videoId } = req.params;

        if (!videoId) {
            return res.status(400).json({
                success: false,
                error: 'Video ID is required',
                timestamp: new Date().toISOString()
            });
        }

        const result = await youtubeService.getVideoDetails(videoId);

        if (result.success) {
            res.set({
                'X-Cache-Status': result.cached ? 'HIT' : 'MISS',
                'X-Cache-Timestamp': result.timestamp
            });

            return res.json({
                success: true,
                data: result.data,
                meta: {
                    cached: result.cached,
                    timestamp: result.timestamp,
                    videoId
                }
            });
        } else {
            return res.status(500).json({
                success: false,
                error: result.error,
                timestamp: result.timestamp
            });
        }
    } catch (error) {
        console.error('Video endpoint error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', async (req, res) => {
    try {
        const isApiKeyValid = youtubeService.validateApiKey();
        const cacheStats = cacheManager.getStats();
        const rateLimitStats = rateLimiterManager.getStats();

        return res.json({
            success: true,
            status: 'healthy',
            timestamp: new Date().toISOString(),
            services: {
                youtube: {
                    apiKeyConfigured: isApiKeyValid,
                    connectionTest: isApiKeyValid ? await youtubeService.testConnection() : false
                },
                cache: {
                    status: 'operational',
                    stats: cacheStats
                },
                rateLimiting: {
                    status: 'operational',
                    stats: rateLimitStats
                }
            }
        });
    } catch (error) {
        console.error('Health check error:', error);
        return res.status(500).json({
            success: false,
            status: 'unhealthy',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * GET /api/stats
 * Get system statistics
 */
router.get('/stats', async (req, res) => {
    try {
        const cacheStats = cacheManager.getStats();
        const rateLimitStats = rateLimiterManager.getStats();
        const youtubeStats = youtubeService.getStats();

        return res.json({
            success: true,
            timestamp: new Date().toISOString(),
            stats: {
                cache: cacheStats,
                rateLimiting: rateLimitStats,
                youtube: youtubeStats
            }
        });
    } catch (error) {
        console.error('Stats endpoint error:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Failed to fetch statistics',
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * POST /api/cache/clear
 * Clear cache (admin endpoint)
 */
router.post('/cache/clear', async (req, res) => {
    try {
        const { endpoint } = req.body;
        
        if (endpoint) {
            youtubeService.clearCache(endpoint);
        } else {
            cacheManager.clear('api');
        }

        return res.json({
            success: true,
            message: `Cache cleared${endpoint ? ` for endpoint: ${endpoint}` : ''}`,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Cache clear error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to clear cache',
            timestamp: new Date().toISOString()
        });
    }
});

// Utility function to generate request ID
function generateRequestId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

module.exports = router; 