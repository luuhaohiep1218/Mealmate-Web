const asyncHandler = require("express-async-handler");
const aqp = require("api-query-params");
const Menu = require("../models/MenuModel");

const getAllMenus = asyncHandler(async (req, res) => {
  const { filter, skip, limit, sort, projection, population } = aqp(req.query);

  // Search logic
  if (filter.search) {
    filter.$or = [
      { name: { $regex: filter.search, $options: "i" } },
      { description: { $regex: filter.search, $options: "i" } },
    ];
    delete filter.search;
  }

  // Tags filtering
  if (filter.tags) {
    filter.tags = {
      $all: Array.isArray(filter.tags)
        ? filter.tags
        : filter.tags.split(",").map((tag) => tag.trim()),
    };
  }

  // Type filtering
  if (filter.type) {
    filter.type = Array.isArray(filter.type)
      ? { $in: filter.type }
      : filter.type;
  }

  // Fetch menus
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

  // Get all unique tags in the collection
  const tagAgg = await Menu.aggregate([
    { $unwind: "$tags" },
    { $group: { _id: "$tags" } },
    { $sort: { _id: 1 } },
  ]);
  const allTags = tagAgg.map((t) => t._id);

  const total = await Menu.countDocuments(filter);

  if (menus.length === 0) {
    return res.status(404).json({ message: "Không tìm thấy thực đơn phù hợp" });
  }

  // 👇 Trả về menus kèm danh sách tag
  res.status(200).json({
    total,
    skip,
    limit,
    tags: allTags, // <- thêm ở đây
    data: menus,
  });
});


const getMenuById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const menu = await Menu.findById(id)
    .populate({
      path: "recipes.recipe",
      select: "name description ingredients steps image prep_time cook_time total_time calories nutrition"
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
    return res.status(400).json({
      message: "Thiếu thông tin bắt buộc",
      details: {
        name: !name ? "Thiếu tên thực đơn" : null,
        type: !type ? "Thiếu loại bữa ăn" : null,
        serves: !serves ? "Thiếu số người ăn" : null,
        recipes: !recipes ? "Thiếu công thức" : null,
      },
    });
  }

  // Add user ID from req.user
  const newMenu = new Menu({
    name,
    description,
    type,
    serves,
    tags: Array.isArray(tags) ? tags : [],
    recipes: recipes.map((r) => ({
      recipe: r.recipe,
      servings: parseInt(r.servings) || 1,
    })),
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
  try {
    const { id } = req.params;
    const { name, description, type, serves, tags, recipes } = req.body;

    // Validate required fields
    if (!name || !type || !serves || !recipes) {
      return res.status(400).json({
        message: "Thiếu thông tin bắt buộc",
        details: {
          name: !name ? "Thiếu tên thực đơn" : null,
          type: !type ? "Thiếu loại bữa ăn" : null,
          serves: !serves ? "Thiếu số người ăn" : null,
          recipes: !recipes ? "Thiếu công thức" : null,
        },
      });
    }

    // Validate recipes array
    if (!Array.isArray(recipes)) {
      return res.status(400).json({
        message: "Định dạng công thức không hợp lệ",
        details: "recipes phải là một mảng",
      });
    }

    // Find menu with legacy check
    const menu = await Menu.findByIdWithCreator(id);

    if (!menu) {
      return res.status(404).json({ message: "Không tìm thấy thực đơn" });
    }

    // Handle legacy menus (menus without createdBy)
    if (menu.isLegacy) {
      const updatedMenu = await Menu.findByIdAndUpdate(
        id,
        {
          name,
          description,
          type,
          serves: parseInt(serves),
          tags: Array.isArray(tags) ? tags : [],
          recipes: recipes.map((r) => ({
            recipe: r.recipe,
            servings: parseInt(r.servings) || 1,
          })),
          createdBy: req.user.userId, // Use userId from req.user
          updatedAt: Date.now(),
        },
        {
          new: true,
          runValidators: true,
        }
      )
        .populate({
          path: "recipes.recipe",
          select: "name description ingredients instructions",
        })
        .populate({
          path: "createdBy",
          select: "name email",
        });

      if (!updatedMenu) {
        return res.status(500).json({
          message: "Cập nhật thực đơn thất bại",
          details: "Không thể cập nhật thực đơn cũ",
        });
      }

      return res.status(200).json({
        message: "Cập nhật thực đơn thành công",
        menu: updatedMenu,
      });
    }

    // For non-legacy menus, check authorization
    if (!menu.canEdit(req.user.userId)) {
      return res
        .status(403)
        .json({ message: "Không có quyền chỉnh sửa thực đơn này" });
    }

    // Update menu with new data
    const updatedMenu = await Menu.findByIdAndUpdate(
      id,
      {
        name,
        description,
        type,
        serves: parseInt(serves),
        tags: Array.isArray(tags) ? tags : [],
        recipes: recipes.map((r) => ({
          recipe: r.recipe,
          servings: parseInt(r.servings) || 1,
        })),
        updatedAt: Date.now(),
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate({
        path: "recipes.recipe",
        select: "name description ingredients instructions",
      })
      .populate({
        path: "createdBy",
        select: "name email",
      });

    if (!updatedMenu) {
      return res.status(404).json({ message: "Cập nhật thực đơn thất bại" });
    }

    res.status(200).json({
      message: "Cập nhật thực đơn thành công",
      menu: updatedMenu,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server khi cập nhật thực đơn",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
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
