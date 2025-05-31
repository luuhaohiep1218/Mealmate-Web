const express = require("express");

const userRouter = require("../routes/userRouter");
const recipeRouter = require("../routes/recipeRouter");
const authRouter = require("../routes/authRouter");
const uploadRouter = require("../routes/uploadRouter");
const geminiAiRouter = require("../routes/geminiAiRouter");
const dailyMenuRouter = require("../routes/dailyMenuRouter");
const menuRouter = require("../routes/menuRouter");
const blogRouter = require("../routes/blogRouter");
const blogCategoryRouter = require("../routes/blogCategoryRouter");
const feedbackRouter = require("../routes/feedbackRouter");

const router = express.Router();

// Gắn từng route vào prefix
router.use("/users", userRouter);
router.use("/recipes", recipeRouter);
router.use("/auth", authRouter);
router.use("/upload", uploadRouter);
router.use("/gemini-ai", geminiAiRouter);
router.use("/daily", dailyMenuRouter);
router.use("/menus", menuRouter);
router.use("/blogs", blogRouter);
router.use("/blog-categories", blogCategoryRouter);
//router feedback
router.use("/feedback", feedbackRouter);

module.exports = router;
