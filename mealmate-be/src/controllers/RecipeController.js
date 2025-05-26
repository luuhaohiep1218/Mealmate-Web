const asyncHandler = require("express-async-handler");
const aqp = require("api-query-params");
const Recipe = require("../models/RecipeModel");

const getAllRecipes = asyncHandler(async (req, res) => {
  // Parse query parameters using api-query-params
  const { filter, skip, limit, sort, projection, population } = aqp(req.query);

  // Add custom search logic for name and description
  if (filter.search) {
    filter.$or = [
      { name: { $regex: filter.search, $options: "i" } },
      { description: { $regex: filter.search, $options: "i" } },
    ];
    delete filter.search; // Remove search from filter to avoid invalid query
  }

  // Add custom logic for tags (if provided, ensure all tags are present)
  if (filter.tags) {
    filter.tags = {
      $all: Array.isArray(filter.tags)
        ? filter.tags
        : filter.tags.split(",").map((tag) => tag.trim()),
    };
  }

  // Execute the query with filters, sorting, pagination, etc.
  const recipes = await Recipe.find(filter)
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .select(projection)
    .populate(population);

  // Get total count for pagination metadata
  const total = await Recipe.countDocuments(filter);

  // Check if any recipes were found
  if (recipes.length === 0) {
    return res
      .status(404)
      .json({ message: "No recipes found matching the criteria" });
  }

  res.status(200).json({
    total,
    skip,
    limit,
    data: recipes,
  });
});

const getRecipeById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const recipe = await Recipe.findById(id);

  if (!recipe) {
    res.status(404);
    throw new Error("Recipe not found");
  }

  res.status(200).json(recipe);
});
const createRecipe = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    image,
    category,
    preparationTime,
    servings,
    ingredients,
    steps,
    calories,
    nutrition,
    tags,
    rating,
  } = req.body;

  if (
    !name ||
    !description ||
    !category ||
    !preparationTime ||
    !servings ||
    !calories
  ) {
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
  }

  const newRecipe = new Recipe({
    name,
    description,
    image,
    category,
    preparationTime,
    servings,
    ingredients,
    steps,
    calories,
    nutrition,
    tags,
    rating,
  });

  await newRecipe.save();

  res.status(201).json({
    message: "Tạo món ăn thành công",
    recipe: newRecipe,
  });
});

const updateRecipe = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const recipe = await Recipe.findById(id);

  if (!recipe) {
    return res.status(404).json({ message: "Không tìm thấy món ăn" });
  }

  // Cập nhật các trường nếu có trong req.body
  Object.assign(recipe, req.body);

  await recipe.save();

  res.status(200).json({
    message: "Cập nhật món ăn thành công",
    recipe,
  });
});
const deleteRecipe = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const recipe = await Recipe.findById(id);

  if (!recipe) {
    return res.status(404).json({ message: "Không tìm thấy món ăn" });
  }

  await recipe.deleteOne();

  res.status(200).json({ message: "Xoá món ăn thành công" });
});
const deleteManyRecipes = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res
      .status(400)
      .json({ message: "Danh sách ID cần xoá không hợp lệ" });
  }

  const result = await Recipe.deleteMany({ _id: { $in: ids } });

  res.status(200).json({
    message: `Đã xoá ${result.deletedCount} món ăn`,
    deletedCount: result.deletedCount,
  });
});

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  deleteManyRecipes,
};
