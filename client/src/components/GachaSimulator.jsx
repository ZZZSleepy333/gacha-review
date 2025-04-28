import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const GachaSimulator = () => {
  const [banners, setBanners] = useState([]);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [crystals, setCrystals] = useState(() => {
    // Lấy số crystal từ localStorage hoặc sử dụng giá trị mặc định
    const savedCrystals = localStorage.getItem("gacha_crystals");
    return savedCrystals ? parseInt(savedCrystals) : 3000;
  });
  const [pullResults, setPullResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [history, setHistory] = useState(() => {
    // Lấy lịch sử quay từ localStorage hoặc sử dụng mảng rỗng
    const savedHistory = localStorage.getItem("gacha_history");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [stats, setStats] = useState(() => {
    // Lấy thống kê từ localStorage hoặc sử dụng giá trị mặc định
    const savedStats = localStorage.getItem("gacha_stats");
    return savedStats
      ? JSON.parse(savedStats)
      : {
          totalPulls: 0,
          rarity5Count: 0,
          rarity4Count: 0,
          rarity3Count: 0,
          featuredCount: 0,
        };
  });

  // Giá tiền cho mỗi lần quay
  const SINGLE_PULL_COST = 150;
  const MULTI_PULL_COST = 1500;

  // Lưu dữ liệu vào localStorage khi có thay đổi
  useEffect(() => {
    localStorage.setItem("gacha_crystals", crystals.toString());
  }, [crystals]);

  useEffect(() => {
    localStorage.setItem("gacha_history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("gacha_stats", JSON.stringify(stats));
  }, [stats]);

  // Fetch danh sách banner khi component mount
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/banners`
        );
        setBanners(response.data);
        if (response.data.length > 0) {
          // Kiểm tra xem có banner đã chọn trước đó không
          const savedBannerId = localStorage.getItem("gacha_selected_banner");
          if (savedBannerId) {
            const savedBanner = response.data.find(
              (banner) => banner._id === savedBannerId
            );
            if (savedBanner) {
              setSelectedBanner(savedBanner);
              return;
            }
          }
          // Nếu không có hoặc không tìm thấy, chọn banner đầu tiên
          setSelectedBanner(response.data[0]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách banner:", error);
      }
    };

    fetchBanners();
  }, []);

  // Lưu banner đã chọn vào localStorage
  useEffect(() => {
    if (selectedBanner) {
      localStorage.setItem("gacha_selected_banner", selectedBanner._id);
    }
  }, [selectedBanner]);

  // Hàm tính toán tỉ lệ quay dựa trên banner
  const calculateRates = (banner) => {
    if (!banner) return null;

    // Mặc định tỉ lệ
    const rates = {
      rarity5: 0.02, // 2%
      rarity4: 0.08, // 8%
      rarity3: 0.9, // 90%
      featured5: 0.006, // 0.6% (30% của 2%)
      featured4: 0.02, // 2% (25% của 8%)
    };

    // Nếu banner có tỉ lệ riêng, sử dụng tỉ lệ đó
    if (banner.rates) {
      return banner.rates;
    }

    return rates;
  };

  // Hàm thực hiện quay gacha
  const performPull = (isSinglePull) => {
    if (!selectedBanner) return;

    const cost = isSinglePull ? SINGLE_PULL_COST : MULTI_PULL_COST;
    const pullCount = isSinglePull ? 1 : 10;

    // Kiểm tra xem có đủ crystal không
    if (crystals < cost) {
      alert("Không đủ crystal để quay!");
      return;
    }

    setIsLoading(true);
    setCrystals(crystals - cost);

    // Tính toán tỉ lệ
    const rates = calculateRates(selectedBanner);
    const results = [];
    let guaranteedRarity4 = false;

    // Nếu là multi pull, đảm bảo ít nhất có 1 nhân vật 4* trở lên
    if (!isSinglePull) {
      guaranteedRarity4 = true;
    }

    // Thực hiện quay
    for (let i = 0; i < pullCount; i++) {
      // Nếu là lần quay cuối cùng trong multi pull và chưa có 4* trở lên
      const isLastPull = i === pullCount - 1;
      if (
        isLastPull &&
        guaranteedRarity4 &&
        !results.some((char) => char.rarity >= 4)
      ) {
        // Đảm bảo quay được ít nhất 4*
        results.push(getRandomCharacter(selectedBanner, 4));
      } else {
        results.push(getRandomCharacter(selectedBanner));
      }
    }

    // Cập nhật thống kê
    updateStats(results);

    // Hiển thị animation
    setShowAnimation(true);
    setTimeout(() => {
      setPullResults(results);
      setShowAnimation(false);

      // Thêm vào lịch sử
      setHistory((prev) => [
        {
          date: new Date().toLocaleString(),
          banner: selectedBanner.name,
          results: [...results],
          cost: cost,
        },
        ...prev,
      ]);
    }, 1500);

    setIsLoading(false);
  };

  // Hàm lấy ngẫu nhiên một nhân vật từ banner
  const getRandomCharacter = (banner, minRarity = null) => {
    const rates = calculateRates(banner);
    const random = Math.random();

    // Xác định rarity dựa trên tỉ lệ
    let rarity;
    if (minRarity === 4) {
      // Nếu yêu cầu ít nhất 4*, chỉ xét giữa 4* và 5*
      rarity = random < rates.rarity5 / (rates.rarity5 + rates.rarity4) ? 5 : 4;
    } else {
      if (random < rates.rarity5) {
        rarity = 5;
      } else if (random < rates.rarity5 + rates.rarity4) {
        rarity = 4;
      } else {
        rarity = 3;
      }
    }

    // Lọc nhân vật theo rarity
    const charactersOfRarity = banner.characters.filter(
      (char) => char.rarity === rarity
    );

    // Nếu không có nhân vật ở rarity này, trả về nhân vật ngẫu nhiên
    if (charactersOfRarity.length === 0) {
      return {
        _id: `random-${Math.random()}`,
        name: `Random Character ${rarity}*`,
        image: "/placeholder-character.jpg",
        rarity: rarity,
        isRateUp: false,
      };
    }

    // Xác định xem có quay trúng nhân vật rate-up không
    const isRateUp =
      rarity === 5
        ? random < rates.featured5
        : rarity === 4
        ? random < rates.featured4
        : false;

    // Lọc nhân vật rate-up
    const rateUpCharacters = charactersOfRarity.filter(
      (char) =>
        char.rateUpStatus === "rateup" || char.rateUpStatus === "featured"
    );

    // Nếu quay trúng rate-up nhưng không có nhân vật rate-up, lấy ngẫu nhiên
    if (isRateUp && rateUpCharacters.length === 0) {
      const randomIndex = Math.floor(Math.random() * charactersOfRarity.length);
      return {
        ...charactersOfRarity[randomIndex],
        isRateUp: false,
      };
    }

    // Nếu quay trúng rate-up, lấy ngẫu nhiên từ danh sách rate-up
    if (isRateUp && rateUpCharacters.length > 0) {
      const randomIndex = Math.floor(Math.random() * rateUpCharacters.length);
      return {
        ...rateUpCharacters[randomIndex],
        isRateUp: true,
      };
    }

    // Nếu không trúng rate-up, lấy ngẫu nhiên từ tất cả
    const randomIndex = Math.floor(Math.random() * charactersOfRarity.length);
    return {
      ...charactersOfRarity[randomIndex],
      isRateUp: false,
    };
  };

  // Cập nhật thống kê
  const updateStats = (results) => {
    setStats((prev) => {
      const newStats = { ...prev };
      newStats.totalPulls += results.length;

      results.forEach((char) => {
        if (char.rarity === 5) newStats.rarity5Count++;
        else if (char.rarity === 4) newStats.rarity4Count++;
        else if (char.rarity === 3) newStats.rarity3Count++;

        if (char.isRateUp) newStats.featuredCount++;
      });

      return newStats;
    });
  };

  // Reset số crystal
  const resetCrystals = () => {
    const amount = prompt("Nhập số crystal mới:", "3000");
    if (amount && !isNaN(amount)) {
      setCrystals(parseInt(amount));
    }
  };

  // Xóa lịch sử
  const clearHistory = () => {
    if (window.confirm("Bạn có chắc muốn xóa lịch sử quay?")) {
      setHistory([]);
      setStats({
        totalPulls: 0,
        rarity5Count: 0,
        rarity4Count: 0,
        rarity3Count: 0,
        featuredCount: 0,
      });
    }
  };

  // Xuất dữ liệu
  const exportData = () => {
    const data = {
      crystals,
      history,
      stats,
      date: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `gacha-data-${new Date()
      .toLocaleDateString()
      .replace(/\//g, "-")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Nhập dữ liệu
  const importData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);

          if (data.crystals !== undefined) setCrystals(data.crystals);
          if (data.history) setHistory(data.history);
          if (data.stats) setStats(data.stats);

          showSnackbar("Nhập dữ liệu thành công!");
        } catch (error) {
          console.error("Lỗi khi đọc file:", error);
          showSnackbar("File không hợp lệ!");
        }
      };

      reader.readAsText(file);
    };

    input.click();
  };

  // Hiển thị thông báo
  const [snackbar, setSnackbar] = useState({ show: false, message: "" });

  const showSnackbar = (message) => {
    setSnackbar({ show: true, message });
    setTimeout(() => {
      setSnackbar({ show: false, message: "" });
    }, 3000);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Mô phỏng Gacha
        </h1>

        {/* Thông tin Crystal */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4 mb-6 flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="/crystal-icon.png"
              alt="Crystal"
              className="w-8 h-8 mr-2"
              onError={(e) => (e.target.src = "https://via.placeholder.com/32")}
            />
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {crystals.toLocaleString()}
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={resetCrystals}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Đặt lại Crystal
            </button>
            <button
              onClick={exportData}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              title="Xuất dữ liệu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={importData}
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
              title="Nhập dữ liệu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                  transform="rotate(180 10 10)"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Chọn Banner */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
            Chọn Banner
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {banners.map((banner) => (
              <div
                key={banner._id}
                className={`border rounded-lg p-3 cursor-pointer transition-all ${
                  selectedBanner?._id === banner._id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                    : "border-gray-200 dark:border-gray-600 hover:border-blue-300"
                }`}
                onClick={() => setSelectedBanner(banner)}
              >
                <div className="flex items-center">
                  <img
                    src={banner.image || "/placeholder-banner.jpg"}
                    alt={banner.name}
                    className="w-16 h-16 object-cover rounded-md mr-3"
                    onError={(e) => (e.target.src = "/placeholder-banner.jpg")}
                  />
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">
                      {banner.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      {banner.characters?.length || 0} nhân vật
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Banner đã chọn */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
            {selectedBanner.name}
          </h2>

          {/* Nhân vật Rate Up */}
          <div className="mb-4">
            <h3 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">
              Rate Up
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedBanner.characters
                .filter(
                  (char) =>
                    char.rateUpStatus === "rateup" ||
                    char.rateUpStatus === "featured"
                )
                .map((char) => (
                  <div key={char._id} className="flex flex-col items-center">
                    <div
                      className={`relative w-16 h-16 rounded-full overflow-hidden border-2 ${
                        char.rarity === 5
                          ? "border-yellow-400"
                          : char.rarity === 4
                          ? "border-purple-400"
                          : "border-blue-400"
                      }`}
                    >
                      <img
                        src={char.image}
                        alt={char.name}
                        className="w-full h-full object-cover"
                        onError={(e) =>
                          (e.target.src = "/placeholder-character.jpg")
                        }
                      />
                      <div className="absolute bottom-0 right-0 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                        {char.rarity}
                      </div>
                    </div>
                    <span className="text-xs mt-1 text-center text-gray-700 dark:text-gray-300">
                      {char.name}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Nút quay */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => performPull(true)}
              disabled={isLoading || crystals < SINGLE_PULL_COST}
              className={`px-6 py-2 rounded-md font-medium ${
                isLoading || crystals < SINGLE_PULL_COST
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Quay 1 lần ({SINGLE_PULL_COST})
            </button>
            <button
              onClick={() => performPull(false)}
              disabled={isLoading || crystals < MULTI_PULL_COST}
              className={`px-6 py-2 rounded-md font-medium ${
                isLoading || crystals < MULTI_PULL_COST
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-purple-500 text-white hover:bg-purple-600"
              }`}
            >
              Quay 10 lần ({MULTI_PULL_COST})
            </button>
          </div>
        </div>

        {/* Animation và kết quả quay */}
        {showAnimation ? (
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-8 mb-6 flex justify-center items-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold text-center"
            >
              Đang quay...
            </motion.div>
          </div>
        ) : pullResults.length > 0 ? (
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4 mb-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
              Kết quả quay
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-2">
              {pullResults.map((character, index) => (
                <motion.div
                  key={`${character._id}-${index}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div
                    className={`relative w-16 h-16 rounded-full overflow-hidden border-2 ${
                      character.rarity === 5
                        ? "border-yellow-400 bg-yellow-100"
                        : character.rarity === 4
                        ? "border-purple-400 bg-purple-100"
                        : "border-blue-400 bg-blue-100"
                    }`}
                  >
                    <img
                      src={character.image}
                      alt={character.name}
                      className="w-full h-full object-cover"
                      onError={(e) =>
                        (e.target.src = "/placeholder-character.jpg")
                      }
                    />
                    <div
                      className={`absolute bottom-0 right-0 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white font-bold ${
                        character.rarity === 5
                          ? "bg-yellow-500"
                          : character.rarity === 4
                          ? "bg-purple-500"
                          : "bg-blue-500"
                      }`}
                    >
                      {character.rarity}
                    </div>
                    {character.isRateUp && (
                      <div className="absolute top-0 left-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                        UP
                      </div>
                    )}
                  </div>
                  <span className="text-xs mt-1 text-center text-gray-700 dark:text-gray-300 truncate w-full">
                    {character.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Thống kê */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Thống kê tổng quát */}
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
              Thống kê
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Tổng số lần quay:
                </span>
                <span className="font-medium text-gray-800 dark:text-white">
                  {stats.totalPulls}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Nhân vật 5★:
                </span>
                <span className="font-medium text-yellow-500">
                  {stats.rarity5Count} (
                  {stats.totalPulls > 0
                    ? ((stats.rarity5Count / stats.totalPulls) * 100).toFixed(2)
                    : 0}
                  %)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Nhân vật 4★:
                </span>
                <span className="font-medium text-purple-500">
                  {stats.rarity4Count} (
                  {stats.totalPulls > 0
                    ? ((stats.rarity4Count / stats.totalPulls) * 100).toFixed(2)
                    : 0}
                  %)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Nhân vật 3★:
                </span>
                <span className="font-medium text-blue-500">
                  {stats.rarity3Count} (
                  {stats.totalPulls > 0
                    ? ((stats.rarity3Count / stats.totalPulls) * 100).toFixed(2)
                    : 0}
                  %)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Nhân vật Rate Up:
                </span>
                <span className="font-medium text-red-500">
                  {stats.featuredCount} (
                  {stats.totalPulls > 0
                    ? ((stats.featuredCount / stats.totalPulls) * 100).toFixed(
                        2
                      )
                    : 0}
                  %)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Crystal đã dùng:
                </span>
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  {(stats.totalPulls * 150).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Lịch sử quay */}
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Lịch sử quay
              </h2>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-sm text-red-500 hover:text-red-600"
                >
                  Xóa lịch sử
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                Chưa có lịch sử quay
              </p>
            ) : (
              <div className="max-h-60 overflow-y-auto space-y-2">
                {history.map((entry, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 dark:border-gray-600 pb-2 last:border-0"
                  >
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        {entry.date}
                      </span>
                      <span className="text-blue-500">
                        {entry.cost} crystal
                      </span>
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      Banner: {entry.banner}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {entry.results.map((char, charIndex) => (
                        <div
                          key={`${char._id}-${charIndex}`}
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-bold ${
                            char.rarity === 5
                              ? "bg-yellow-500"
                              : char.rarity === 4
                              ? "bg-purple-500"
                              : "bg-blue-500"
                          }`}
                          title={char.name}
                        >
                          {char.rarity}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GachaSimulator;
