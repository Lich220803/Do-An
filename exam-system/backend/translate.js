// backend/translate.js

const {Translate} = require('@google-cloud/translate').v2;

// Khởi tạo đối tượng Translate với API Key của bạn
const translate = new Translate({
  key: 'AIzaSyAyge7KSp1xGuRYlFUda2ImrqYeOtAowU8', // Thay thế bằng API Key của bạn
});

// Hàm dịch văn bản
async function translateText(text, targetLanguage) {
  try {
    const [translation] = await translate.translate(text, targetLanguage);
    return translation;  // Trả về văn bản đã dịch
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Lỗi khi dịch văn bản');
  }
}

module.exports = { translateText };
