const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema({
  heading: { type: String, trim: true }, // Tiêu đề phụ từng phần (tùy chọn)
  text: { type: String, required: true, trim: true },
  image: { type: String },
});

const BlogSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogCategory",
      required: true,
    },

    title: {
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

    summary: {
      type: String,
      required: true,
      trim: true,
    },

    coverImage: {
      type: String,
    },

    sections: [SectionSchema],

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ], // Thẻ phân loại: "keto", "vegan", "mẹo bếp", v.v.

    date: {
      type: String,
      required: true,
    }, // Ngày viết bài (hoặc lấy từ timestamps cũng được)

    views: {
      type: Number,
      default: 0,
    }, // Đếm số lượt xem
  },
  { timestamps: true }
);

// Middleware để tự động tạo slug từ title trước khi lưu
BlogSchema.pre("save", function (next) {
  if (!this.isModified("title")) {
    return next();
  }

  // Chuyển title thành slug
  this.slug = this.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Xóa các ký tự đặc biệt
    .replace(/\s+/g, "-") // Thay khoảng trắng bằng dấu gạch ngang
    .replace(/-+/g, "-") // Xóa các dấu gạch ngang liên tiếp
    .trim(); // Xóa khoảng trắng đầu cuối

  next();
});

const Blog = mongoose.model("Blog", BlogSchema);

module.exports = Blog;
