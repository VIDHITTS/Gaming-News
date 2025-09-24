const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

router.get('/live-streams', async (req, res) => {
    if (!YOUTUBE_API_KEY) {
        return res.status(500).json({ 
            error: "API key is not configured" 
        });
    }

    try {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&eventType=live&type=video&maxResults=10&videoCategoryId=20&key=${YOUTUBE_API_KEY}`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('YouTube API error:', error.response?.data || error.message);
        res.status(500).json({ 
            error: "Failed to fetch live streams from YouTube" 
        });
    }
});

module.exports = router; 