const asyncHandler = require("express-async-handler");
const aqp = require("api-query-params");
const DailyMenu = require("../models/DailyMenuModel");
const Recipe = require("../models/RecipeModel");

const calculateTotalNutrition = async (meals) => {
  let totals = {
    totalCalories: 0,
    totalProtein: 0,
    totalFat: 0,
    totalCarbs: 0,
  };

  const allMeals = [
    ...(meals.breakfast || []),
    ...(meals.lunch || []),
    ...(meals.dinner || []),
    ...(meals.snack || []),
  ];

  for (const meal of allMeals) {
    const recipe = await Recipe.findById(meal.recipe);
    if (!recipe) continue;

    const quantity = meal.quantity || 1;
    totals.totalCalories += (recipe.calories || 0) * quantity;
    totals.totalProtein += (recipe.nutrition?.protein || 0) * quantity;
    totals.totalFat += (recipe.nutrition?.fat || 0) * quantity;
    totals.totalCarbs += (recipe.nutrition?.carbs || 0) * quantity;
  }

  return totals;
};

const createDailyMenu = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { date, meals } = req.body;

  if (!date || !meals) {
    return res.status(400).json({ message: "Thiếu ngày hoặc bữa ăn" });
  }

  // Kiểm tra xem đã có thực đơn hôm đó chưa
  const existed = await DailyMenu.findOne({
    user: userId,
    date: new Date(date),
  });
  if (existed) {
    return res.status(400).json({ message: "Đã có thực đơn cho ngày này" });
  }

  const nutrition = await calculateTotalNutrition(meals);

  const newMenu = await DailyMenu.create({
    user: userId,
    date,
    meals,
    ...nutrition,
  });

  res.status(201).json({ success: true, data: newMenu });
});

const updateDailyMenu = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { date, meals } = req.body;

  if (!date || !meals) {
    return res.status(400).json({ message: "Thiếu ngày hoặc meals" });
  }

  const existingMenu = await DailyMenu.findOne({ user: userId, date });

  if (!existingMenu) {
    return res
      .status(404)
      .json({ message: "Thực đơn không tồn tại để cập nhật" });
  }

  // Tính lại dinh dưỡng
  const nutrition = await calculateTotalNutrition(meals);

  // Cập nhật thực đơn
  existingMenu.meals = meals;
  existingMenu.totalCalories = nutrition.totalCalories;
  existingMenu.totalProtein = nutrition.totalProtein;
  existingMenu.totalFat = nutrition.totalFat;
  existingMenu.totalCarbs = nutrition.totalCarbs;

  await existingMenu.save();

  res.status(200).json({
    success: true,
    message: "Cập nhật thực đơn thành công",
    dailyMenu: existingMenu,
  });
});

module.exports = { createDailyMenu, updateDailyMenu };
