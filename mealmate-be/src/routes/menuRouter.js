const express = require("express");
const router = express.Router();
const {
  getAllMenus,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
  deleteManyMenus,
} = require("../controllers/MenuController");
const { protect, adminMiddleware } = require("../middlewares/Auth");

router.get("/", getAllMenus);

router.get("/:id", getMenuById);

router.post("/", protect, adminMiddleware, createMenu);

router.put("/:id", protect, adminMiddleware, updateMenu);

router.delete("/:id", protect, adminMiddleware, deleteMenu);

router.delete("/", protect, adminMiddleware, deleteManyMenus);

module.exports = router;
