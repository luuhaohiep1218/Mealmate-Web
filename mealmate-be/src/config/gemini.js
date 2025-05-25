require("dotenv").config();

// Khởi tạo Gemini

async function analyzeImageToText(filePath) {
  const { GoogleGenAI, createUserContent, createPartFromUri } = await import(
    "@google/genai"
  );
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  const fileUploadResult = await ai.files.upload({
    file: filePath,
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      createUserContent([
        "Hãy mô tả nội dung hình ảnh này bằng tiếng Việt.",
        createPartFromUri(fileUploadResult.uri, fileUploadResult.mimeType),
      ]),
    ],
  });

  const parts = response.candidates?.[0]?.content?.parts;
  const textPart = parts?.find((p) => p.text);
  return textPart?.text || "Không có phản hồi từ AI.";
}

module.exports = { analyzeImageToText };
