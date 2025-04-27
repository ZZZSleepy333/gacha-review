import { useState } from "react";
import axios from "axios";
import Snackbar from "./Snackbar";

const BannerManagement = ({
  availableCharacters,
  setAvailableCharacters,
  showSnackbar,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCharacter, setEditingCharacter] = useState(null);
  const [snackbar, setSnackbar] = useState({
    show: false,
    message: "",
  });

  const rateUpOptions = [
    { value: true, label: "Rate Up" },
    { value: false, label: "Normal" },
  ];

  // Lọc nhân vật theo từ khóa tìm kiếm
  const filteredCharacters = Array.isArray(availableCharacters)
    ? availableCharacters.filter((character) =>
        (character?.name?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        )
      )
    : [];

  // Tính toán phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCharacters.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

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

  // Xử lý chuyển trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Xử lý bắt đầu chỉnh sửa nhân vật
  const handleEditCharacter = (character) => {
    setEditingCharacter({ ...character });
  };

  // Xử lý thay đổi thông tin nhân vật đang chỉnh sửa
  const handleEditChange = (field, value) => {
    // Nếu field là rarity, đảm bảo giá trị là số và không vượt quá 5
    if (field === "rarity") {
      const numValue = parseInt(value, 10);
      if (isNaN(numValue)) return;
      value = Math.min(Math.max(numValue, 1), 5);
    }

    setEditingCharacter((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Xử lý lưu thay đổi cho nhân vật đang chỉnh sửa
  const handleSaveEdit = () => {
    setAvailableCharacters((prev) =>
      prev.map((char) =>
        char._id === editingCharacter._id ? { ...editingCharacter } : char
      )
    );
    setEditingCharacter(null);
    showSnackbar("Đã cập nhật thông tin nhân vật!");
  };

  // Xử lý hủy chỉnh sửa
  const handleCancelEdit = () => {
    setEditingCharacter(null);
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Quản lý nhân vật trong banner
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={handleCrawl}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              disabled={isLoading}
            >
              {isLoading ? "Đang crawl..." : "Crawl dữ liệu"}
            </button>
            <button
              onClick={handleSaveAvailable}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isLoading}
            >
              Lưu thay đổi
            </button>
          </div>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="mb-4">
          <div className="relative">
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
              placeholder="Tìm kiếm nhân vật..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
              }}
            />
          </div>
        </div>

        {/* Modal chỉnh sửa nhân vật */}
        {editingCharacter && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Chỉnh sửa nhân vật
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tên
                  </label>
                  <input
                    type="text"
                    value={editingCharacter.name || ""}
                    onChange={(e) => handleEditChange("name", e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Độ hiếm (1-5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={editingCharacter.rarity || 1}
                    onChange={(e) => handleEditChange("rarity", e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tags (phân cách bằng dấu phẩy)
                  </label>
                  <input
                    type="text"
                    value={editingCharacter.tags || ""}
                    onChange={(e) => handleEditChange("tags", e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="mt-5 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nhân vật
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Độ hiếm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phân loại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((character) => (
                <tr key={character._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-lg"
                          src={character.image}
                          alt={character.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm text-gray-500">
                          {character.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {character.rarity} ★
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {character.tags}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEditCharacter(character)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Chỉnh sửa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination cải tiến */}
        <div className="flex justify-center mt-6">
          <nav className="flex items-center">
            <ul className="flex space-x-2">
              {/* Nút Previous */}
              <li>
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  &laquo; Trước
                </button>
              </li>

              {/* Nút trang đầu tiên */}
              <li>
                <button
                  onClick={() => paginate(1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  1
                </button>
              </li>

              {/* Hiển thị dấu ... nếu không ở gần trang đầu */}
              {currentPage > 3 && (
                <li className="flex items-center">
                  <span className="text-gray-500">...</span>
                </li>
              )}

              {/* Hiển thị trang hiện tại và các trang xung quanh */}
              {Array.from(
                { length: Math.ceil(filteredCharacters.length / itemsPerPage) },
                (_, i) => i + 1
              )
                .filter(
                  (number) =>
                    number > 1 &&
                    number <
                      Math.ceil(filteredCharacters.length / itemsPerPage) &&
                    (number === currentPage ||
                      number === currentPage - 1 ||
                      number === currentPage + 1)
                )
                .map((number) => (
                  <li key={number}>
                    <button
                      onClick={() => paginate(number)}
                      className={`px-3 py-1 rounded ${
                        currentPage === number
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {number}
                    </button>
                  </li>
                ))}

              {/* Hiển thị dấu ... nếu không ở gần trang cuối */}
              {currentPage <
                Math.ceil(filteredCharacters.length / itemsPerPage) - 2 && (
                <li className="flex items-center">
                  <span className="text-gray-500">...</span>
                </li>
              )}

              {/* Nút trang cuối cùng (nếu có nhiều hơn 1 trang) */}
              {Math.ceil(filteredCharacters.length / itemsPerPage) > 1 && (
                <li>
                  <button
                    onClick={() =>
                      paginate(
                        Math.ceil(filteredCharacters.length / itemsPerPage)
                      )
                    }
                    className={`px-3 py-1 rounded ${
                      currentPage ===
                      Math.ceil(filteredCharacters.length / itemsPerPage)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {Math.ceil(filteredCharacters.length / itemsPerPage)}
                  </button>
                </li>
              )}

              {/* Nút Next */}
              <li>
                <button
                  onClick={() =>
                    paginate(
                      Math.min(
                        Math.ceil(filteredCharacters.length / itemsPerPage),
                        currentPage + 1
                      )
                    )
                  }
                  disabled={
                    currentPage ===
                    Math.ceil(filteredCharacters.length / itemsPerPage)
                  }
                  className={`px-3 py-1 rounded ${
                    currentPage ===
                    Math.ceil(filteredCharacters.length / itemsPerPage)
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Sau &raquo;
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default BannerManagement;
