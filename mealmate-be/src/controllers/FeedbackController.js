const Feedback = require("../models/FeedbackModel");
const Recipe = require("../models/RecipeModel");

exports.createFeedback = async (req, res) => {
  try {
    const { recipe, rating, comment } = req.body;
    const userId = req.user?._id; // Nếu bạn có auth middleware

    if (!recipe || !rating) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc." });
    }

    const feedback = new Feedback({
      recipe,
      user: userId,
      rating,
      comment,
    });

    await feedback.save();

    // Cập nhật điểm trung bình vào Recipe
    const feedbacks = await Feedback.find({ recipe });
    const avgRating =
      feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length;

    await Recipe.findByIdAndUpdate(recipe, { rating: avgRating.toFixed(1) });

    res.status(201).json(feedback);
  } catch (error) {
    console.error("Lỗi tạo feedback:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};


exports.getFeedbacksByRecipe = async (req, res) => {
  try {
    const recipeId = req.params.recipeId;

    const feedbacks = await Feedback.find({ recipe: recipeId })
      .populate("user", "full_name profile_picture")
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Không thể lấy feedback." });
  }
};
