const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const User = require("../models/UserModel");

const updateUserProfile = asyncHandler(async (req, res) => {
  const {
    full_name,
    phone,
    gender,
    date_of_birth,
    job,
    height,
    weight,
    calorieGoal,
    proteinGoal,
    fatGoal,
    carbGoal,
    profile_picture,
  } = req.body;

  try {
    // Lấy user ID từ token thông qua req.user
    const userId = req.user.userId;

    // Validate userId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400);
      throw new Error("Invalid user ID from token");
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      console.error(`User not found for _id: ${userId}`);
      res.status(404);
      throw new Error("Người dùng không tồn tại");
    }

    // Build the updated fields object
    const updatedFields = {};

    if (full_name) updatedFields.full_name = full_name.trim();
    if (phone) {
      if (!/^\d{10}$/.test(phone)) {
        res.status(400);
        throw new Error("Số điện thoại phải có đúng 10 chữ số");
      }
      updatedFields.phone = phone;
    }
    if (gender && ["male", "female", "other"].includes(gender)) {
      updatedFields.gender = gender;
    }
    if (date_of_birth) {
      const parsedDate = new Date(date_of_birth);
      if (!isNaN(parsedDate)) {
        updatedFields.date_of_birth = parsedDate;
      } else {
        res.status(400);
        throw new Error("Ngày sinh không hợp lệ");
      }
    }
    if (job) updatedFields.job = job.trim();
    if (height !== undefined && height >= 0) {
      updatedFields.height = Number(height);
    }
    if (weight !== undefined && weight >= 0) {
      updatedFields.weight = Number(weight);
    }
    if (calorieGoal !== undefined && calorieGoal >= 0) {
      updatedFields.calorieGoal = Number(calorieGoal);
    }
    if (proteinGoal !== undefined && proteinGoal >= 0) {
      updatedFields.proteinGoal = Number(proteinGoal);
    }
    if (fatGoal !== undefined && fatGoal >= 0) {
      updatedFields.fatGoal = Number(fatGoal);
    }
    if (carbGoal !== undefined && carbGoal >= 0) {
      updatedFields.carbGoal = Number(carbGoal);
    }
    if (profile_picture) {
      updatedFields.profile_picture = profile_picture;
    }

    // Update the user with validated fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedFields },
      {
        new: true,
        runValidators: true,
      }
    ).populate("account", "email role authProvider");

    // Return the updated user data
    res.status(200).json({
      _id: updatedUser._id,
      full_name: updatedUser.full_name,
      email: updatedUser.account.email,
      phone: updatedUser.phone,
      role: updatedUser.account.role,
      authProvider: updatedUser.account.authProvider,
      profile_picture: updatedUser.profile_picture,
      gender: updatedUser.gender,
      date_of_birth: updatedUser.date_of_birth,
      job: updatedUser.job,
      height: updatedUser.height,
      weight: updatedUser.weight,
      calorieGoal: updatedUser.calorieGoal,
      proteinGoal: updatedUser.proteinGoal,
      fatGoal: updatedUser.fatGoal,
      carbGoal: updatedUser.carbGoal,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    });
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    res.status(error.status || 500).json({
      message: error.message || "Lỗi server khi cập nhật thông tin người dùng",
    });
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isAdmin) {
    res.status(403); // 403 Forbidden for restricted action
    throw new Error("Can't delete admin user");
  }

  await user.deleteOne();
  res.status(200).json({ message: "User deleted successfully" });
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  // 🔍 Kiểm tra dữ liệu đầu vào
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    if (!user.password_hash) {
      return res
        .status(500)
        .json({ message: "Lỗi hệ thống: Không tìm thấy mật khẩu" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu cũ không đúng" });
    }

    user.password_hash = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Thay đổi mật khẩu thành công" });
  } catch (error) {
    console.error("❌ Lỗi khi đổi mật khẩu:", error);
    res.status(500).json({ message: "Lỗi server, thử lại sau" });
  }
});

const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getProfileUser = asyncHandler(async (req, res) => {
  try {
    // Lấy userId từ token đã được decode trong middleware protect
    const { userId } = req.user;

    // Tìm user và populate thông tin account
    const user = await User.findById(userId)
      .select("-password_hash -refreshToken")
      .populate("account", "email role authProvider");

    if (!user) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thông tin người dùng" });
    }

    // Tạo object response với đầy đủ thông tin
    const userResponse = {
      _id: user._id,
      full_name: user.full_name,
      email: user.account.email,
      phone: user.phone,
      role: user.account.role,
      authProvider: user.account.authProvider,
      profile_picture: user.profile_picture,
      gender: user.gender,
      date_of_birth: user.date_of_birth,
      job: user.job,
      height: user.height,
      weight: user.weight,
      calorieGoal: user.calorieGoal,
      proteinGoal: user.proteinGoal,
      fatGoal: user.fatGoal,
      carbGoal: user.carbGoal,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.json(userResponse);
  } catch (error) {
    console.error("Error in getProfileUser:", error);
    res.status(500).json({
      message: "Lỗi server khi lấy thông tin người dùng",
      error: error.message,
    });
  }
});

const getUserById = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select(
      "-password_hash -refreshToken"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      authProvider: user.authProvider,
      createdAt: user.createdAt,
    });
  } catch (error) {}
});

const getAllUser = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const totalUsers = await User.countDocuments({ role: "USER" });
    const totalPages = Math.ceil(totalUsers / limit);

    const users = await User.find({ role: "USER" })
      .skip(skip) // ✅ Phân trang đúng
      .limit(limit)
      .sort({ createdAt: -1 });

    // Trả về dữ liệu đúng định dạng
    res.json({
      page,
      limit,
      totalUsers,
      totalPages,
      users: users.map((user) => ({
        _id: user._id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        authProvider: user.authProvider,
        isActive: user.isActive ? "Active" : "Inactive",
        createdAt: user.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách người dùng",
      error: error.message,
    });
  }
});

module.exports = {
  updateUserProfile,
  deleteUser,
  changePassword,
  getUsers,
  getProfileUser,
  getUserById,
  getAllUser,
};
