const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const app = express();
const PORT = process.env.PORT || 3000;
const apiRouter = require('./api');

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:", "http:"],
            connectSrc: ["'self'", "https://www.googleapis.com"],
            fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
}));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// API routes with enhanced middleware
app.use('/api', apiRouter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get("/trending", (req, res) => {
  res.sendFile(path.join(__dirname, '../public/trending.html'));
});

app.get("/esports", (req, res) => {
  res.sendFile(path.join(__dirname, '../public/esports.html'));
});

app.get("/community", (req, res) => {
  res.sendFile(path.join(__dirname, '../public/community.html'));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, '../public/about.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
