import { useState, useEffect } from "react";
import axios from "axios";

const GachaComponents = ({ showSnackbar }) => {
  const [banners, setBanners] = useState([]);
  const [availableCharacters, setAvailableCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [newBanner, setNewBanner] = useState({
    name: "",
    image: "",
    characters: [],
  });
  const [showNewBannerForm, setShowNewBannerForm] = useState(false);
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Lấy danh sách banners và nhân vật có sẵn khi component được mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [bannersResponse, charactersResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/banners`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/characters`),
        ]);
        setBanners(bannersResponse.data);
        setAvailableCharacters(charactersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        showSnackbar("Lỗi khi tải dữ liệu: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [showSnackbar]);

  // Lọc nhân vật theo từ khóa tìm kiếm
  const filteredCharacters = availableCharacters.filter((character) =>
    (character?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  // Xử lý tạo banner mới
  const handleCreateBanner = async () => {
    if (!newBanner.name || !newBanner.image) {
      showSnackbar("Vui lòng nhập đầy đủ thông tin banner!");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/banners`,
        {
          ...newBanner,
          characters: selectedCharacters.map(char => ({
            characterId: char._id,
            rateUpStatus: char.rateUpStatus || "normal"
          })),
        }
      );
      setBanners([...banners, response.data]);
      setNewBanner({ name: "", image: "", characters: [] });
      setSelectedCharacters([]);
      setShowNewBannerForm(false);
      showSnackbar("Tạo banner thành công!");
    } catch (error) {
      console.error("Error creating banner:", error);
      showSnackbar("Lỗi khi tạo banner: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý chỉnh sửa banner
  const handleEditBanner = (banner) => {
    setEditingBanner({ ...banner });
    // Lấy thông tin đầy đủ của nhân vật từ availableCharacters
    const charactersWithDetails = banner.characters.map(bannerChar => {
      const fullCharacter = availableCharacters.find(c => c._id === bannerChar.characterId);
      return {
        ...fullCharacter,
        rateUpStatus: bannerChar.rateUpStatus || "normal"
      };
    }).filter(Boolean); // Lọc bỏ các giá trị undefined
    
    setSelectedCharacters(charactersWithDetails);
  };

  // Xử lý cập nhật banner
  const handleUpdateBanner = async () => {
    if (!editingBanner.name || !editingBanner.image) {
      showSnackbar("Vui lòng nhập đầy đủ thông tin banner!");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/banners/${editingBanner._id}`,
        {
          ...editingBanner,
          characters: selectedCharacters.map(char => ({
            characterId: char._id,
            rateUpStatus: char.rateUpStatus || "normal"
          })),
        }
      );
      setBanners(
        banners.map((banner) =>
          banner._id === editingBanner._id ? response.data : banner
        )
      );
      setEditingBanner(null);
      setSelectedCharacters([]);
      showSnackbar("Cập nhật banner thành công!");
    } catch (error) {
      console.error("Error updating banner:", error);
      showSnackbar("Lỗi khi cập nhật banner: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý xóa banner
  const handleDeleteBanner = async (bannerId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa banner này?")) {
      return;
    }

    try {
      setIsLoading(true);
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/banners/${bannerId}`
      );
      setBanners(banners.filter((banner) => banner._id !== bannerId));
      showSnackbar("Xóa banner thành công!");
    } catch (error) {
      console.error("Error deleting banner:", error);
      showSnackbar("Lỗi khi xóa banner: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý thêm/xóa nhân vật khỏi banner
  const handleToggleCharacter = (character) => {
    const isSelected = selectedCharacters.some(
      (char) => char._id === character._id
    );

    if (isSelected) {
      setSelectedCharacters(
        selectedCharacters.filter((char) => char._id !== character._id)
      );
    } else {
      setSelectedCharacters([
        ...selectedCharacters,
        { ...character, rateUpStatus: "normal" },
      ]);
    }
  };

  // Xử lý thay đổi trạng thái rate-up của nhân vật
  const handleRateUpChange = (characterId, status) => {
    setSelectedCharacters(
      selectedCharacters.map((char) =>
        char._id === characterId ? { ...char, rateUpStatus: status } : char
      )
    );
  };

  // Hủy chỉnh sửa banner
  const handleCancelEdit = () => {
    setEditingBanner(null);
    setSelectedCharacters([]);
  };

  // Hủy tạo banner mới
  const handleCancelCreate = () => {
    setShowNewBannerForm(false);
    setNewBanner({ name: "", image: "", characters: [] });
    setSelectedCharacters([]);
  };

  // Hiển thị danh sách banner
  const renderBannerList = () => {
    if (banners.length === 0) {
      return (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Chưa có banner nào được tạo</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {banners.map((banner) => (
          <div
            key={banner._id}
            className="bg-white border rounded-lg shadow-sm overflow-hidden"
          >
            <div className="relative h-40">
              <img
                src={banner.image}
                alt={banner.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <h3 className="absolute bottom-2 left-3 text-white font-bold text-lg">
                {banner.name}
              </h3>
            </div>
            <div className="p-4">
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-2">
                  Nhân vật trong banner ({banner.characters.length}):
                </p>
                <div className="flex flex-wrap gap-1">
                  {banner.characters.map((char) => {
                    const character = availableCharacters.find(
                      (c) => c._id === char.characterId
                    );
                    if (!character) return null;
                    
                    return (
                      <div
                        key={char.characterId}
                        className={`relative group`}
                      >
                        <div className="w-8 h-8 relative">
                          <img
                            src={character.image}
                            alt={character.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          {char.rateUpStatus !== "normal" && (
                            <div 
                              className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                                char.rateUpStatus === "rateup-1" 
                                  ? "bg-yellow-400" 
                                  : "bg-red-500"
                              }`}
                            ></div>
                          )}
                        </div>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {character.name}
                          {char.rateUpStatus !== "normal" && (
                            <span className="ml-1">
                              ({char.rateUpStatus === "rateup-1" ? "Rate Up 1" : "Rate Up 2"})
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleEditBanner(banner)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDeleteBanner(banner._id)}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Quản lý Banners
          </h2>
          {!showNewBannerForm && !editingBanner && (
            <button
              onClick={() => setShowNewBannerForm(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              disabled={isLoading}
            >
              Tạo Banner Mới
            </button>
          )}
        </div>

        {/* Form tạo banner mới */}
        {showNewBannerForm && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Tạo Banner Mới
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên Banner
                </label>
                <input
                  type="text"
                  value={newBanner.name}
                  onChange={(e) =>
                    setNewBanner({ ...newBanner, name: e.target.value })
                  }
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Nhập tên banner"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Hình Ảnh
                </label>
                <input
                  type="text"
                  value={newBanner.image}
                  onChange={(e) =>
                    setNewBanner({ ...newBanner, image: e.target.value })
                  }
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Nhập URL hình ảnh"
                />
              </div>
            </div>

            {/* Phần chọn nhân vật */}
            <div className="mb-4">
              <h4 className="text-md font-medium text-gray-700 mb-2">
                Chọn nhân vật cho banner
              </h4>
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="Tìm kiếm nhân vật..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-60 overflow-y-auto p-2 bg-white rounded border">
                {filteredCharacters.map((character) => {
                  const isSelected = selectedCharacters.some(
                    (char) => char._id === character._id
                  );
                  return (
                    <div
                      key={character._id}
                      className={`p-2 border rounded flex items-center cursor-pointer ${
                        isSelected
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                      onClick={() => handleToggleCharacter(character)}
                    >
                      <div className="flex-shrink-0 h-8 w-8 mr-2">
                        <img
                          src={character.image}
                          alt={character.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      </div>
                      <div className="text-sm truncate">{character.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Danh sách nhân vật đã chọn */}
            {selectedCharacters.length > 0 && (
              <div className="mb-4">
                <h4 className="text-md font-medium text-gray-700 mb-2">
                  Nhân vật đã chọn ({selectedCharacters.length})
                </h4>
                <div className="bg-white p-2 border rounded">
                  {selectedCharacters.map((character) => (
                    <div
                      key={character._id}
                      className="flex items-center justify-between p-2 border-b last:border-b-0"
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 mr-2">
                          <img
                            src={character.image}
                            alt={character.name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        </div>
                        <div className="text-sm">{character.name}</div>
                      </div>
                      <div className="flex items-center">
                        <select
                          value={character.rateUpStatus || "normal"}
                          onChange={(e) =>
                            handleRateUpChange(character._id, e.target.value)
                          }
                          className="mr-2 text-sm border border-gray-300 rounded py-1 px-2"
                        >
                          <option value="normal">Bình thường</option>
                          <option value="rateup-1">Rate Up 1</option>
                          <option value="rateup-2">Rate Up 2</option>
                        </select>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleCharacter(character);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancelCreate}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateBanner}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Tạo Banner"}
              </button>
            </div>
          </div>
        )}

        {/* Form chỉnh sửa banner */}
        {editingBanner && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Chỉnh Sửa Banner
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên Banner
                </label>
                <input
                  type="text"
                  value={editingBanner.name}
                  onChange={(e) =>
                    setEditingBanner({
                      ...editingBanner,
                      name: e.target.value,
                    })
                  }
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Hình Ảnh
                </label>
                <input
                  type="text"
                  value={editingBanner.image}
                  onChange={(e) =>
                    setEditingBanner({
                      ...editingBanner,
                      image: e.target.value,
                    })
                  }
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Phần chọn nhân vật */}
            <div className="mb-4">
              <h4 className="text-md font-medium text-gray-700 mb-2">
                Chọn nhân vật cho banner
              </h4>
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="Tìm kiếm nhân vật..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-60 overflow-y-auto p-2 bg-white rounded border">
                {filteredCharacters.map((character) => {
                  const isSelected = selectedCharacters.some(
                    (char) => char._id === character._id
                  );
                  return (
                    <div
                      key={character._id}
                      className={`p-2 border rounded flex items-center cursor-pointer ${
                        isSelected
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                      onClick={() => handleToggleCharacter(character)}
                    >
                      <div className="flex-shrink-0 h-8 w-8 mr-2">
                        <img
                          src={character.image}
                          alt={character.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      </div>
                      <div className="text-sm truncate">{character.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Danh sách nhân vật đã chọn */}
            {selectedCharacters.length > 0 && (
              <div className="mb-4">
                <h4 className="text-md font-medium text-gray-700 mb-2">
                  Nhân vật đã chọn ({selectedCharacters.length})
                </h4>
                <div className="bg-white p-2 border rounded">
                  {selectedCharacters.map((character) => (
                    <div
                      key={character._id}
                      className="flex items-center justify-between p-2 border-b last:border-b-0"
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 mr-2">
                          <img
                            src={character.image}
                            alt={character.name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        </div>
                        <div className="text-sm">{character.name}</div>
                      </div>
                      <div className="flex items-center">
                        <select
                          value={character.rateUpStatus || "normal"}
                          onChange={(e) =>
                            handleRateUpChange(character._id, e.target.value)
                          }
                          className="mr-2 text-sm border border-gray-300 rounded py-1 px-2"
                        >
                          <option value="normal">Bình thường</option>
                          <option value="rateup-1">Rate Up 1</option>
                          <option value="rateup-2">Rate Up 2</option>
                        </select>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleCharacter(character);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateBanner}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Cập nhật"}
              </button>
            </div>
          </div>
        )}

        {/* Danh sách banner */}
        {!showNewBannerForm && !editingBanner && renderBannerList()}
      </div>
    </div>
  );
};

export default GachaComponents;
