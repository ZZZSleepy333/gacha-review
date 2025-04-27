const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();
const Character = require('../models/Character');

router.post('/api/crawl', async (req, res) => {
  try {
    // URL của trang Housamo Wiki cần crawl
    const url = 'https://housamo.wiki/Catalog';
    
    // Lấy HTML từ trang web
    const response = await axios.get(url);
    const html = response.data;
    
    // Sử dụng Cheerio để parse HTML
    const $ = cheerio.load(html);
    
    // Mảng để lưu các nhân vật đã crawl
    const characters = [];
    
    // Tìm tất cả các phần tử li có chứa thông tin nhân vật
    $('li[data-id]').each((index, element) => {
      const $element = $(element);
      
      // Lấy các thuộc tính từ phần tử HTML
      const characterId = $element.attr('data-id');
      const rarity = parseInt($element.attr('data-rarity'));
      const name = $element.attr('data-name');
      const element = parseInt($element.attr('data-element'));
      const weapon = parseInt($element.attr('data-weapon'));
      
      // Lấy URL hình ảnh
      const imageUrl = $element.find('img.hero-chara-icon').attr('src');
      
      // Tạo đối tượng nhân vật với các trường bổ sung
      const character = {
        characterId,
        name,
        rarity,
        element,
        weapon,
        imageUrl,
        rateUp: false, // Mặc định là false
        secondaryRateUp: false, // Mặc định là false
        tags: '', // Mặc định là chuỗi rỗng
      };
      
      characters.push(character);
    });
    
    // Lưu các nhân vật vào cơ sở dữ liệu
    // Sử dụng upsert để cập nhật nếu đã tồn tại hoặc thêm mới nếu chưa
    let count = 0;
    for (const character of characters) {
      await Character.findOneAndUpdate(
        { characterId: character.characterId },
        character,
        { upsert: true, new: true }
      );
      count++;
    }
    
    res.json({ success: true, count, message: `Đã crawl và lưu ${count} nhân vật.` });
  } catch (error) {
    console.error('Lỗi khi crawl dữ liệu:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi crawl dữ liệu.' });
  }
});

module.exports = router;