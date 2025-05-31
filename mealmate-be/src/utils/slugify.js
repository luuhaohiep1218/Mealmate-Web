/**
 * Chuyển đổi chuỗi thành slug URL thân thiện
 * Xử lý các ký tự đặc biệt và dấu tiếng Việt
 */

const vietnameseMap = {
  à: "a",
  á: "a",
  ạ: "a",
  ả: "a",
  ã: "a",
  â: "a",
  ầ: "a",
  ấ: "a",
  ậ: "a",
  ẩ: "a",
  ẫ: "a",
  ă: "a",
  ằ: "a",
  ắ: "a",
  ặ: "a",
  ẳ: "a",
  ẵ: "a",
  è: "e",
  é: "e",
  ẹ: "e",
  ẻ: "e",
  ẽ: "e",
  ê: "e",
  ề: "e",
  ế: "e",
  ệ: "e",
  ể: "e",
  ễ: "e",
  ì: "i",
  í: "i",
  ị: "i",
  ỉ: "i",
  ĩ: "i",
  ò: "o",
  ó: "o",
  ọ: "o",
  ỏ: "o",
  õ: "o",
  ô: "o",
  ồ: "o",
  ố: "o",
  ộ: "o",
  ổ: "o",
  ỗ: "o",
  ơ: "o",
  ờ: "o",
  ớ: "o",
  ợ: "o",
  ở: "o",
  ỡ: "o",
  ù: "u",
  ú: "u",
  ụ: "u",
  ủ: "u",
  ũ: "u",
  ư: "u",
  ừ: "u",
  ứ: "u",
  ự: "u",
  ử: "u",
  ữ: "u",
  ỳ: "y",
  ý: "y",
  ỵ: "y",
  ỷ: "y",
  ỹ: "y",
  đ: "d",
};

/**
 * Chuyển đổi ký tự có dấu thành không dấu
 * @param {string} str - Chuỗi cần chuyển đổi
 * @returns {string} Chuỗi đã được chuyển đổi
 */
const removeVietnameseTones = (str) => {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, (char) => vietnameseMap[char] || "");
};

/**
 * Tạo slug từ chuỗi đầu vào
 * @param {string} str - Chuỗi cần chuyển đổi thành slug
 * @param {Object} options - Tùy chọn cho việc tạo slug
 * @param {boolean} options.lower - Chuyển đổi thành chữ thường (mặc định: true)
 * @param {boolean} options.strict - Loại bỏ tất cả ký tự đặc biệt (mặc định: true)
 * @returns {string} Slug đã được tạo
 */
const createSlug = (str, options = {}) => {
  const defaultOptions = {
    lower: true,
    strict: true,
    ...options,
  };

  // Nếu chuỗi đầu vào không hợp lệ, trả về chuỗi rỗng
  if (!str) return "";

  // Chuyển đổi thành chữ thường nếu option lower = true
  let slug = defaultOptions.lower ? str.toLowerCase() : str;

  // Xử lý ký tự tiếng Việt
  slug = removeVietnameseTones(slug);

  // Xử lý các ký tự đặc biệt và khoảng trắng
  if (defaultOptions.strict) {
    slug = slug
      .replace(/[^\w\s-]/g, "") // Xóa ký tự đặc biệt
      .replace(/\s+/g, "-") // Thay khoảng trắng bằng dấu gạch ngang
      .replace(/-+/g, "-") // Xóa các dấu gạch ngang liên tiếp
      .trim(); // Xóa khoảng trắng đầu cuối
  }

  return slug;
};

/**
 * Tạo slug duy nhất bằng cách thêm số vào cuối nếu cần
 * @param {string} baseSlug - Slug cơ bản
 * @param {Function} checkExisting - Hàm kiểm tra slug đã tồn tại
 * @returns {Promise<string>} Slug duy nhất
 */
const createUniqueSlug = async (baseSlug, checkExisting) => {
  let slug = baseSlug;
  let counter = 1;

  while (await checkExisting(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

module.exports = {
  createSlug,
  createUniqueSlug,
  removeVietnameseTones,
};
