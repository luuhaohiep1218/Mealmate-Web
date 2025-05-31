const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "snack"],
      required: true,
    },
    tags: [String],

    // 👇 Thêm thuộc tính số người ăn
    serves: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },

    // Danh sách món ăn kèm số lượng khẩu phần
    recipes: [
      {
        recipe: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Recipe",
          required: true,
        },
        servings: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

// Middleware để tự động tạo slug từ name trước khi lưu
MenuSchema.pre("save", function (next) {
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

// Add method to check if a user can edit this menu
MenuSchema.methods.canEdit = function (userId) {
  return this.createdBy && this.createdBy.toString() === userId;
};

// Add static method to handle legacy menus without createdBy
MenuSchema.statics.findByIdWithCreator = async function (id) {
  const menu = await this.findById(id);
  if (!menu) return null;

  // If menu exists but has no creator, it's a legacy menu
  if (!menu.createdBy) {
    return {
      ...menu.toObject(),
      isLegacy: true,
    };
  }

  return menu;
};

module.exports = mongoose.model("Menu", MenuSchema);
