const express = require("express");
const router = express.Router();
const { getAllRecipes } = require("../controllers/RecipeController");

router.get("/", getAllRecipes); // GET /api/recipes

module.exports = router;
