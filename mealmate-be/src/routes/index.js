const express = require("express");

const userRouter = require("../routes/userRouter");
const recipeRouter = require("../routes/recipeRouter");

const router = express.Router();

// Gắn từng route vào prefix
router.use("/users", userRouter);
router.use("/recipes", recipeRouter);

module.exports = router;
