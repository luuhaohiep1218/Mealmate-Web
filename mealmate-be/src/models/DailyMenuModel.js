const mongoose = require("mongoose");

const MealEntrySchema = new mongoose.Schema({
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1, // số phần ăn
    min: 0.1,
  },
});

const DailyMenuSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },

    // Phân theo từng bữa trong ngày
    meals: {
      breakfast: [MealEntrySchema],
      lunch: [MealEntrySchema],
      dinner: [MealEntrySchema],
      snack: [MealEntrySchema],
    },

    // Tổng dinh dưỡng đã nạp hôm đó (được tính tự động từ recipe × quantity)
    totalCalories: { type: Number, default: 0 },
    totalProtein: { type: Number, default: 0 },
    totalFat: { type: Number, default: 0 },
    totalCarbs: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Optional: Đảm bảo mỗi người dùng chỉ có 1 dailyMenu cho mỗi ngày
DailyMenuSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("DailyMenu", DailyMenuSchema);
