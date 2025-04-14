import { useState, useEffect } from "react";
import axios from "axios";
import Snackbar from "./Snackbar";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

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
      csType: "",
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

  // Fetch characters
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/characters`
        );
        setCharacters(res.data);
      } catch (err) {
        console.error("Error fetching characters:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCharacters();
  }, []);

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
              {formData._id ? "Edit Character" : "Create New"}
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
              Quản lý nhân vật
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Create/Edit Form */}
        {activeTab === "create" && (
          <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                        Thông tin cơ bản
                      </h3>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Danh hiệu
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          className="border p-2 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tên nhân vật
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="border p-2 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Hình ảnh
                        </label>
                        <input
                          type="url"
                          name="image"
                          value={formData.image}
                          onChange={handleChange}
                          className="border p-2 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                        {formData.image && (
                          <div className="mt-2">
                            <img
                              src={formData.image}
                              alt="Preview"
                              className="h-32 object-cover rounded border"
                              onError={(e) =>
                                (e.target.src = "/placeholder-character.jpg")
                              }
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Attributes */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                        Các thông tin khác
                      </h3>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Độ hiếm
                        </label>
                        <select
                          name="rarity"
                          value={formData.rarity}
                          onChange={handleChange}
                          className="border p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        >
                          {rarityOptions.map((rarity) => (
                            <option key={rarity} value={rarity}>
                              {rarity} ★
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Loại nhân vật
                        </label>
                        <select
                          name="characterType"
                          value={formData.characterType}
                          onChange={handleChange}
                          className="border p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        >
                          {characterTypesOptions.map((chrType) => (
                            <option key={chrType} value={chrType}>
                              {chrType}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Hệ nguyên tố
                        </label>
                        <select
                          name="attribute"
                          value={formData.attribute}
                          onChange={handleChange}
                          className="border p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        >
                          {attributeOptions.map((attr) => (
                            <option key={attr} value={attr}>
                              {attr}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tầm đánh
                        </label>
                        <select
                          name="weaponType"
                          value={formData.weaponType}
                          onChange={handleChange}
                          className="border p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        >
                          {weaponTypeOptions.map((weapon) => (
                            <option key={weapon} value={weapon}>
                              {weapon}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Học viện
                        </label>
                        <select
                          name="school"
                          value={formData.school}
                          onChange={handleChange}
                          className="border p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        >
                          {schoolOptions.map((school) => (
                            <option key={school} value={school}>
                              {school}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Guild
                        </label>
                        <select
                          name="guild"
                          value={formData.guild}
                          onChange={handleChange}
                          className="border p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        >
                          {guildOptions.map((guild) => (
                            <option key={guild} value={guild}>
                              {guild}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quan hệ
                        </label>
                        <select
                          name="affiliation"
                          value={formData.affiliation}
                          onChange={handleChange}
                          className="border p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        >
                          {affiliationOptions.map((aff) => (
                            <option key={aff} value={aff}>
                              {aff}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Roles */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                        Vai trò nhân vật
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.roles.map((role) => (
                          <span
                            key={role}
                            className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm"
                          >
                            {role}
                            <button
                              type="button"
                              onClick={() => removeRole(role)}
                              className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Thêm vai trò
                        </label>
                        <select
                          onChange={(e) => handleRoleSelect(e.target.value)}
                          className="border p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value=""
                        >
                          <option value="">Select a role...</option>
                          {roleOptions
                            .filter((role) => !formData.roles.includes(role))
                            .map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Stats */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                        Stats
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            HP ở Level 70
                          </label>
                          <input
                            type="number"
                            name="maxHp"
                            value={formData.maxHp}
                            onChange={handleChange}
                            className="border p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            ATK ở level 70
                          </label>
                          <input
                            type="number"
                            name="maxAttack"
                            value={formData.maxAttack}
                            onChange={handleChange}
                            className="border  p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Lồng tiếng
                          </label>
                          <input
                            type="text"
                            name="voiceActors"
                            value={formData.voiceActors}
                            onChange={handleChange}
                            className="border p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Minh hoạ
                          </label>
                          <input
                            type="text"
                            name="illustrators"
                            value={formData.illustrators}
                            onChange={handleChange}
                            className="border p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Charge Skill */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                        Charge Skill
                      </h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tên kỹ năng
                        </label>
                        <input
                          type="text"
                          name="chargeSkill.chargeSkillName"
                          value={formData.chargeSkill.chargeSkillName}
                          onChange={handleChange}
                          className="border p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tầm đánh
                        </label>
                        <select
                          name="csType"
                          value={formData.csType}
                          onChange={handleChange}
                          className="border p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        >
                          {weaponTypeOptions.map((weapon) => (
                            <option key={weapon} value={weapon}>
                              {weapon}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mô tả
                        </label>
                        <textarea
                          name="chargeSkill.chargeSkillDescription"
                          value={formData.chargeSkill.chargeSkillDescription}
                          onChange={handleChange}
                          rows={3}
                          className="border p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4  rounded-lg ">
                  <h3 className="text-lg font-medium text-gray-900  pb-2">
                    Review chi tiết
                  </h3>
                  <div className=" ">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tier
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {ratingOptions.map((grade) => (
                        <label key={grade} className="inline-flex items-center">
                          <input
                            type="radio"
                            name="adminReview"
                            value={grade}
                            checked={formData.adminReview === grade}
                            onChange={() =>
                              setFormData({
                                ...formData,
                                adminReview: grade,
                              })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span
                            className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${
                              grade === "S+"
                                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                                : grade === "S"
                                ? "bg-red-600 text-white"
                                : grade === "A+"
                                ? "bg-orange-500 text-white"
                                : grade === "A"
                                ? "bg-yellow-500 text-white"
                                : grade === "B"
                                ? "bg-green-500 text-white"
                                : grade === "C"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-500 text-white"
                            }`}
                          >
                            {grade}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Điểm nổi bật
                    </label>
                    <textarea
                      name="strongPoints"
                      value={formData.strongPoints}
                      onChange={handleChange}
                      rows={3}
                      className="p-2 block w-full h-60 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Điểm lưu ý
                    </label>
                    <textarea
                      name="weakPoints"
                      value={formData.weakPoints}
                      onChange={handleChange}
                      rows={3}
                      className="p-2 block w-full h-60 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Đánh giá tổng quan
                    </label>
                    <ReactQuill
                      theme="snow"
                      value={formData.finalReview}
                      onChange={(value) =>
                        setFormData((prev) => ({ ...prev, finalReview: value }))
                      }
                      className="custom-quill"
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center ${
                      isLoading ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {formData._id ? "Cập nhật..." : "Đang tạo..."}
                      </>
                    ) : formData._id ? (
                      "Cập nhật nhân vật"
                    ) : (
                      "Tạo nhân vật"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Manage Characters */}
        {activeTab === "manage" && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Quản lý nhân vật
                </h2>
                <div className="relative w-full sm:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search characters..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredCharacters.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Không tìm thấy nhân vật
                  </h3>

                  <div className="mt-6">
                    <button
                      onClick={() => setActiveTab("create")}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg
                        className="-ml-1 mr-2 h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Thêm nhân vật mới
                    </button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Nhân vật
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Độ hiếm
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Tier
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Hành động
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredCharacters.map((character) => (
                        <tr key={character._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={
                                    character.image ||
                                    "/placeholder-character.jpg"
                                  }
                                  alt={character.name}
                                />
                              </div>
                              <div className="ml-4">
                                <div className=" text-sm font-medium text-gray-900">
                                  {character.name}
                                </div>
                                <div className=" text-sm text-gray-500">
                                  {character.title}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex">
                              {[...Array(character.rarity)].map((_, i) => (
                                <svg
                                  key={i}
                                  className="h-5 w-5 text-yellow-400"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                character.adminReview === "S+"
                                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                                  : character.adminReview === "S"
                                  ? "bg-red-600 text-white"
                                  : character.adminReview === "A+"
                                  ? "bg-orange-500 text-white"
                                  : character.adminReview === "A"
                                  ? "bg-yellow-500 text-white"
                                  : character.adminReview === "B"
                                  ? "bg-green-500 text-white"
                                  : character.adminReview === "C"
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-500 text-white"
                              }`}
                            >
                              {character.adminReview}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleEdit(character)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              Chỉnh sửa
                            </button>
                            <button
                              onClick={() => handleDelete(character._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Xoá
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
