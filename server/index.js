require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cheerio = require("cheerio");
const axios = require("axios"); // Thêm dòng này

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const corsOptions = {
  origin: ["https://gacha-review-2.vercel.app", "http://localhost:3000"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const LimitedKeywords = [
  "sol",
  "orgus",
  "gordon",
  "nekros",
  "fafnir",
  "claus",
  "jormungandr",
  "triton",
  "jinn",
  "dagon",
  "israfil",
  "hastur",
  "hei long yi quan",
  "willie wildcat",
  "∞",
  "kyoma",
  "curren",
  "kirito",
  "bigfoot",
  "quantum",
  "masashi",
  "beowulf",
  "gargoyle",
  "jack",
];

const WelfareKeywords = [
  "gullin",
  "arach",
  "astar",
  "hero",
  "yamasachihiko",
  "oguchi",
  "goro",
  "inaba",
  "reprobus",
  "kumano",
  "yig",
  "yule",
  "sitri",
  "benten",
  "zao",
  "kiji",
  "agyo",
];

const characterSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    rarity: { type: Number, required: true },
    attribute: {
      type: String,
      required: true,
      enum: [
        "Fire",
        "Water",
        "Wood",
        "Aether",
        "Nether",
        "All",
        "Valiant",
        "Infernal",
        "World",
        "Null",
        "Infinity",
        "Divine",
      ],
    },
    weaponType: {
      type: String,
      required: true,
      enum: [
        "Slash",
        "Long Slash",
        "Thrust",
        "Blunt",
        "Shot",
        "Snipe",
        "Magic",
        "None",
        "All",
      ],
    },
    school: {
      type: String,
      required: true,
      enum: [
        "Unknown",
        "Akihabara Academy",
        "Ameyoko Costume Academy",
        "Bukuro Academy",
        "Daikanyama Academy",
        "Fujimi Academy",
        "Impecunia Academy",
        "Kabukicho Academy",
        "Kamata Technical Academy",
        "Kiou Police Academy",
        "Kudan Martial Arts Academy",
        "Nakano Performing Arts Academy",
        "Nippori Online Academy",
        "Ojibo Academy",
        "Penitentia Academy",
        "Roppongi Academy",
        "Setagaya Agricultural Academy",
        "Shinjuku Academy",
        "Suidocho Business Academy",
        "Togo Academy",
        "Tokyo Fire and Disaster Management University",
        "Tokyo Santa School",
        "Toyosu Marine Academy",
        "Ueno Academy",
        "Umamichi Academy",
        "Yoyogi Academy",
      ],
    },
    guild: {
      type: [String],
      required: true,
      enum: [
        "Summoners",
        "Berserkers",
        "Tycoons",
        "Wisemen",
        "Missionaries",
        "Entertainers",
        "Beast Tamers",
        "Gurus",
        "Agents",
        "Outlaws",
        "Game Masters",
        "Wanderers",
        "Creators",
        "Genociders",
        "Crafters",
        "Warmongers",
        "Rule Makers",
        "Invaders",
        "Exters",
        "Wild Hunt",
        "Unaffiliated",
        "Independent",
      ],
    },
    affiliation: {
      // Thêm trường mới
      type: String,
      required: true,
      enum: [
        "None",
        "Eight Dog Warriors",
        "Shinjuku Academy Mountaineers",
        "Viral Influence",
        "Setagaya Mountaineering Club",
      ],
    },
    roles: {
      type: [String],
      required: true,
      enum: [
        "Carry",
        "Damage Amplifier",
        "Sustainer",
        "Mover",
        "Charger",
        "Bounty",
        "Weapon Changer",
        "HP Decrease",
      ],
    },
    voiceActors: { type: String, required: true },
    illustrators: { type: String, required: true },
    maxHp: { type: Number, required: true },
    maxAttack: { type: Number, required: true },
    chargeSkill: {
      chargeSkillName: { type: String, required: true },
      chargeSkillDescription: { type: String, required: true },
      csType: {
        type: String,
        required: true,
        enum: [
          "Slash",
          "Long Slash",
          "Thrust",
          "Blunt",
          "Shot",
          "Snipe",
          "Magic",
          "None",
          "All",
        ],
      },
    },
    adminReview: {
      type: String,
      required: true,
      enum: ["D", "C", "B", "A", "A+", "S", "S+"], // Giới hạn giá trị
    },
    strongPoints: { type: String, required: true },
    weakPoints: { type: String, required: true },
    finalReview: {
      type: String,
      required: true,
    },
    characterType: {
      type: String,
      required: true,
      enum: [
        "Permanent",
        "Limited",
        "Christmas Variant",
        "Valentine Variant",
        "Summer Variant",
        "Halloween Variant",
        "Main Story Variant",
        "Welfare",
      ], // Giới hạn giá trị
    },
  },
  { _id: true }
);

const Character = mongoose.model("Character", characterSchema);

app.get("/api/characters", async (req, res) => {
  try {
    const characters = await Character.find().sort({ createdAt: -1 });
    res.json(characters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Thêm nhân vật mới (admin)
app.post("/api/characters", async (req, res) => {
  // Trong thực tế cần thêm middleware xác thực admin
  const character = new Character(req.body);
  try {
    const newCharacter = await character.save();
    res.status(201).json(newCharacter);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Cập nhật nhân vật (admin)
app.put("/api/characters/:id", async (req, res) => {
  try {
    const updatedCharacter = await Character.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedCharacter);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Xóa nhân vật (admin)
app.delete("/api/characters/:id", async (req, res) => {
  try {
    await Character.findByIdAndDelete(req.params.id);
    res.json({ message: "Character deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Trong server.js (backend)
app.get("/api/characters/:id", async (req, res) => {
  try {
    const character = await Character.findOne({ _id: req.params.id }); // Sử dụng findOne thay vì findById
    if (!character) {
      return res.status(404).json({ message: "Character not found" });
    }
    res.json(character);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// const adminAuth = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   if (authHeader && authHeader === `Bearer ${process.env.ADMIN_TOKEN}`) {
//     next();
//   } else {
//     res.status(401).json({ message: "Unauthorized" });
//   }
// };

// // Bảo vệ các route admin
// app.post("/api/characters", adminAuth, async (req, res) => {
//   /* ... */
// });
// app.put("/api/characters/:id", adminAuth, async (req, res) => {
//   /* ... */
// });
// app.delete("/api/characters/:id", adminAuth, async (req, res) => {
//   /* ... */
// });
const availableSchema = new mongoose.Schema({
  rarity: { type: Number, required: true },
  image: { type: String, required: true },
  name: { type: String, required: true },

  tags: { type: String },
});

const Available = mongoose.model("Available", availableSchema);

// API endpoint để crawl và lưu dữ liệu
const crawlCharacters = async () => {
  try {
    const url = "https://housamo-skill.netlify.app/charas/"; // Thay đổi URL nếu cần
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const characters = [];

    $("#chara-list li").each((_, element) => {
      const $el = $(element);
      const name = $el.find("a").text().trim();
      const rarity = parseInt($el.attr("data-rarity"), 10);
      const image = $el.find("img").attr("src");

      // Xử lý tags
      let tags = "";
      if (
        LimitedKeywords &&
        LimitedKeywords.some((keyword) =>
          name.toLowerCase().includes(keyword)
        ) &&
        name.includes("Standard")
      )
        tags = "Limited";
      else if (
        WelfareKeywords &&
        WelfareKeywords.some((keyword) =>
          name.toLowerCase().includes(keyword)
        ) &&
        name.includes("Standard")
      )
        tags = "Welfare";
      else if (name.includes("Standard")) tags = "Standard";
      else if (!name.includes("(")) tags = "New";
      else tags = "Event Limited";

      if (!name.includes("Protagonist")) {
        characters.push({
          name,
          rarity,
          image,
          tags,
        });
      }
    });

    return characters;
  } catch (error) {
    console.error("❌ Lỗi khi crawl dữ liệu:", error);
    return [];
  }
};

app.get("/api/crawl", async (req, res) => {
  try {
    const characters = await crawlCharacters();

    // Thêm dữ liệu mới
    for (const character of characters) {
      await Available.findOneAndUpdate(
        { name: character.name, rarity: character.rarity },
        character,
        { upsert: true, new: true }
      );
    }

    const availableCharacters = await Available.find();
    res.json(availableCharacters);
  } catch (error) {
    console.error("❌ Lỗi khi crawl hoặc lưu dữ liệu:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
});

app.get("/api/available", async (req, res) => {
  try {
    const availableCharacters = await Available.find();
    res.json(availableCharacters);
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách nhân vật:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
});

// API để cập nhật nhân vật có sẵn
app.put("/api/available", async (req, res) => {
  try {
    const { characters } = req.body;

    for (const character of characters) {
      await Available.findByIdAndUpdate(character._id, character, {
        new: true,
      });
    }

    res.json({ message: "Cập nhật thành công" });
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật nhân vật:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
});
// Schema cho Banner
const bannerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    characters: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "Available" },
        name: { type: String },
        image: { type: String },
        rarity: { type: Number },
        rateUpStatus: {
          type: String,
          enum: ["normal", "rateup-1", "rateup-2"],
          default: "normal",
        },
      },
    ],
  },
  { timestamps: true }
);

const Banner = mongoose.model("Banner", bannerSchema);

// API lấy danh sách banners
app.get("/api/banners", async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.json(banners);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách banners:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
});

// API lấy chi tiết banner theo ID
app.get("/api/banners/:id", async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: "Không tìm thấy banner" });
    }
    res.json(banner);
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết banner:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
});

// API tạo banner mới
app.post("/api/banners", async (req, res) => {
  try {
    const { name, image, characters } = req.body;

    if (!name || !image) {
      return res.status(400).json({ message: "Thiếu thông tin banner" });
    }

    const newBanner = new Banner({
      name,
      image,
      characters: characters || [],
    });

    const savedBanner = await newBanner.save();
    res.status(201).json(savedBanner);
  } catch (error) {
    console.error("Lỗi khi tạo banner:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
});

// API cập nhật banner
app.put("/api/banners/:id", async (req, res) => {
  try {
    const { name, image, characters } = req.body;

    if (!name || !image) {
      return res.status(400).json({ message: "Thiếu thông tin banner" });
    }

    const updatedBanner = await Banner.findByIdAndUpdate(
      req.params.id,
      { name, image, characters },
      { new: true }
    );

    if (!updatedBanner) {
      return res.status(404).json({ message: "Không tìm thấy banner" });
    }

    res.json(updatedBanner);
  } catch (error) {
    console.error("Lỗi khi cập nhật banner:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
});

// API xóa banner
app.delete("/api/banners/:id", async (req, res) => {
  try {
    const deletedBanner = await Banner.findByIdAndDelete(req.params.id);

    if (!deletedBanner) {
      return res.status(404).json({ message: "Không tìm thấy banner" });
    }

    res.json({ message: "Xóa banner thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa banner:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
