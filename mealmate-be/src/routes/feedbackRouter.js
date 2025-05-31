const express = require("express");
const router = express.Router();
const FeedbackController = require("../controllers/FeedbackController");
const { protect, adminMiddleware } = require("../middlewares/Auth");

// POST: gửi đánh giá mới
router.post("/", FeedbackController.createFeedback);

// GET: lấy tất cả đánh giá của một recipe
router.get("/:recipeId", FeedbackController.getFeedbacksByRecipe);

module.exports = router;
