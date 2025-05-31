const asyncHandler = require("express-async-handler");
const aqp = require("api-query-params");
const Blog = require("../models/BlogModel");
const BlogCategory = require("../models/BlogCategoryModel");
const { createSlug, createUniqueSlug } = require("../utils/slugify");

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
    .populate([
      { path: "category", select: "_id name slug" },
      { path: "author", select: "name profile_picture" },
    ]);

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

const getBlogBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const blog = await Blog.findOne({ slug })
    .populate("category", "name slug")
    .populate("author", "name profile_picture");

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
  const { category, title, summary, coverImage, sections, author, tags, date } =
    req.body;

  // Validate required fields
  if (!title || !summary || !category || !author) {
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
  }

  // Validate sections array if provided
  if (sections && (!Array.isArray(sections) || sections.length === 0)) {
    return res.status(400).json({ message: "Cần ít nhất một phần nội dung" });
  }

  // Tạo slug từ title
  const baseSlug = createSlug(title);

  // Kiểm tra slug đã tồn tại
  const checkExisting = async (slug) => {
    return await Blog.findOne({ slug });
  };

  // Tạo slug duy nhất
  const uniqueSlug = await createUniqueSlug(baseSlug, checkExisting);

  // Create new blog with validated data
  const newBlog = new Blog({
    category: category.trim(),
    title: title.trim(),
    slug: uniqueSlug,
    summary: summary.trim(),
    coverImage,
    sections: sections
      ? sections.map((section) => ({
          heading: section.heading?.trim(),
          text: section.text.trim(),
          image: section.image,
        }))
      : [],
    author,
    tags: tags ? tags.map((tag) => tag.trim()) : [],
    date: date || new Date().toISOString(),
    views: 0,
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
  const updateData = { ...req.body };

  const blog = await Blog.findById(id);

  if (!blog) {
    return res.status(404).json({ message: "Không tìm thấy bài viết" });
  }

  // Nếu title thay đổi, cập nhật slug
  if (updateData.title && updateData.title !== blog.title) {
    const baseSlug = createSlug(updateData.title);
    const checkExisting = async (slug) => {
      return await Blog.findOne({ slug, _id: { $ne: id } });
    };
    updateData.slug = await createUniqueSlug(baseSlug, checkExisting);
  }

  // Validate sections if they are being updated
  if (updateData.sections) {
    if (!Array.isArray(updateData.sections)) {
      return res.status(400).json({ message: "Sections phải là một mảng" });
    }

    // Validate each section
    updateData.sections = updateData.sections.map((section) => ({
      heading: section.heading?.trim(),
      text: section.text.trim(),
      image: section.image,
    }));
  }

  // Trim strings if they exist in updateData
  if (updateData.title) updateData.title = updateData.title.trim();
  if (updateData.summary) updateData.summary = updateData.summary.trim();
  if (updateData.category) updateData.category = updateData.category.trim();
  if (updateData.tags) {
    updateData.tags = updateData.tags.map((tag) => tag.trim());
  }

  // Update the blog
  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    message: "Cập nhật bài viết thành công",
    blog: updatedBlog,
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

// Blog Category Controllers
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await BlogCategory.find({}).sort({ name: 1 });
  res.status(200).json(categories);
});

const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await BlogCategory.findById(id);

  if (!category) {
    res.status(404);
    throw new Error("Không tìm thấy danh mục");
  }

  res.status(200).json(category);
});

const getCategoryBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  // Tìm category bằng slug
  const category = await BlogCategory.findOne({ slug });

  if (!category) {
    res.status(404);
    throw new Error("Không tìm thấy danh mục");
  }

  // Tìm tất cả các bài viết thuộc category này
  const blogs = await Blog.find({ category: category._id })
    .select("title slug summary coverImage date views tags")
    .populate("author", "name profile_picture")
    .sort({ createdAt: -1 });

  res.status(200).json({
    category,
    blogs,
    totalBlogs: blogs.length,
  });
});

const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Tên danh mục là bắt buộc");
  }

  // Tạo slug từ name
  const slug = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Xóa các ký tự đặc biệt
    .replace(/\s+/g, "-") // Thay thế khoảng trắng bằng dấu gạch ngang
    .replace(/-+/g, "-"); // Xóa các dấu gạch ngang liên tiếp

  // Kiểm tra xem category đã tồn tại chưa
  const existingCategory = await BlogCategory.findOne({
    $or: [{ name }, { slug }],
  });

  if (existingCategory) {
    res.status(400);
    throw new Error("Danh mục đã tồn tại");
  }

  const category = await BlogCategory.create({
    name,
    slug,
    description,
  });

  res.status(201).json({
    message: "Tạo danh mục thành công",
    category,
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const category = await BlogCategory.findById(id);

  if (!category) {
    res.status(404);
    throw new Error("Không tìm thấy danh mục");
  }

  if (name) {
    // Nếu tên thay đổi, cập nhật cả slug
    const slug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    // Kiểm tra xem tên mới đã tồn tại chưa (trừ category hiện tại)
    const existingCategory = await BlogCategory.findOne({
      _id: { $ne: id },
      $or: [{ name }, { slug }],
    });

    if (existingCategory) {
      res.status(400);
      throw new Error("Danh mục với tên này đã tồn tại");
    }

    category.name = name;
    category.slug = slug;
  }

  if (description !== undefined) {
    category.description = description;
  }

  await category.save();

  res.status(200).json({
    message: "Cập nhật danh mục thành công",
    category,
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Kiểm tra xem category có đang được sử dụng không
  const blogsUsingCategory = await Blog.countDocuments({ category: id });

  if (blogsUsingCategory > 0) {
    res.status(400);
    throw new Error(
      "Không thể xóa danh mục này vì đang được sử dụng trong các bài viết"
    );
  }

  const category = await BlogCategory.findByIdAndDelete(id);

  if (!category) {
    res.status(404);
    throw new Error("Không tìm thấy danh mục");
  }

  res.status(200).json({
    message: "Xóa danh mục thành công",
    category,
  });
});

const deleteManyCategories = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400);
    throw new Error("Danh sách ID không hợp lệ");
  }

  // Kiểm tra xem có category nào đang được sử dụng không
  const blogsUsingCategories = await Blog.countDocuments({
    category: { $in: ids },
  });

  if (blogsUsingCategories > 0) {
    res.status(400);
    throw new Error(
      "Không thể xóa các danh mục đang được sử dụng trong các bài viết"
    );
  }

  const result = await BlogCategory.deleteMany({ _id: { $in: ids } });

  res.status(200).json({
    message: `Đã xóa ${result.deletedCount} danh mục`,
    deletedCount: result.deletedCount,
  });
});

module.exports = {
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  deleteManyBlogs,
  // Category Controllers
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  deleteManyCategories,
};
