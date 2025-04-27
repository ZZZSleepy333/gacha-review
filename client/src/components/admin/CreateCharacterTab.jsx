import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { rarityOptions, attributeOptions, roleOptions, weaponTypeOptions, schoolOptions, guildOptions, affiliationOptions, characterTypesOptions } from "../constants/CharacterOptions";

const CreateCharacterTab = ({ formData, setFormData, handleChange, handleRolesChange, handleSubmit, isLoading }) => {
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
                    className="border p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hình ảnh URL
                  </label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="border p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Độ hiếm
                  </label>
                  <select
                    name="rarity"
                    value={formData.rarity}
                    onChange={handleChange}
                    className="border p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {rarityOptions.map((option) => (
                      <option key={option} value={option}>
                        {option} ★
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thuộc tính
                  </label>
                  <select
                    name="attribute"
                    value={formData.attribute}
                    onChange={handleChange}
                    className="border p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {attributeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại vũ khí
                  </label>
                  <select
                    name="weaponType"
                    value={formData.weaponType}
                    onChange={handleChange}
                    className="border p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {weaponTypeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trường học
                  </label>
                  <select
                    name="school"
                    value={formData.school}
                    onChange={handleChange}
                    className="border p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {schoolOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
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
                  >
                    {guildOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Affiliation
                  </label>
                  <select
                    name="affiliation"
                    value={formData.affiliation}
                    onChange={handleChange}
                    className="border p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {affiliationOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vai trò
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {roleOptions.map((role) => (
                      <div key={role} className="flex items-center">
                        <input
                          type="checkbox"
                          id={role}
                          name={role}
                          checked={formData.roles.includes(role)}
                          onChange={handleRolesChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={role}
                          className="ml-2 block text-sm text-gray-900"
                        >
                          {role}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Additional Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                  Thông tin bổ sung
                </h3>

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
                    Họa sĩ
                  </label>
                  <input
                    type="text"
                    name="illustrators"
                    value={formData.illustrators}
                    onChange={handleChange}
                    className="border p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

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
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ATK tối đa
                  </label>
                  <input
                    type="number"
                    name="maxAttack"
                    value={formData.maxAttack}
                    onChange={handleChange}
                    className="border p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

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
                    rows="3"
                    className="border p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại Charge Skill
                  </label>
                  <select
                    name="chargeSkill.csType"
                    value={formData.chargeSkill.csType}
                    onChange={handleChange}
                    className="border p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {weaponTypeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
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
                  >
                    {characterTypesOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Review Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Đánh giá
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đánh giá tổng thể
              </label>
              <select
                name="adminReview"
                value={formData.adminReview}
                onChange={handleChange}
                className="border p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="S+">S+</option>
                <option value="S">S</option>
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Điểm mạnh
              </label>
              <div className="custom-quill">
                <ReactQuill
                  theme="snow"
                  value={formData.strongPoints}
                  onChange={(value) =>
                    setFormData({ ...formData, strongPoints: value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Điểm yếu
              </label>
              <div className="custom-quill">
                <ReactQuill
                  theme="snow"
                  value={formData.weakPoints}
                  onChange={(value) =>
                    setFormData({ ...formData, weakPoints: value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đánh giá cuối cùng
              </label>
              <div className="custom-quill">
                <ReactQuill
                  theme="snow"
                  value={formData.finalReview}
                  onChange={(value) =>
                    setFormData({ ...formData, finalReview: value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? "Đang xử lý..." : "Tạo nhân vật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCharacterTab;