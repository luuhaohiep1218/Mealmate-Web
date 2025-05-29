const asyncHandler = require("express-async-handler");
const aqp = require("api-query-params");
const Menu = require("../models/MenuModel");

const getAllMenus = asyncHandler(async (req, res) => {
  const { filter, skip, limit, sort, projection, population } = aqp(req.query);

  // Add custom search logic for name and description
  if (filter.search) {
    filter.$or = [
      { name: { $regex: filter.search, $options: "i" } },
      { description: { $regex: filter.search, $options: "i" } },
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

  // Add filter for menu type if provided
  if (filter.type) {
    filter.type = Array.isArray(filter.type)
      ? { $in: filter.type }
      : filter.type;
  }

  // Execute query with filters and populate recipes
  const menus = await Menu.find(filter)
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .select(projection)
    .populate({
      path: "recipes.recipe",
      select: "name description ingredients instructions",
    })
    .populate({
      path: "createdBy",
      select: "name email",
    });

  const total = await Menu.countDocuments(filter);

  if (menus.length === 0) {
    return res.status(404).json({ message: "Không tìm thấy thực đơn phù hợp" });
  }

  res.status(200).json({
    total,
    skip,
    limit,
    data: menus,
  });
});

const getMenuById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const menu = await Menu.findById(id)
    .populate({
      path: "recipes.recipe",
      select: "name description ingredients instructions",
    })
    .populate({
      path: "createdBy",
      select: "name email",
    });

  if (!menu) {
    res.status(404);
    throw new Error("Không tìm thấy thực đơn");
  }

  res.status(200).json(menu);
});

const createMenu = asyncHandler(async (req, res) => {
  const { name, description, type, serves, tags, recipes } = req.body;

  if (!name || !type || !serves || !recipes) {
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
  }

  // Add user ID from auth middleware
  const newMenu = new Menu({
    ...req.body,
    createdBy: req.user.userId,
  });

  await newMenu.save();

  // Populate the newly created menu
  const populatedMenu = await Menu.findById(newMenu._id)
    .populate({
      path: "recipes.recipe",
      select: "name description ingredients instructions",
    })
    .populate({
      path: "createdBy",
      select: "name email",
    });

  res.status(201).json({
    message: "Tạo thực đơn thành công",
    menu: populatedMenu,
  });
});

const updateMenu = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const menu = await Menu.findById(id);

  if (!menu) {
    return res.status(404).json({ message: "Không tìm thấy thực đơn" });
  }

  // Check if user is authorized to update this menu
  if (menu.createdBy.toString() !== req.user.userId) {
    res.status(403);
    throw new Error("Không có quyền chỉnh sửa thực đơn này");
  }

  // Update fields if provided in req.body
  Object.assign(menu, req.body);
  await menu.save();

  // Return populated menu
  const updatedMenu = await Menu.findById(id)
    .populate({
      path: "recipes.recipe",
      select: "name description ingredients instructions",
    })
    .populate({
      path: "createdBy",
      select: "name email",
    });

  res.status(200).json({
    message: "Cập nhật thực đơn thành công",
    menu: updatedMenu,
  });
});

const deleteMenu = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const menu = await Menu.findById(id);

  if (!menu) {
    return res.status(404).json({ message: "Không tìm thấy thực đơn" });
  }

  // Check if user is authorized to delete this menu
  if (menu.createdBy.toString() !== req.user.userId) {
    res.status(403);
    throw new Error("Không có quyền xóa thực đơn này");
  }

  await menu.deleteOne();

  res.status(200).json({ message: "Xóa thực đơn thành công" });
});

const deleteManyMenus = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res
      .status(400)
      .json({ message: "Danh sách ID cần xóa không hợp lệ" });
  }

  // Only delete menus created by the current user
  const result = await Menu.deleteMany({
    _id: { $in: ids },
    createdBy: req.user.userId,
  });

  res.status(200).json({
    message: `Đã xóa ${result.deletedCount} thực đơn`,
    deletedCount: result.deletedCount,
  });
});

module.exports = {
  getAllMenus,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
  deleteManyMenus,
};
