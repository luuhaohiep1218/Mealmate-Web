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

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
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
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Middleware để tự động tạo slug từ name trước khi lưu
RecipeSchema.pre("save", function (next) {
  if (!this.isModified("name")) {
    return next();
  }

  // Chuyển name thành slug
  this.slug = this.name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Xóa các ký tự đặc biệt
    .replace(/\s+/g, "-") // Thay khoảng trắng bằng dấu gạch ngang
    .replace(/-+/g, "-") // Xóa các dấu gạch ngang liên tiếp
    .trim(); // Xóa khoảng trắng đầu cuối

  next();
});

module.exports = mongoose.model("Recipe", RecipeSchema);
