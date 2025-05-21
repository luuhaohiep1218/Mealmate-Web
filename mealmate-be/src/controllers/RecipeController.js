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

module.exports = {
  getAllRecipes,
  getRecipeById,
};
