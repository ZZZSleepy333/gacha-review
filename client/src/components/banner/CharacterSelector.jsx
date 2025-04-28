/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from "react";

const CharacterSelector = ({
  availableCharacters,
  selectedCharacters,
  onToggleCharacter,
  searchTerm,
  onSearchChange,
  onRateUpChange,
}) => {
  // State để theo dõi các category đã chọn tất cả
  const [selectedAllCategories, setSelectedAllCategories] = useState({});

  // Lọc nhân vật theo từ khóa tìm kiếm
  const filteredCharacters = availableCharacters.filter((character) =>
    (character?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  // Phân loại nhân vật theo tags
  const categorizedCharacters = () => {
    const categories = {};

    filteredCharacters.forEach((character) => {
      const tag = character.tags || "Khác";
      // Bỏ qua category "welfare"
      if (tag.toLowerCase() === "welfare") return;

      if (!categories[tag]) {
        categories[tag] = [];
      }
      categories[tag].push(character);
    });

    return categories;
  };

  // Xử lý chọn tất cả nhân vật trong một category
  const handleSelectAllInCategory = (category, characters) => {
    const isAllSelected = selectedAllCategories[category] || false;

    // Đảo trạng thái chọn tất cả
    const newSelectedAll = !isAllSelected;
    setSelectedAllCategories({
      ...selectedAllCategories,
      [category]: newSelectedAll,
    });

    // Nếu đang chọn tất cả, thêm tất cả nhân vật chưa được chọn
    if (newSelectedAll) {
      // Tìm các nhân vật chưa được chọn trong category
      const charactersToAdd = characters.filter(
        (character) =>
          !selectedCharacters.some((char) => char._id === character._id)
      );

      // Thêm tất cả nhân vật cùng một lúc
      if (charactersToAdd.length > 0) {
        // Tạo một bản sao của danh sách nhân vật đã chọn
        const updatedCharacters = [...selectedCharacters];

        // Thêm tất cả nhân vật mới vào danh sách
        charactersToAdd.forEach((character) => {
          updatedCharacters.push({
            ...character,
            rateUpStatus: "normal",
          });
        });

        // Cập nhật state với danh sách mới
        onToggleCharacter({
          action: "replaceAll",
          characters: updatedCharacters,
        });
      }
    }
    // Nếu đang bỏ chọn tất cả, xóa tất cả nhân vật trong category
    else {
      // Tìm các nhân vật đã chọn trong category này
      const charactersToRemove = characters.filter((character) =>
        selectedCharacters.some((char) => char._id === character._id)
      );

      // Xóa tất cả nhân vật cùng một lúc
      if (charactersToRemove.length > 0) {
        // Tạo một bản sao của danh sách nhân vật đã chọn
        const updatedCharacters = selectedCharacters.filter(
          (char) =>
            !charactersToRemove.some(
              (removeChar) => removeChar._id === char._id
            )
        );

        // Cập nhật state với danh sách mới
        onToggleCharacter({
          action: "replaceAll",
          characters: updatedCharacters,
        });
      }
    }
  };

  // Xử lý thay đổi rate-up trực tiếp
  const handleDirectRateUpChange = (character, status, e) => {
    // Ngăn chặn sự kiện lan truyền
    if (e) e.stopPropagation();

    // Kiểm tra xem nhân vật đã được chọn chưa
    const isSelected = selectedCharacters.some(
      (char) => char._id === character._id
    );

    // Nếu chưa được chọn, thêm vào với rate-up đã chọn
    if (!isSelected) {
      onToggleCharacter({ ...character, rateUpStatus: status });
    }
    // Nếu đã được chọn, cập nhật rate-up
    else {
      // Thay vì gọi onRateUpChange, sử dụng onToggleCharacter với action update
      if (typeof onToggleCharacter === "function") {
        // Tìm character hiện tại trong selectedCharacters để giữ nguyên các thuộc tính khác
        const currentChar = selectedCharacters.find(
          (char) => char._id === character._id
        );
        if (currentChar) {
          // Cập nhật character với status mới
          onToggleCharacter({
            action: "update",
            character: { ...currentChar, rateUpStatus: status },
          });
        }
      }
    }
  };

  // Thêm hàm xử lý khi click vào thẻ nhân vật
  const handleCharacterCardClick = (character) => {
    // Kiểm tra xem nhân vật đã được chọn chưa
    const isSelected = selectedCharacters.some(
      (char) => char._id === character._id
    );

    // Nếu đã chọn, bỏ chọn
    if (isSelected) {
      onToggleCharacter(character);
    }
    // Nếu chưa chọn, thêm vào với trạng thái normal
    else {
      onToggleCharacter({ ...character, rateUpStatus: "normal" });
    }
  };

  // Ánh xạ giá trị rate-up từ CharacterSelector sang BannerForm
  const mapRateUpValue = (value) => {
    // Trong BannerForm sử dụng: "normal", "rateup", "featured"
    // Trong CharacterSelector sử dụng: "normal", "rateup-1", "rateup-2"
    switch (value) {
      case "rateup-1":
        return "rateup";
      case "rateup-2":
        return "featured";
      default:
        return "normal";
    }
  };

  // Ánh xạ ngược lại từ BannerForm sang CharacterSelector
  const reverseMapRateUpValue = (value) => {
    switch (value) {
      case "rateup":
        return "rateup-1";
      case "featured":
        return "rateup-2";
      default:
        return "normal";
    }
  };

  // Cập nhật trạng thái selectedAllCategories khi selectedCharacters thay đổi
  useEffect(() => {
    const categories = categorizedCharacters();
    const newSelectedAllCategories = {};

    Object.entries(categories).forEach(([category, chars]) => {
      const allSelected = chars.every((character) =>
        selectedCharacters.some((char) => char._id === character._id)
      );
      newSelectedAllCategories[category] = allSelected;
    });

    setSelectedAllCategories(newSelectedAllCategories);
  }, [selectedCharacters]);

  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
      <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
        Chọn nhân vật
      </h3>

      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm nhân vật..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {Object.entries(categorizedCharacters()).map(([category, chars]) => {
        // Kiểm tra xem tất cả nhân vật trong category đã được chọn chưa
        const allSelected = chars.every((character) =>
          selectedCharacters.some((char) => char._id === character._id)
        );

        return (
          <div key={category} className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-md font-medium text-gray-800 dark:text-white">
                {category} ({chars.length})
              </h4>
              <button
                onClick={() => handleSelectAllInCategory(category, chars)}
                className={`px-2 py-1 text-xs rounded-md transition-colors ${
                  allSelected
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                }`}
              >
                {allSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {chars.map((character) => {
                const isSelected = selectedCharacters.some(
                  (char) => char._id === character._id
                );

                // Lấy rate-up status nếu đã chọn
                const selectedChar = selectedCharacters.find(
                  (char) => char._id === character._id
                );
                const rateUpStatus = selectedChar?.rateUpStatus || "normal";

                // Chuyển đổi giá trị rate-up từ BannerForm sang CharacterSelector
                const mappedRateUpStatus = reverseMapRateUpValue(rateUpStatus);

                // Xác định màu nền dựa trên trạng thái
                let bgColorClass =
                  "border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600/50";
                if (isSelected) {
                  if (mappedRateUpStatus === "normal") {
                    bgColorClass =
                      "border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400";
                  } else if (mappedRateUpStatus === "rateup-1") {
                    bgColorClass =
                      "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30 dark:border-yellow-400";
                  } else if (mappedRateUpStatus === "rateup-2") {
                    bgColorClass =
                      "border-red-500 bg-red-50 dark:bg-red-900/30 dark:border-red-400";
                  }
                }

                return (
                  <div
                    key={character._id}
                    className={`border rounded-md p-2 flex flex-col items-center transition-colors ${bgColorClass} cursor-pointer`}
                    onClick={() => handleCharacterCardClick(character)}
                  >
                    <div className="relative">
                      <img
                        src={character.image}
                        alt={character.name}
                        className="w-10 h-10 object-cover rounded-full"
                        onError={(e) => {
                          e.target.src = "/placeholder-character.jpg";
                        }}
                      />
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full w-4 h-4 flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    <p className="text-xs font-medium text-center text-gray-800 dark:text-white mt-1 truncate w-full">
                      {character.name}
                    </p>

                    {/* Nút chọn rate-up trực tiếp */}
                    <div
                      className="flex items-center justify-center mt-2 space-x-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => {
                          handleDirectRateUpChange(
                            character,
                            mapRateUpValue("normal"),
                            e
                          );
                        }}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          isSelected && mappedRateUpStatus === "normal"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                        title="Thêm vào banner"
                      >
                        +
                      </button>
                      <button
                        onClick={(e) => {
                          handleDirectRateUpChange(
                            character,
                            mapRateUpValue("rateup-1"),
                            e
                          );
                        }}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          isSelected && mappedRateUpStatus === "rateup-1"
                            ? "bg-yellow-500 text-white"
                            : "bg-yellow-200 text-yellow-700 hover:bg-yellow-300 dark:bg-yellow-700/50 dark:text-yellow-300"
                        }`}
                        title="Rate Up 1"
                      >
                        1
                      </button>
                      <button
                        onClick={(e) => {
                          handleDirectRateUpChange(
                            character,
                            mapRateUpValue("rateup-2"),
                            e
                          );
                        }}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          isSelected && mappedRateUpStatus === "rateup-2"
                            ? "bg-red-500 text-white"
                            : "bg-red-200 text-red-700 hover:bg-red-300 dark:bg-red-700/50 dark:text-red-300"
                        }`}
                        title="Rate Up 2"
                      >
                        2
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CharacterSelector;
