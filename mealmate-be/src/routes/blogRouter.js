const express = require("express");
const router = express.Router();
const {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  deleteManyBlogs,
  getBlogBySlug,
} = require("../controllers/BlogController");
const { protect, adminMiddleware } = require("../middlewares/Auth");

router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.post("/", protect, adminMiddleware, createBlog);
router.put("/:id", protect, adminMiddleware, updateBlog);
router.delete("/:id", protect, adminMiddleware, deleteBlog);
router.delete("/", protect, adminMiddleware, deleteManyBlogs);
router.get("/:slug/by-slug", getBlogBySlug);

module.exports = router;
