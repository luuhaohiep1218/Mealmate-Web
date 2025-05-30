const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema({
  heading: { type: String, trim: true }, // Tiêu đề phụ từng phần (tùy chọn)
  text: { type: String, required: true, trim: true },
  image: { type: String },
});

const BlogSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
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
      type: String,
      required: false,
      trim: true,
    }, // Người viết blog (hoặc userId nếu liên kết với User)

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

const Blog = mongoose.model("Blog", BlogSchema);

module.exports = Blog;
