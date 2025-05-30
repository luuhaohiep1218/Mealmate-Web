const express = require("express");
const router = express.Router();
const {
  getAllRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipeById,
} = require("../controllers/RecipeController");
const { protect, adminMiddleware } = require("../middlewares/Auth");

router.get("/", getAllRecipes);
router.get("/:id", getRecipeById);
router.post("/", protect, adminMiddleware, createRecipe);
router.put("/:id", protect, adminMiddleware, updateRecipe);
router.delete("/:id", protect, adminMiddleware, deleteRecipe);

module.exports = router;
