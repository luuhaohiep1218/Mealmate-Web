const express = require("express");

const { protect } = require("../middlewares/Auth");
const { imageAnalyze } = require("../controllers/GeminiAiController");

const router = express.Router();

router.post("/analyze-image", protect, imageAnalyze);

module.exports = router;
