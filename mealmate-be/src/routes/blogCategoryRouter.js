const express = require("express");
const router = express.Router();
const {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  deleteManyBlogs,
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  deleteManyCategories,
  getCategoryBySlug,
} = require("../controllers/BlogController");
const { protect, adminMiddleware } = require("../middlewares/Auth");

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.post("/", protect, adminMiddleware, createCategory);
router.put("/:id", protect, adminMiddleware, updateCategory);
router.delete("/:id", protect, adminMiddleware, deleteCategory);
router.delete("/delete-many", protect, adminMiddleware, deleteManyCategories);
router.get("/:slug/by-slug", getCategoryBySlug);

module.exports = router;
