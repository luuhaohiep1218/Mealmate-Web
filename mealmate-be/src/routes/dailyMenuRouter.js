const express = require("express");
const { protect, adminMiddleware } = require("../middlewares/Auth");
const {
  createDailyMenu,
  updateDailyMenu,
} = require("../controllers/DailyMenuController");
const router = express.Router();

router.post("/create", protect, createDailyMenu);
router.put("/update", protect, updateDailyMenu);

module.exports = router;
