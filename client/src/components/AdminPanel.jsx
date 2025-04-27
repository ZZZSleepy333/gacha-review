import { useState, useEffect } from "react";
import axios from "axios";
import Snackbar from "./Snackbar";
import BannerManagement from "./BannerManagement";
import CharacterForm from "./CharacterForm";
import CharacterManagement from "./CharacterManagement";
import GachaComponents from "./GachaComponents"; // Thêm import GachaComponents

const AdminPage = () => {
  // Options for dropdowns
  const rarityOptions = [1, 2, 3, 4, 5];
  const attributeOptions = [
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
  ];
  const roleOptions = [
    "Carry",
    "Damage Amplifier",
    "Sustainer",
    "Mover",
    "Charger",
    "Bounty",
    "Weapon Changer",
    "HP Decrease",
  ];

  const rateUpOptions = [
    { value: true, label: "Rate Up" },
    { value: false, label: "Normal" },
  ];
  const weaponTypeOptions = [
    "Slash",
    "Long Slash",
    "Thrust",
    "Blunt",
    "Shot",
    "Snipe",
    "Magic",
    "None",
    "All",
  ];
  const schoolOptions = [
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
  ];
  const guildOptions = [
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
  ];
  const affiliationOptions = [
    "None",
    "Eight Dog Warriors",
    "Shinjuku Academy Mountaineers",
    "Viral Influence",
    "Setagaya Mountaineering Club",
  ];
  const ratingOptions = ["S+", "S", "A+", "A", "B", "C", "D"];
  const characterTypesOptions = [
    "Permanent",
    "Limited",
    "Christmas Variant",
    "Valentine Variant",
    "Summer Variant",
    "Halloween Variant",
    "Main Story Variant",
    "Welfare",
  ];

  const [characters, setCharacters] = useState([]);
  const [availableCharacters, setAvailableCharacters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    title: "",
    name: "",
    image: "",
    rarity: 3,
    attribute: attributeOptions[0],
    weaponType: weaponTypeOptions[0],
    school: schoolOptions[0],
    guild: guildOptions[0],
    affiliation: affiliationOptions[0],
    roles: [],
    voiceActors: "",
    illustrators: "",
    maxHp: 0,
    maxAttack: 0,
    chargeSkill: {
      chargeSkillName: "",
      chargeSkillDescription: "",
      csType: weaponTypeOptions[0],
    },
    adminReview: "A",
    strongPoints: "",
    weakPoints: "",
    finalReview: "",
    characterType: characterTypesOptions[0],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("create");
  const [searchTerm, setSearchTerm] = useState("");

  const [snackbar, setSnackbar] = useState({
    show: false,
    message: "",
  });

  // Hàm hiển thị snackbar
  const showSnackbar = (message) => {
    setSnackbar({ show: true, message });
  };

  // Hàm đóng snackbar
  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, show: false });
  };
  const handleCrawl = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/crawl`
      );
      setAvailableCharacters(response.data);
      showSnackbar("Crawl dữ liệu thành công!");
    } catch (err) {
      console.error("Crawl error:", err);
      showSnackbar(
        "Lỗi khi crawl dữ liệu: " + (err.response?.status || err.message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvailableChange = (id, field, value) => {
    setAvailableCharacters((prev) =>
      prev.map((char) => (char._id === id ? { ...char, [field]: value } : char))
    );
  };

  const handleSaveAvailable = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/available`, {
        characters: availableCharacters,
      });
      showSnackbar("Changes saved successfully!");
    } catch (err) {
      console.error("Save error:", err);
      showSnackbar("Error saving changes!");
    }
  };

  // Tính toán phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = availableCharacters.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Fetch characters
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/characters`
        );
        setCharacters(res.data);
        console.log(res.data);
      } catch (err) {
        console.error("Error fetching characters:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCharacters();
  }, []);

  // Fetch available characters when banner tab is active
  useEffect(() => {
    const fetchAvailableCharacters = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/available`
        );
        setAvailableCharacters(res.data);
      } catch (err) {
        console.error("Error fetching available characters:", err);
      }
    };

    if (activeTab === "banner") {
      fetchAvailableCharacters();
    }
  }, [activeTab]);

  // Filter characters based on search term
  const filteredCharacters = characters.filter(
    (character) =>
      character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      character.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          name === "rarity" || name === "maxHp" || name === "maxAttack"
            ? parseInt(value) || 0
            : value,
      }));
    }
  };

  const handleRoleSelect = (selectedRole) => {
    if (selectedRole && !formData.roles.includes(selectedRole)) {
      setFormData((prev) => ({
        ...prev,
        roles: [...prev.roles, selectedRole],
      }));
    }
  };

  const removeRole = (roleToRemove) => {
    setFormData((prev) => ({
      ...prev,
      roles: prev.roles.filter((role) => role !== roleToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      if (formData._id) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/characters/${formData._id}`,
          formData
        );
        showSnackbar("Character updated successfully!");
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/characters`,
          formData
        );
        showSnackbar("Character created successfully!");
      }
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/characters`
      );
      setCharacters(res.data);
      resetForm();
      setActiveTab("manage");
    } catch (err) {
      console.error("Error saving character:", err);
      showSnackbar("Error saving character!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (character) => {
    setFormData(character);
    setActiveTab("create");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this character?")) {
      setIsLoading(true);
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/characters/${id}`
        );
        setCharacters((prev) => prev.filter((c) => c._id !== id));
        showSnackbar("Character deleted successfully!");
      } catch (err) {
        console.error("Error deleting character:", err);
        showSnackbar("Error deleting character!");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      name: "",
      image: "",
      rarity: 3,
      attribute: attributeOptions[0],
      weaponType: weaponTypeOptions[0],
      school: schoolOptions[0],
      guild: guildOptions[0],
      affiliation: affiliationOptions[0],
      roles: [],
      voiceActors: "",
      illustrators: "",
      maxHp: 0,
      maxAttack: 0,
      chargeSkill: {
        chargeSkillName: "",
        chargeSkillDescription: "",
      },
      adminReview: "A",
      strongPoints: "",
      weakPoints: "",
    });
  };

  // const ratingColor = (rating) => {
  //   switch (rating) {
  //     case "S+":
  //       return "bg-gradient-to-r from-purple-600 to-pink-600";
  //     case "S":
  //       return "bg-red-600";
  //     case "A+":
  //       return "bg-orange-500";
  //     case "A":
  //       return "bg-yellow-500";
  //     case "B":
  //       return "bg-green-500";
  //     case "C":
  //       return "bg-blue-500";
  //     case "D":
  //       return "bg-gray-500";
  //     default:
  //       return "bg-gray-200";
  //   }
  // };

  return (
    <div className="min-h-screen bg-gray-50">
      <Snackbar
        show={snackbar.show}
        message={snackbar.message}
        onClose={closeSnackbar}
      />
      {/* Header */}

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Trang quản lý nhân vật
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("create")}
              className={`px-4 py-2 rounded-md ${
                activeTab === "create"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {formData._id ? "Chỉnh sửa Review" : "Tạo Review"}
            </button>
            <button
              onClick={() => {
                setActiveTab("manage");
                resetForm();
              }}
              className={`px-4 py-2 rounded-md ${
                activeTab === "manage"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Quản lý Review
            </button>
            <button
              onClick={() => setActiveTab("banner")}
              className={`px-4 py-2 rounded-md ${
                activeTab === "banner"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Quản lý nhân vật
            </button>
            <button
              onClick={() => setActiveTab("gacha")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "gacha"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Quản lý Gacha
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Create/Edit Form */}
        {activeTab === "create" && (
          <CharacterForm
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            handleRoleSelect={handleRoleSelect}
            removeRole={removeRole}
            isLoading={isLoading}
            rarityOptions={rarityOptions}
            attributeOptions={attributeOptions}
            roleOptions={roleOptions}
            weaponTypeOptions={weaponTypeOptions}
            schoolOptions={schoolOptions}
            guildOptions={guildOptions}
            affiliationOptions={affiliationOptions}
            ratingOptions={ratingOptions}
            characterTypesOptions={characterTypesOptions}
          />
        )}

        {/* Manage Characters */}
        {activeTab === "manage" && (
          <CharacterManagement
            characters={characters}
            setCharacters={setCharacters}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            setActiveTab={setActiveTab}
            isLoading={isLoading}
            showSnackbar={showSnackbar}
          />
        )}

        {/* Manage Banner's Character */}
        {activeTab === "banner" && (
          <BannerManagement
            availableCharacters={availableCharacters}
            setAvailableCharacters={setAvailableCharacters}
            showSnackbar={showSnackbar}
          />
        )}
        {activeTab === "gacha" && (
          <GachaComponents showSnackbar={showSnackbar} />
        )}

        {/* Snackbar */}
        <Snackbar
          message={snackbar.message}
          show={snackbar.show}
          onClose={closeSnackbar}
        />
      </main>
    </div>
  );
};

export default AdminPage;
