import { useState } from "react";
import axios from "axios";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const CharacterForm = ({
  formData,
  setFormData,
  handleSubmit,
  handleChange,
  handleRoleSelect,
  removeRole,
  isLoading,
  rarityOptions,
  attributeOptions,
  roleOptions,
  weaponTypeOptions,
  schoolOptions,
  guildOptions,
  affiliationOptions,
  ratingOptions,
  characterTypesOptions,
}) => {
  return (
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
                    {affiliationOptions.map((affiliation) => (
                      <option key={affiliation} value={affiliation}>
                        {affiliation}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vai trò
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.roles.map((role) => (
                      <span
                        key={role}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {role}
                        <button
                          type="button"
                          onClick={() => removeRole(role)}
                          className="ml-1 text-blue-500 hover:text-blue-700"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                  <select
                    onChange={(e) => handleRoleSelect(e.target.value)}
                    value=""
                    className="border p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Thêm vai trò...</option>
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
                  Thông số
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    HP tối đa
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
                    Tấn công tối đa
                  </label>
                  <input
                    type="number"
                    name="maxAttack"
                    value={formData.maxAttack}
                    onChange={handleChange}
                    className="border p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Seiyuu
                  </label>
                  <input
                    type="text"
                    name="voiceActors"
                    value={formData.voiceActors}
                    onChange={handleChange}
                    className="border p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Illustrator
                  </label>
                  <input
                    type="text"
                    name="illustrators"
                    value={formData.illustrators}
                    onChange={handleChange}
                    className="border p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Charge Skill */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                  Charge Skill
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên Charge Skill
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
                    Mô tả Charge Skill
                  </label>
                  <textarea
                    name="chargeSkill.chargeSkillDescription"
                    value={formData.chargeSkill.chargeSkillDescription}
                    onChange={handleChange}
                    rows={4}
                    className="border p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại CS
                  </label>
                  <select
                    name="chargeSkill.csType"
                    value={formData.chargeSkill.csType}
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
              </div>

              {/* Review */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                  Đánh giá
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Đánh giá tổng quan
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Đánh giá cuối cùng
                  </label>
                  <ReactQuill
                    value={formData.finalReview}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        finalReview: value,
                      }))
                    }
                    className="h-32 mb-12"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isLoading}
            >
              {isLoading
                ? "Đang lưu..."
                : formData._id
                ? "Cập nhật nhân vật"
                : "Tạo nhân vật mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CharacterForm;
