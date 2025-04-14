require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// const ADMIN_TOKENS = new Set(["leib_olmai", "tanukibeo", "kallankoe"]);

const corsOptions = {
  origin: ["https://gacha-review-2.vercel.app", "http://localhost:3000"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

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
        "Wind",
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
        "Pierce",
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
      type: String,
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

// Thêm middleware xác thực
const authenticateAdmin = (req, res, next) => {
  const authToken = req.headers["authorization"];
  const validTokens = process.env.ADMIN_TOKENS.split(","); // Danh sách token hợp lệ

  if (validTokens.includes(authToken)) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// Bảo vệ các route admin
app.post("/api/characters", authenticateAdmin, async (req, res) => {
  /* ... */
});
app.put("/api/characters/:id", authenticateAdmin, async (req, res) => {
  /* ... */
});
app.put("/api/characters/:id", authenticateAdmin, async (req, res) => {
  /* ... */
});
app.delete("/api/characters/:id", authenticateAdmin, async (req, res) => {
  /* ... */
});

// Thêm route để kiểm tra token
app.post("/api/validate-token", (req, res) => {
  const { token } = req.body;
  const validTokens = process.env.ADMIN_TOKENS.split(",");

  if (validTokens.includes(token)) {
    res.json({ valid: true });
  } else {
    res.json({ valid: false });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
