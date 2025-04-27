import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { rarityOptions, attributeOptions, roleOptions, weaponTypeOptions, schoolOptions, guildOptions, affiliationOptions, characterTypesOptions, ratingOptions } from "../constants/CharacterOptions";

const EditCharacterTab = ({ 
  characters, 
  currentPage, 
  itemsPerPage, 
  searchTerm, 
  setSearchTerm, 
  selectedCharacter, 
  setSelectedCharacter, 
  handleEditChange, 
  handleEditRolesChange, 
  handleUpdateCharacter, 
  handleDeleteCharacter, 
  isLoading 
}) => {
  // Tính toán các nhân vật hiển thị dựa trên trang hiện tại và tìm kiếm
  const filteredCharacters = characters.filter(
    (character) =>
      character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      character.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCharacters = filteredCharacters.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Tính toán tổng số trang
  const totalPages = Math.ceil(filteredCharacters.length / itemsPerPage);

  // Hàm chuyển trang
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="space-y-8">
      {/* Danh sách nhân vật */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Danh sách nhân vật
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm nhân vật..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border p-2 pl-8 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <svg
                className="absolute left-2 top-2.5 h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Hình ảnh
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tên
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
                    Thuộc tính
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Đánh giá
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
                {currentCharacters.map((character) => (
                  <tr key={character._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={character.image}
                        alt={character.name}
                        className="h-10 w-10 rounded-full"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {character.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {character.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {character.rarity} ★
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {character.attribute}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {character.adminReview}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedCharacter(character)}
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteCharacter(character._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-700">
              Hiển thị {indexOfFirstItem + 1} đến{" "}
              {Math.min(indexOfLastItem, filteredCharacters.length)} trong{" "}
              {filteredCharacters.length} kết quả
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-md disabled:opacity-50"
              >
                Trước
              </button>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-md disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form chỉnh sửa */}
      {selectedCharacter && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Chỉnh sửa nhân vật: {selectedCharacter.name}
            </h3>

            <form onSubmit={handleUpdateCharacter} className="space-y-8">
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
                        value={selectedCharacter.title}
                        onChange={handleEditChange}
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
                        value={selectedCharacter.name}
                        onChange={handleEditChange}
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
                        value={selectedCharacter.image}
                        onChange={handleEditChange}
                        className="border p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Độ hiếm
                      </label>
                      <select
                        name="rarity"
                        value={selectedCharacter.rarity}
                        onChange={handleEditChange}
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
                        value={selectedCharacter.attribute}
                        onChange={handleEditChange}
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
                        value={selectedCharacter.weaponType}
                        onChange={handleEditChange}
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
                        value={selectedCharacter.school}
                        onChange={handleEditChange}
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
                        value={selectedCharacter.guild}
                        onChange={handleEditChange}
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
                        value={selectedCharacter.affiliation}
                        onChange={handleEditChange}
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