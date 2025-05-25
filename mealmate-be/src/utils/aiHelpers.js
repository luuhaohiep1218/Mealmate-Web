const synonyms = require("./ingredientSynonyms");
function cleanJsonCodeBlock(raw) {
  if (typeof raw !== "string") return raw;
  return raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/, "")
    .trim();
}

const ingredientExtractionPrompt = `
Hãy phân tích bức ảnh sau để xác định các nguyên liệu nấu ăn xuất hiện trong đó và số lượng tương ứng.  
Trả về kết quả dưới dạng một mảng JSON, chỉ bao gồm tên nguyên liệu và số lượng ước lượng được (ví dụ: "300g", "1 quả", "2 muỗng canh").

Định dạng trả về:
[
  { "name": "Tên nguyên liệu", "quantity": "Số lượng" }
]

Yêu cầu:
- Viết đúng cú pháp JSON, không thêm mô tả bên ngoài.
- Chỉ liệt kê các nguyên liệu có thể nhìn thấy rõ trong ảnh.
- Không suy đoán các nguyên liệu không có trong hình.
`;

function normalizeIngredient(name) {
  const cleaned = name.toLowerCase().trim();

  // Trả về synonym nếu có, không thì giữ nguyên
  return synonyms[cleaned] || cleaned;
}

module.exports = {
  cleanJsonCodeBlock,
  ingredientExtractionPrompt,
  normalizeIngredient,
};
