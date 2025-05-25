const express = require("express");
const path = require("path");
const fs = require("fs");
const { analyzeImageToText } = require("../config/gemini");
const { protect } = require("../middlewares/Auth");

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { filename } = req.body;
    if (!filename) {
      return res.status(400).json({ message: "Thiếu tên file" });
    }

    const filePath = path.join(__dirname, "../uploads", filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Ảnh không tồn tại" });
    }

    const result = await analyzeImageToText(filePath);

    res.json({ success: true, text: result });
  } catch (err) {
    console.error("Phân tích ảnh lỗi:", err);
    res
      .status(500)
      .json({
        success: false,
        message: "Lỗi khi phân tích ảnh",
        error: err.message,
      });
  }
});

module.exports = router;
