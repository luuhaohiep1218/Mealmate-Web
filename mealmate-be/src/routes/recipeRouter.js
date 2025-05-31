const express = require("express");
const router = express.Router();
const {
  getAllRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipeById,
  getRecipeBySlug,
} = require("../controllers/RecipeController");
const { protect, adminMiddleware } = require("../middlewares/Auth");

router.get("/", getAllRecipes);
router.get("/:id", getRecipeById);
router.post("/", protect, adminMiddleware, createRecipe);
router.put("/:id", protect, adminMiddleware, updateRecipe);
router.delete("/:id", protect, adminMiddleware, deleteRecipe);
router.get("/:slug/by-slug", getRecipeBySlug);

module.exports = router;
