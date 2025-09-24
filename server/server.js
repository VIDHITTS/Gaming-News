const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const apiRouter = require('./api');

app.use(express.static(path.join(__dirname, '../public')));

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
