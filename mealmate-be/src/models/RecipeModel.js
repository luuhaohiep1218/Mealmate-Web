const mongoose = require("mongoose");

const IngredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, required: true }, // e.g., "300g", "1 muỗng canh"
});

const RecipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    prep_time: {
      type: Number, // in minutes
      required: true,
    },
    cook_time: {
      type: Number, // in minutes
      required: true,
    },
    total_time: {
      type: Number, // in minutes
      required: true,
    },
    servings: {
      type: Number,
      required: true,
    },
    ingredients: {
      type: [IngredientSchema],
      default: [],
    },
    steps: {
      type: [String],
      default: [],
    },
    calories: {
      type: Number,
      required: true,
    },
    nutrition: {
      protein: { type: Number, default: 0 }, // gram
      fat: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
    },
    tags: {
      type: [String], // e.g., ["Giàu protein", "Ít carb"]
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", RecipeSchema);
