const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { protect } = require("../middlewares/Auth");

const router = express.Router();

// Đảm bảo thư mục "uploads" tồn tại
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình multer để lưu ảnh
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ✅ API Upload 1 ảnh duy nhất
router.post("/", protect, (req, res) => {
  const uploadHandler = upload.single("file"); // chỉ nhận 1 file, field name là 'file'

  uploadHandler(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res
        .status(400)
        .json({ message: "Lỗi Multer!", error: err.message });
    } else if (err) {
      return res
        .status(500)
        .json({ message: "Lỗi server!", error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Không có file nào được upload" });
    }

    // ✅ Trả về URL đầy đủ của ảnh
    const fileUrl = `${req.protocol}://${req.get("host")}/api/upload/${
      req.file.filename
    }`;

    res.json({ message: "Upload thành công!", imageUrl: fileUrl });
  });
});

// Trả ảnh về từ tên file
router.get("/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(uploadDir, filename);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: "Ảnh không tồn tại" });
  }
});

module.exports = router;
