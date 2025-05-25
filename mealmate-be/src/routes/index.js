const express = require("express");

const userRouter = require("../routes/userRouter");
const recipeRouter = require("../routes/recipeRouter");
const authRouter = require("../routes/authRouter");
const uploadRouter = require("../routes/uploadRouter");
const imageAnalyzeRouter = require("../routes/imageAnalyzeRouter");

const router = express.Router();

// Gắn từng route vào prefix
router.use("/users", userRouter);
router.use("/recipes", recipeRouter);
router.use("/auth", authRouter);
router.use("/upload", uploadRouter);
router.use("/analyze-image", imageAnalyzeRouter);

module.exports = router;
