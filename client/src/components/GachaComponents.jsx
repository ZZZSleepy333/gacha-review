import { useState, useEffect } from "react";
import axios from "axios";
import BannerForm from "./banner/BannerForm";
import BannerList from "./banner/BannerList";
import CharacterSelector from "./banner/CharacterSelector";

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
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [bannersResponse, charactersResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/banners`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/available`),
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

  // Xử lý tạo banner mới
  const handleCreateBanner = async (bannerData) => {
    if (!bannerData.name || !bannerData.image) {
      showSnackbar("Vui lòng nhập đầy đủ thông tin banner!");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/banners`,
        {
          ...bannerData,
          characters: selectedCharacters.map((char) => ({
            _id: char._id,
            name: char.name,
            image: char.image,
            rarity: char.rarity,
            rateUpStatus: char.rateUpStatus || "normal",
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

  // Xử lý cập nhật banner
  const handleUpdateBanner = async (bannerData) => {
    if (!bannerData.name || !bannerData.image) {
      showSnackbar("Vui lòng nhập đầy đủ thông tin banner!");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/banners/${bannerData._id}`,
        {
          ...bannerData,
          characters: selectedCharacters.map((char) => ({
            _id: char._id,
            name: char.name,
            image: char.image,
            rarity: char.rarity,
            rateUpStatus: char.rateUpStatus || "normal",
          })),
        }
      );
      setBanners(
        banners.map((banner) =>
          banner._id === bannerData._id ? response.data : banner
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
  const handleToggleCharacter = (characterOrAction) => {
    // Kiểm tra xem tham số là object action hay character trực tiếp
    if (characterOrAction && characterOrAction.action) {
      const { action } = characterOrAction;
      
      // Xử lý các loại action
      if (action === "addMultiple") {
        setSelectedCharacters([...selectedCharacters, ...characterOrAction.characters]);
      } 
      else if (action === "removeMultiple") {
        setSelectedCharacters(
          selectedCharacters.filter(
            (char) => !characterOrAction.characterIds.includes(char._id)
          )
        );
      }
      else if (action === "update") {
        // Cập nhật character với status mới
        setSelectedCharacters(
          selectedCharacters.map((char) =>
            char._id === characterOrAction.character._id 
              ? characterOrAction.character 
              : char
          )
        );
      }
      else if (action === "replaceAll") {
        // Thay thế toàn bộ danh sách nhân vật
        setSelectedCharacters(characterOrAction.characters);
      }
    } else {
      // Xử lý như trước đây nếu là character trực tiếp
      const isSelected = selectedCharacters.some(
        (char) => char._id === characterOrAction._id
      );

      if (isSelected) {
        setSelectedCharacters(
          selectedCharacters.filter((char) => char._id !== characterOrAction._id)
        );
      } else {
        setSelectedCharacters([
          ...selectedCharacters,
          { ...characterOrAction, rateUpStatus: characterOrAction.rateUpStatus || "normal" },
        ]);
      }
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

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Quản lý Banner Gacha
      </h2>
      
      {isLoading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Danh sách banner */}
          <BannerList 
            banners={banners}
            onEdit={(banner) => {
              setEditingBanner(banner);
              setSelectedCharacters(
                banner.characters.map((char) => ({
                  ...char,
                  rateUpStatus: char.rateUpStatus || "normal",
                }))
              );
            }}
            onDelete={handleDeleteBanner}
            onAddNew={() => setShowNewBannerForm(true)}
          />

          {/* Form tạo/chỉnh sửa banner */}
          {(showNewBannerForm || editingBanner) && (
            <BannerForm
              banner={editingBanner || newBanner}
              selectedCharacters={selectedCharacters}
              onSubmit={editingBanner ? handleUpdateBanner : handleCreateBanner}
              onCancel={() => {
                setEditingBanner(null);
                setShowNewBannerForm(false);
                setSelectedCharacters([]);
              }}
              onRateUpChange={handleRateUpChange}
              isEditing={!!editingBanner}
            />
          )}

          {/* Bộ chọn nhân vật */}
          {(showNewBannerForm || editingBanner) && (
            <CharacterSelector
              availableCharacters={availableCharacters}
              selectedCharacters={selectedCharacters}
              onToggleCharacter={handleToggleCharacter}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          )}
        </>
      )}
    </div>
  );
};

export default GachaComponents;
