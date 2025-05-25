const asyncHandler = require("express-async-handler");
const path = require("path");
const fs = require("fs");
const { analyzeImageToText } = require("../config/gemini");
const Recipe = require("../models/RecipeModel");
const {
  cleanJsonCodeBlock,
  normalizeIngredient,
} = require("../utils/aiHelpers");

const imageAnalyze = asyncHandler(async (req, res) => {
  try {
    const { filename } = req.body;
    if (!filename) {
      return res.status(400).json({ message: "Thiếu tên file" });
    }

    const filePath = path.join(__dirname, "../uploads", filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Ảnh không tồn tại" });
    }

    const rawResult = await analyzeImageToText(filePath);
    const cleanResult = cleanJsonCodeBlock(rawResult);

    let ingredients;
    try {
      ingredients = JSON.parse(cleanResult);
    } catch (err) {
      return res
        .status(400)
        .json({ message: "Không thể phân tích kết quả JSON từ AI" });
    }
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Không nhận diện được nguyên liệu nào",
        data: [],
      });
    }

    const ingredientNames = ingredients.map((i) =>
      normalizeIngredient(i.name.trim().toLowerCase())
    );

    // B2: Tìm các món ăn có chứa ít nhất 1 nguyên liệu
    const regexConditions = ingredientNames.map((name) => ({
      "ingredients.name": { $regex: name, $options: "i" },
    }));

    const matchingRecipes = await Recipe.find({
      $or: regexConditions,
    });

    res.json({
      success: true,
      ingredients: ingredientNames,
      recipes: matchingRecipes,
    });
  } catch (err) {
    console.error("Phân tích ảnh lỗi:", err);
    res.status(500).json({
      success: false,
      message: "Lỗi khi phân tích ảnh",
      error: err.message,
    });
  }
});

module.exports = {
  imageAnalyze,
};
