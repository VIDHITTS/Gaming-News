const axios = require('axios');
const cacheManager = require('../utils/cache');

/**
 * YouTube API Service with caching, rate limiting, and error handling
 */
class YouTubeService {
    constructor() {
        this.apiKey = process.env.YOUTUBE_API_KEY;
        this.baseURL = 'https://www.googleapis.com/youtube/v3';
        this.defaultParams = {
            part: 'snippet',
            eventType: 'live',
            type: 'video',
            maxResults: 10,
            videoCategoryId: 20 // Gaming category
        };
        
        // Cache TTL settings (in seconds)
        this.cacheTTL = {
            liveStreams: 300, // 5 minutes
            searchResults: 600, // 10 minutes
            channelInfo: 1800, // 30 minutes
            videoDetails: 900 // 15 minutes
        };

        // Error handling
        this.maxRetries = 3;
        this.retryDelay = 1000; // 1 second
    }

    /**
     * Make HTTP request with retry logic
     * @param {string} url - Request URL
     * @param {object} params - Query parameters
     * @param {number} retryCount - Current retry count
     * @returns {Promise<object>} API response
     */
    async makeRequest(url, params = {}, retryCount = 0) {
        try {
            const response = await axios.get(url, {
                params: {
                    ...params,
                    key: this.apiKey
                },
                timeout: 10000, // 10 second timeout
                headers: {
                    'User-Agent': 'Gaming-News-Hub/1.0'
                }
            });

            return response.data;
        } catch (error) {
            console.error(`YouTube API request failed (attempt ${retryCount + 1}):`, error.response?.data || error.message);
            
            // Handle different types of errors
            if (error.response?.status === 403) {
                throw new Error('YouTube API quota exceeded or API key invalid');
            } else if (error.response?.status === 429) {
                throw new Error('YouTube API rate limit exceeded');
            } else if (error.response?.status >= 500) {
                // Server error - retry
                if (retryCount < this.maxRetries) {
                    await this.delay(this.retryDelay * (retryCount + 1));
                    return this.makeRequest(url, params, retryCount + 1);
                }
            }
            
            throw error;
        }
    }

    /**
     * Delay execution
     * @param {number} ms - Milliseconds to delay
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Get live streams with caching
     * @param {object} options - Search options
     * @returns {Promise<object>} Live streams data
     */
    async getLiveStreams(options = {}) {
        const params = {
            ...this.defaultParams,
            ...options
        };

        const cacheKey = cacheManager.generateYouTubeCacheKey({
            endpoint: 'liveStreams',
            ...params
        });

        try {
            const data = await cacheManager.getOrSet(
                cacheKey,
                async () => {
                    console.log('Fetching fresh live streams data from YouTube API');
                    const url = `${this.baseURL}/search`;
                    return await this.makeRequest(url, params);
                },
                this.cacheTTL.liveStreams
            );

            return {
                success: true,
                data: data,
                cached: cacheManager.has(cacheKey),
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error fetching live streams:', error);
            
            // Try to return cached data if available
            const cachedData = cacheManager.get(cacheKey);
            if (cachedData) {
                console.log('Returning cached live streams data due to API error');
                return {
                    success: true,
                    data: cachedData,
                    cached: true,
                    stale: true,
                    error: error.message,
                    timestamp: new Date().toISOString()
                };
            }

            return {
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Search for videos with caching
     * @param {string} query - Search query
     * @param {object} options - Search options
     * @returns {Promise<object>} Search results
     */
    async searchVideos(query, options = {}) {
        const params = {
            part: 'snippet',
            q: query,
            type: 'video',
            maxResults: options.maxResults || 10,
            ...options
        };

        const cacheKey = cacheManager.generateYouTubeCacheKey({
            endpoint: 'search',
            ...params
        });

        try {
            const data = await cacheManager.getOrSet(
                cacheKey,
                async () => {
                    console.log(`Searching for videos: ${query}`);
                    const url = `${this.baseURL}/search`;
                    return await this.makeRequest(url, params);
                },
                this.cacheTTL.searchResults
            );

            return {
                success: true,
                data: data,
                cached: cacheManager.has(cacheKey),
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error searching videos:', error);
            return {
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Get channel information with caching
     * @param {string} channelId - YouTube channel ID
     * @returns {Promise<object>} Channel information
     */
    async getChannelInfo(channelId) {
        const params = {
            part: 'snippet,statistics',
            id: channelId
        };

        const cacheKey = cacheManager.generateYouTubeCacheKey({
            endpoint: 'channel',
            ...params
        });

        try {
            const data = await cacheManager.getOrSet(
                cacheKey,
                async () => {
                    console.log(`Fetching channel info for: ${channelId}`);
                    const url = `${this.baseURL}/channels`;
                    return await this.makeRequest(url, params);
                },
                this.cacheTTL.channelInfo
            );

            return {
                success: true,
                data: data,
                cached: cacheManager.has(cacheKey),
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error fetching channel info:', error);
            return {
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Get video details with caching
     * @param {string} videoId - YouTube video ID
     * @returns {Promise<object>} Video details
     */
    async getVideoDetails(videoId) {
        const params = {
            part: 'snippet,statistics,contentDetails',
            id: videoId
        };

        const cacheKey = cacheManager.generateYouTubeCacheKey({
            endpoint: 'video',
            ...params
        });

        try {
            const data = await cacheManager.getOrSet(
                cacheKey,
                async () => {
                    console.log(`Fetching video details for: ${videoId}`);
                    const url = `${this.baseURL}/videos`;
                    return await this.makeRequest(url, params);
                },
                this.cacheTTL.videoDetails
            );

            return {
                success: true,
                data: data,
                cached: cacheManager.has(cacheKey),
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error fetching video details:', error);
            return {
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Get service statistics
     * @returns {object} Service statistics
     */
    getStats() {
        return {
            apiKey: this.apiKey ? 'Configured' : 'Not configured',
            cacheTTL: this.cacheTTL,
            maxRetries: this.maxRetries,
            retryDelay: this.retryDelay,
            cacheStats: cacheManager.getStats()
        };
    }

    /**
     * Clear cache for specific endpoint
     * @param {string} endpoint - Endpoint name
     */
    clearCache(endpoint = null) {
        if (endpoint) {
            // Clear specific endpoint cache
            const keys = cacheManager.apiCache.keys();
            keys.forEach(key => {
                if (key.includes(endpoint)) {
                    cacheManager.del(key);
                }
            });
        } else {
            // Clear all cache
            cacheManager.clear('api');
        }
    }

    /**
     * Validate API key
     * @returns {boolean} True if API key is valid
     */
    validateApiKey() {
        return !!this.apiKey && this.apiKey.length > 0;
    }

    /**
     * Test API connection
     * @returns {Promise<boolean>} True if connection is successful
     */
    async testConnection() {
        try {
            const url = `${this.baseURL}/search`;
            const params = {
                part: 'snippet',
                q: 'test',
                type: 'video',
                maxResults: 1
            };
            
            await this.makeRequest(url, params);
            return true;
        } catch (error) {
            console.error('YouTube API connection test failed:', error.message);
            return false;
        }
    }
}

// Create singleton instance
const youtubeService = new YouTubeService();

module.exports = youtubeService;
