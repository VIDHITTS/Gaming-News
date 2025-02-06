const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (HTML, CSS, JS) from the 'public' folder
app.use(express.static("public"));

// Define a route for the root URL
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
