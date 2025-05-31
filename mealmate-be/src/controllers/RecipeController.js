const asyncHandler = require("express-async-handler");
const aqp = require("api-query-params");
const Recipe = require("../models/RecipeModel");
const { createSlug, createUniqueSlug } = require("../utils/slugify");

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

  // Handle multiple sort conditions
  let sortOptions = {};
  if (sort) {
    if (typeof sort === "object") {
      // If sort is already an object (from aqp), use it directly
      sortOptions = sort;
    } else if (typeof sort === "string") {
      // If sort is a string (e.g., "-rating,-views"), convert to object
      sortOptions = sort.split(",").reduce((acc, item) => {
        const isDesc = item.startsWith("-");
        const key = isDesc ? item.substring(1) : item;
        acc[key] = isDesc ? -1 : 1;
        return acc;
      }, {});
    }
  }

  // Execute the query with filters, sorting, pagination, etc.
  const recipes = await Recipe.find(filter)
    .skip(skip)
    .limit(limit)
    .sort(sortOptions)
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

  // Tăng số lượt xem
  recipe.views = (recipe.views || 0) + 1;
  await recipe.save();

  res.status(200).json(recipe);
});

const getRecipeBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const recipe = await Recipe.findOne({ slug });

  if (!recipe) {
    res.status(404);
    throw new Error("Không tìm thấy công thức");
  }

  // Tăng lượt xem
  recipe.views += 1;
  await recipe.save();

  res.status(200).json(recipe);
});

const createRecipe = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    image,
    prep_time,
    cook_time,
    total_time,
    servings,
    ingredients,
    steps,
    calories,
    nutrition,
    tags,
    rating,
  } = req.body;

  // Validate required fields
  if (
    !name ||
    !description ||
    !prep_time ||
    !cook_time ||
    !servings ||
    !calories
  ) {
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
  }

  // Validate ingredients array
  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({ message: "Cần ít nhất một nguyên liệu" });
  }

  // Validate steps array
  if (!steps || !Array.isArray(steps) || steps.length === 0) {
    return res.status(400).json({ message: "Cần ít nhất một bước thực hiện" });
  }

  // Tạo slug từ tên công thức
  const baseSlug = createSlug(name);

  // Kiểm tra slug đã tồn tại
  const checkExisting = async (slug) => {
    return await Recipe.findOne({ slug });
  };

  // Tạo slug duy nhất
  const uniqueSlug = await createUniqueSlug(baseSlug, checkExisting);

  // Create new recipe with validated data
  const newRecipe = new Recipe({
    name: name.trim(),
    slug: uniqueSlug,
    description: description.trim(),
    image,
    prep_time,
    cook_time,
    total_time: total_time || prep_time + cook_time,
    servings,
    ingredients: ingredients.map((ing) => ({
      name: ing.name.trim(),
      quantity: ing.quantity.trim(),
    })),
    steps: steps.map((step) => step.trim()),
    calories,
    nutrition: {
      protein: nutrition?.protein || 0,
      fat: nutrition?.fat || 0,
      carbs: nutrition?.carbs || 0,
    },
    tags: tags ? tags.map((tag) => tag.trim()) : [],
    rating: rating || 0,
  });

  try {
    await newRecipe.save();
    res.status(201).json({
      message: "Tạo món ăn thành công",
      recipe: newRecipe,
    });
  } catch (error) {
    res.status(400).json({
      message: "Lỗi khi tạo món ăn",
      error: error.message,
    });
  }
});

const updateRecipe = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const recipe = await Recipe.findById(id);

  if (!recipe) {
    return res.status(404).json({ message: "Không tìm thấy món ăn" });
  }

  // Nếu tên thay đổi, cập nhật slug
  if (req.body.name && req.body.name !== recipe.name) {
    const baseSlug = createSlug(req.body.name);
    const checkExisting = async (slug) => {
      return await Recipe.findOne({ slug, _id: { $ne: id } });
    };
    req.body.slug = await createUniqueSlug(baseSlug, checkExisting);
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
  getRecipeBySlug,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  deleteManyRecipes,
};
