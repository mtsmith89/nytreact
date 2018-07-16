const path = require("path");
const router = require("express").Router();

// API Routes

router.use((req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = router;
