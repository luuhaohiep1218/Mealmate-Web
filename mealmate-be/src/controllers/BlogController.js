const asyncHandler = require("express-async-handler");
const aqp = require("api-query-params");
const Blog = require("../models/BlogModel");

const getAllBlogs = asyncHandler(async (req, res) => {
  // Parse query parameters using api-query-params
  const { filter, skip, limit, sort, projection, population } = aqp(req.query);

  // Add custom search logic for title and summary
  if (filter.search) {
    filter.$or = [
      { title: { $regex: filter.search, $options: "i" } },
      { summary: { $regex: filter.search, $options: "i" } },
    ];
    delete filter.search;
  }

  // Add custom logic for tags
  if (filter.tags) {
    filter.tags = {
      $all: Array.isArray(filter.tags)
        ? filter.tags
        : filter.tags.split(",").map((tag) => tag.trim()),
    };
  }

  // Execute the query with filters, sorting, pagination, etc.
  const blogs = await Blog.find(filter)
    .skip(skip)
    .limit(limit || 10)
    .sort(sort || { createdAt: -1 })
    .select(projection)
    .populate(population);

  // Get total count for pagination metadata
  const total = await Blog.countDocuments(filter);

  // Check if any blogs were found
  if (blogs.length === 0) {
    return res
      .status(404)
      .json({ message: "Không tìm thấy bài viết nào phù hợp" });
  }

  res.status(200).json({
    total,
    skip,
    limit,
    data: blogs,
  });
});

const getBlogById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const blog = await Blog.findById(id);

  if (!blog) {
    res.status(404);
    throw new Error("Không tìm thấy bài viết");
  }

  // Tăng lượt xem
  blog.views += 1;
  await blog.save();

  res.status(200).json(blog);
});

const createBlog = asyncHandler(async (req, res) => {
  const { category, title, summary, coverImage, sections, author, tags } =
    req.body;

  // Validate required fields
  if (!title || !summary || !category || !sections || !author) {
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
  }

  // Validate sections array
  if (!Array.isArray(sections) || sections.length === 0) {
    return res.status(400).json({ message: "Cần ít nhất một phần nội dung" });
  }

  // Create new blog with validated data
  const newBlog = new Blog({
    category: category.trim(),
    title: title.trim(),
    summary: summary.trim(),
    coverImage,
    sections: sections.map((section) => ({
      title: section.title.trim(),
      content: section.content.trim(),
      image: section.image,
    })),
    author,
    tags: tags ? tags.map((tag) => tag.trim()) : [],
    views: 0,
    date: new Date(),
  });

  try {
    await newBlog.save();
    res.status(201).json({
      message: "Tạo bài viết thành công",
      blog: newBlog,
    });
  } catch (error) {
    res.status(400).json({
      message: "Lỗi khi tạo bài viết",
      error: error.message,
    });
  }
});

const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const blog = await Blog.findById(id);

  if (!blog) {
    return res.status(404).json({ message: "Không tìm thấy bài viết" });
  }

  // Cập nhật các trường nếu có trong req.body
  Object.assign(blog, req.body);

  await blog.save();

  res.status(200).json({
    message: "Cập nhật bài viết thành công",
    blog,
  });
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const blog = await Blog.findById(id);

  if (!blog) {
    return res.status(404).json({ message: "Không tìm thấy bài viết" });
  }

  await blog.deleteOne();

  res.status(200).json({ message: "Xoá bài viết thành công" });
});

const deleteManyBlogs = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res
      .status(400)
      .json({ message: "Danh sách ID cần xoá không hợp lệ" });
  }

  const result = await Blog.deleteMany({ _id: { $in: ids } });

  res.status(200).json({
    message: `Đã xoá ${result.deletedCount} bài viết`,
    deletedCount: result.deletedCount,
  });
});

module.exports = {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  deleteManyBlogs,
};
