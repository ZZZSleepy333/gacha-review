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
  const [tickets, setTickets] = useState(() => {
    // Lấy số vé từ localStorage hoặc sử dụng giá trị mặc định
    const savedTickets = localStorage.getItem("gacha_tickets");
    return savedTickets ? parseInt(savedTickets) : 10;
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
  const [characterSALevels, setCharacterSALevels] = useState(() => {
    const savedSALevels = localStorage.getItem("gacha_sa_levels");
    return savedSALevels ? JSON.parse(savedSALevels) : {};
  });

  // Giá tiền cho mỗi lần quay
  const SINGLE_PULL_COST = 5;
  const MULTI_PULL_COST = 50;
  const TICKET_PULL_COST = 1; // 1 vé cho mỗi lần quay đơn

  // Lưu dữ liệu vào localStorage khi có thay đổi
  useEffect(() => {
    localStorage.setItem("gacha_crystals", crystals.toString());
  }, [crystals]);

  useEffect(() => {
    localStorage.setItem("gacha_tickets", tickets.toString());
  }, [tickets]);

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

    // Tỉ lệ mặc định theo yêu cầu mới
    const rates = {
      rarity5: 0.02, // 2%
      rarity4: 0.16, // 16%
      rarity3: 0.82, // 82% (đã điều chỉnh để tổng = 100%)
    };

    // Ánh xạ giá trị rate-up
    const mapRateUpStatus = (status) => {
      if (status === "rateup") return "rateup-1";
      if (status === "featured") return "rateup-2";
      return "normal";
    };

    // Tính toán tỉ lệ rate-up dựa trên số lượng nhân vật rate-up trong banner
    const rateUp1Chars5 = banner.characters.filter(
      (char) =>
        char.rarity === 5 && mapRateUpStatus(char.rateUpStatus) === "rateup-1"
    ).length;
    const rateUp2Chars5 = banner.characters.filter(
      (char) =>
        char.rarity === 5 && mapRateUpStatus(char.rateUpStatus) === "rateup-2"
    ).length;

    const rateUp1Chars4 = banner.characters.filter(
      (char) =>
        char.rarity === 4 && mapRateUpStatus(char.rateUpStatus) === "rateup-1"
    ).length;
    const rateUp2Chars4 = banner.characters.filter(
      (char) =>
        char.rarity === 4 && mapRateUpStatus(char.rateUpStatus) === "rateup-2"
    ).length;

    const rateUp1Chars3 = banner.characters.filter(
      (char) =>
        char.rarity === 3 && mapRateUpStatus(char.rateUpStatus) === "rateup-1"
    ).length;
    const rateUp2Chars3 = banner.characters.filter(
      (char) =>
        char.rarity === 3 && mapRateUpStatus(char.rateUpStatus) === "rateup-2"
    ).length;

    // Tính tổng tỉ lệ rate-up cho mỗi rarity
    const rateUp1Total5 = rateUp1Chars5 * 0.00729; // 0.729% cho mỗi nhân vật rate-up-1 5*
    const rateUp2Total5 = rateUp2Chars5 * 0.018; // 1.8% cho mỗi nhân vật rate-up-2 5*

    const rateUp1Total4 = rateUp1Chars4 * 0.01789; // 1.789% cho mỗi nhân vật rate-up-1 4*
    const rateUp2Total4 = rateUp2Chars4 * 0.09; // 9% cho mỗi nhân vật rate-up-2 4*

    const rateUp1Total3 = rateUp1Chars3 * 0.06349; // 6.349% cho mỗi nhân vật rate-up-1 3*
    const rateUp2Total3 = rateUp2Chars3 * 0.03174; // 3.174% cho mỗi nhân vật rate-up-2 3*

    // Tính tỉ lệ normal (tổng trừ đi các rate-up)
    const normalRate5 = Math.max(
      0,
      rates.rarity5 - rateUp1Total5 - rateUp2Total5
    );
    const normalRate4 = Math.max(
      0,
      rates.rarity4 - rateUp1Total4 - rateUp2Total4
    );
    const normalRate3 = Math.max(
      0,
      rates.rarity3 - rateUp1Total3 - rateUp2Total3
    );

    return {
      // Tỉ lệ tổng
      rarity5: rates.rarity5,
      rarity4: rates.rarity4,
      rarity3: rates.rarity3,

      // Tỉ lệ chi tiết
      rateUp1_5: rateUp1Total5,
      rateUp2_5: rateUp2Total5,
      normal5: normalRate5,

      rateUp1_4: rateUp1Total4,
      rateUp2_4: rateUp2Total4,
      normal4: normalRate4,

      rateUp1_3: rateUp1Total3,
      rateUp2_3: rateUp2Total3,
      normal3: normalRate3,
    };
  };

  // Hàm lấy ngẫu nhiên một nhân vật từ banner
  const getRandomCharacter = (banner, minRarity = null) => {
    const rates = calculateRates(banner);
    const random = Math.random();

    // Xác định rarity dựa trên tỉ lệ
    let rarity;
    if (minRarity === 4) {
      // Nếu yêu cầu ít nhất 4*, chỉ xét giữa 4* và 5*
      const total = rates.rarity5 + rates.rarity4;
      rarity = random < rates.rarity5 / total ? 5 : 4;
    } else {
      if (random < rates.rarity5) {
        rarity = 5;
      } else if (random < rates.rarity5 + rates.rarity4) {
        rarity = 4;
      } else {
        rarity = 3;
      }
    }

    // Xác định loại rate-up
    let rateUpStatus = null;
    let randomForRateUp = Math.random();

    if (rarity === 5) {
      const totalRateUp = rates.rateUp1_5 + rates.rateUp2_5;
      if (randomForRateUp < rates.rateUp1_5 / rates.rarity5) {
        rateUpStatus = "rateup-1";
      } else if (randomForRateUp < totalRateUp / rates.rarity5) {
        rateUpStatus = "rateup-2";
      } else {
        rateUpStatus = "normal";
      }
    } else if (rarity === 4) {
      const totalRateUp = rates.rateUp1_4 + rates.rateUp2_4;
      if (randomForRateUp < rates.rateUp1_4 / rates.rarity4) {
        rateUpStatus = "rateup-1";
      } else if (randomForRateUp < totalRateUp / rates.rarity4) {
        rateUpStatus = "rateup-2";
      } else {
        rateUpStatus = "normal";
      }
    } else {
      const totalRateUp = rates.rateUp1_3 + rates.rateUp2_3;
      if (randomForRateUp < rates.rateUp1_3 / rates.rarity3) {
        rateUpStatus = "rateup-1";
      } else if (randomForRateUp < totalRateUp / rates.rarity3) {
        rateUpStatus = "rateup-2";
      } else {
        rateUpStatus = "normal";
      }
    }

    // Ánh xạ ngược lại từ rateup-1/rateup-2 sang rateup/featured
    const mapBackRateUpStatus = (status) => {
      if (status === "rateup-1") return "rateup";
      if (status === "rateup-2") return "featured";
      return "normal";
    };

    // Ánh xạ từ rateup/featured sang rateup-1/rateup-2
    const mapRateUpStatus = (status) => {
      if (status === "rateup") return "rateup-1";
      if (status === "featured") return "rateup-2";
      return "normal";
    };

    // Lọc nhân vật theo rarity
    let charactersPool = banner.characters.filter(
      (char) => char.rarity === rarity
    );

    // Lọc bỏ nhân vật đã đạt SA.LV 100
    charactersPool = charactersPool.filter(
      (char) =>
        !characterSALevels[char._id] || characterSALevels[char._id] < 100
    );

    // Nếu không có nhân vật ở rarity này, trả về nhân vật ngẫu nhiên
    if (charactersPool.length === 0) {
      return {
        _id: `random-${Math.random()}`,
        name: `Random Character ${rarity}*`,
        image: "/placeholder-character.jpg",
        rarity: rarity,
        isRateUp: rateUpStatus !== "normal",
        rateUpStatus: mapBackRateUpStatus(rateUpStatus),
      };
    }

    // Lọc theo rateUpStatus nếu có
    const mappedRateUpStatus = mapBackRateUpStatus(rateUpStatus);
    let rateUpChars = charactersPool.filter(
      (char) => char.rateUpStatus === mappedRateUpStatus
    );

    // Lọc bỏ nhân vật đã đạt SA.LV 100
    rateUpChars = rateUpChars.filter(
      (char) =>
        !characterSALevels[char._id] || characterSALevels[char._id] < 100
    );

    // Nếu có nhân vật phù hợp với rateUpStatus, chọn ngẫu nhiên từ nhóm này
    if (mappedRateUpStatus !== "normal" && rateUpChars.length > 0) {
      const randomIndex = Math.floor(Math.random() * rateUpChars.length);
      return {
        ...rateUpChars[randomIndex],
        isRateUp: true,
      };
    }

    // Nếu không có nhân vật phù hợp với rateUpStatus hoặc rateUpStatus là normal
    // Chọn ngẫu nhiên từ tất cả nhân vật có rarity tương ứng
    const randomIndex = Math.floor(Math.random() * charactersPool.length);
    return {
      ...charactersPool[randomIndex],
      isRateUp: false,
    };
  };

  const updateSALevels = (characters) => {
    setCharacterSALevels((prev) => {
      const newSALevels = { ...prev };

      characters.forEach((char) => {
        if (char._id.startsWith("random-")) return; // Bỏ qua nhân vật ngẫu nhiên

        if (!newSALevels[char._id]) {
          // Nhân vật mới, SA.LV = 1
          newSALevels[char._id] = 1;
        } else {
          // Nhân vật trùng, tăng SA.LV theo rarity
          let increment = 1; // Mặc định cho 3*
          if (char.rarity === 5) increment = 20;
          else if (char.rarity === 4) increment = 5;

          // Đảm bảo SA.LV không vượt quá 100
          newSALevels[char._id] = Math.min(
            100,
            newSALevels[char._id] + increment
          );
        }
      });

      return newSALevels;
    });
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

  // Chỉnh sửa số crystal
  const editCrystals = () => {
    const amount = prompt("Nhập số crystal mới:", crystals.toString());
    if (amount && !isNaN(amount)) {
      setCrystals(parseInt(amount));
    }
  };

  // Chỉnh sửa số vé
  const editTickets = () => {
    const amount = prompt("Nhập số vé quay mới:", tickets.toString());
    if (amount && !isNaN(amount)) {
      setTickets(parseInt(amount));
    }
  };

  // Xóa lịch sử
  const clearHistory = () => {
    if (window.confirm("Bạn có chắc muốn xóa lịch sử quay và reset SA.LV?")) {
      setHistory([]);
      setCharacterSALevels({});
      setStats({
        totalPulls: 0,
        rarity5Count: 0,
        rarity4Count: 0,
        rarity3Count: 0,
        featuredCount: 0,
      });
    }
  };

  // Hiển thị thông báo
  const [snackbar, setSnackbar] = useState({ show: false, message: "" });

  const showSnackbar = (message) => {
    setSnackbar({ show: true, message });
    setTimeout(() => {
      setSnackbar({ show: false, message: "" });
    }, 3000);
  };

  // Thực hiện quay
  const performPull = async (isSingle, useTicket = false) => {
    if (!selectedBanner) return;

    // Kiểm tra đủ crystal/vé không
    let cost = isSingle ? SINGLE_PULL_COST : MULTI_PULL_COST;

    if (useTicket) {
      if (tickets < TICKET_PULL_COST) {
        showSnackbar("Không đủ vé quay!");
        return;
      }
    } else {
      if (crystals < cost) {
        showSnackbar("Không đủ crystal!");
        return;
      }
    }

    setIsLoading(true);
    setShowAnimation(true);
    setPullResults([]);

    // Trừ crystal hoặc vé
    if (useTicket) {
      setTickets((prev) => prev - TICKET_PULL_COST);
    } else {
      setCrystals((prev) => prev - cost);
    }

    // Tạo kết quả quay
    setTimeout(() => {
      setShowAnimation(false);
      let results = [];

      if (isSingle) {
        // Quay đơn
        results = [getRandomCharacter(selectedBanner)];
      } else {
        // Quay 10 lần
        for (let i = 0; i < 10; i++) {
          if (i === 9) {
            // Lần quay thứ 10: tỉ lệ 5* nhân đôi, tỉ lệ 4* là 96%
            const specialRates = calculateRates(selectedBanner);

            // Tạo bản sao của banner để điều chỉnh tỉ lệ
            const modifiedBanner = JSON.parse(JSON.stringify(selectedBanner));

            // Tính toán tỉ lệ mới cho lần quay thứ 10
            const random = Math.random();

            // Tỉ lệ 5* nhân đôi (4%)
            if (random < specialRates.rarity5 * 2) {
              // Lấy nhân vật 5* với tỉ lệ rate-up cũng nhân đôi
              const char5 = getRandomCharacterWithModifiedRates(
                selectedBanner,
                5,
                2
              );
              results.push(char5);
            }
            // Tỉ lệ 4* là 96%
            else {
              // Lấy nhân vật 4* với tỉ lệ rate-up nhân với 16/3
              const char4 = getRandomCharacterWithModifiedRates(
                selectedBanner,
                4,
                16 / 3
              );
              results.push(char4);
            }
          } else {
            // Các lần quay bình thường
            results.push(getRandomCharacter(selectedBanner));
          }
        }

        // Đảm bảo ít nhất có 1 nhân vật 4* trở lên
        const hasRare = results.some((char) => char.rarity >= 4);
        if (!hasRare) {
          // Thay thế nhân vật cuối cùng bằng nhân vật 4* trở lên
          results[9] = getRandomCharacter(selectedBanner, 4);
        }
      }
      updateSALevels(results);

      // Cập nhật kết quả và lịch sử
      setPullResults(results);
      setHistory((prev) => [
        {
          date: new Date().toISOString(),
          banner: selectedBanner.name,
          results: results.map((char) => ({
            ...char,
            saLevel: characterSALevels[char._id] || 1, // Thêm thông tin SA.LV vào kết quả
          })),
          isSingle,
          useTicket,
        },
        ...prev,
      ]);
      // Cập nhật thống kê
      updateStats(results);
      setIsLoading(false);
    }, 1500);
  };

  // Hàm lấy nhân vật với tỉ lệ rate-up được điều chỉnh
  const getRandomCharacterWithModifiedRates = (
    banner,
    targetRarity,
    rateMultiplier
  ) => {
    const rates = calculateRates(banner);

    // Xác định loại rate-up với tỉ lệ được điều chỉnh
    let rateUpStatus = "normal";
    let randomForRateUp = Math.random();

    if (targetRarity === 5) {
      // Tỉ lệ rate-up cho 5* nhân với hệ số
      const rateUp1Adjusted = rates.rateUp1_5 * rateMultiplier;
      const rateUp2Adjusted = rates.rateUp2_5 * rateMultiplier;
      const totalRateUpAdjusted = rateUp1Adjusted + rateUp2Adjusted;
      const totalRate = rates.rarity5 * rateMultiplier;

      if (randomForRateUp < rateUp1Adjusted / totalRate) {
        rateUpStatus = "rateup-1";
      } else if (randomForRateUp < totalRateUpAdjusted / totalRate) {
        rateUpStatus = "rateup-2";
      }
    } else if (targetRarity === 4) {
      // Tỉ lệ rate-up cho 4* nhân với hệ số
      const rateUp1Adjusted = rates.rateUp1_4 * rateMultiplier;
      const rateUp2Adjusted = rates.rateUp2_4 * rateMultiplier;
      const totalRateUpAdjusted = rateUp1Adjusted + rateUp2Adjusted;
      const totalRate = 0.96; // Tỉ lệ 4* là 96% cho lần quay thứ 10

      if (randomForRateUp < rateUp1Adjusted / totalRate) {
        rateUpStatus = "rateup-1";
      } else if (randomForRateUp < totalRateUpAdjusted / totalRate) {
        rateUpStatus = "rateup-2";
      }
    }

    // Ánh xạ ngược lại từ rateup-1/rateup-2 sang rateup/featured
    const mapBackRateUpStatus = (status) => {
      if (status === "rateup-1") return "rateup";
      if (status === "rateup-2") return "featured";
      return "normal";
    };

    // Lọc nhân vật theo rarity
    let charactersPool = banner.characters.filter(
      (char) => char.rarity === targetRarity
    );

    // Nếu không có nhân vật ở rarity này, trả về nhân vật ngẫu nhiên
    if (charactersPool.length === 0) {
      return {
        _id: `random-${Math.random()}`,
        name: `Random Character ${targetRarity}*`,
        image: "/placeholder-character.jpg",
        rarity: targetRarity,
        isRateUp: rateUpStatus !== "normal",
        rateUpStatus: mapBackRateUpStatus(rateUpStatus),
      };
    }

    // Lọc theo rateUpStatus nếu có
    const mappedRateUpStatus = mapBackRateUpStatus(rateUpStatus);
    const rateUpChars = charactersPool.filter(
      (char) => char.rateUpStatus === mappedRateUpStatus
    );

    // Nếu có nhân vật phù hợp với rateUpStatus, chọn ngẫu nhiên từ nhóm này
    if (mappedRateUpStatus !== "normal" && rateUpChars.length > 0) {
      const randomIndex = Math.floor(Math.random() * rateUpChars.length);
      return {
        ...rateUpChars[randomIndex],
        isRateUp: true,
      };
    }

    // Nếu không có nhân vật phù hợp với rateUpStatus hoặc rateUpStatus là normal
    // Chọn ngẫu nhiên từ tất cả nhân vật có rarity tương ứng
    const randomIndex = Math.floor(Math.random() * charactersPool.length);
    return {
      ...charactersPool[randomIndex],
      isRateUp: false,
    };
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Mô phỏng Gacha
        </h1>

        {/* Thông tin Crystal và Vé */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4 mb-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <img
                src="https://cdn.housamo.xyz/housamo/unity/Android/icon_item/icon_item_stone.png"
                alt="Crystal"
                className="w-8 h-8 mr-2"
                onError={(e) =>
                  (e.target.src = "https://via.placeholder.com/32")
                }
              />
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {crystals.toLocaleString()}
              </span>
              <button
                onClick={editCrystals}
                className="ml-2 p-1 text-gray-500 hover:text-blue-500"
                title="Chỉnh sửa số crystal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            </div>

            <div className="flex items-center">
              <img
                src="https://cdn.housamo.xyz/housamo/unity/Android/icon_item/icon_item_gachaticket.png"
                alt="Ticket"
                className="w-8 h-8 mr-2"
                onError={(e) =>
                  (e.target.src = "https://via.placeholder.com/32")
                }
              />
              <span className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                {tickets.toLocaleString()}
              </span>
              <button
                onClick={editTickets}
                className="ml-2 p-1 text-gray-500 hover:text-green-500"
                title="Chỉnh sửa số vé"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div>
            <button
              onClick={clearHistory}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Xóa lịch sử
            </button>
          </div>
        </div>

        {/* Chọn banner */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
            Chọn Banner
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {banners.map((banner) => (
              <div
                key={banner._id}
                className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                  selectedBanner && selectedBanner._id === banner._id
                    ? "border-blue-500 shadow-lg transform scale-105"
                    : "border-gray-200 dark:border-gray-600 hover:border-blue-300"
                }`}
                onClick={() => setSelectedBanner(banner)}
              >
                <img
                  src={banner.image}
                  alt={banner.name}
                  className="w-full h-32 object-cover"
                  onError={(e) => (e.target.src = "/placeholder-banner.jpg")}
                />
                <div className="p-2 bg-white dark:bg-gray-800">
                  <h3 className="text-sm font-medium text-center text-gray-800 dark:text-white truncate">
                    {banner.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Thông tin banner đã chọn */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
            {selectedBanner ? selectedBanner.name : "Chọn banner để bắt đầu"}
          </h2>

          <div className="mb-4">
            {selectedBanner && (
              <img
                src={selectedBanner.image}
                alt={selectedBanner.name}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => (e.target.src = "/placeholder-banner.jpg")}
              />
            )}
          </div>

          <div className="mb-4">
            <h3 className="text-md font-medium mb-2 text-gray-800 dark:text-white">
              Nhân vật Rate-Up
            </h3>
            {selectedBanner && (
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
                        className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 ${
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
                        <div className="absolute bottom-0 right-0 w-5 h-5 bg-yellow-500 rounded-xl flex items-center justify-center text-xs text-white font-bold">
                          {char.rarity}
                        </div>
                      </div>
                      <span className="text-xs mt-1 text-center text-gray-700 dark:text-gray-300">
                        {char.name}
                      </span>
                      <span className="text-xs text-center text-gray-500 dark:text-gray-400">
                        {char.rateUpStatus === "featured"
                          ? "Featured"
                          : "Rate Up"}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Nút quay */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => performPull(true, true)}
              disabled={isLoading || tickets < TICKET_PULL_COST}
              className={`px-6 py-2 rounded-md font-medium ${
                isLoading || tickets < TICKET_PULL_COST
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              Quay bằng vé ({TICKET_PULL_COST})
            </button>
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
                    className={`relative w-16 h-16 rounded-br-md rounded-tl-md overflow-hidden border-2 ${
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
                      className={`absolute bottom-0 right-0 w-5 h-5 rounded-br-md rounded-tl-md flex items-center justify-center text-xs text-white font-bold ${
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
                      <div className="absolute top-0 left-0 w-5 h-5 bg-red-500 rounded-br-md rounded-tl-md flex items-center justify-center text-xs text-white font-bold">
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
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4 mb-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
              Lịch sử quay
            </h2>
            {history.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                Chưa có lịch sử quay nào.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {Object.entries(characterSALevels)
                  .map(([charId, saLevel]) => {
                    // Tìm thông tin nhân vật từ lịch sử
                    const allResults = history.flatMap(
                      (entry) => entry.results
                    );
                    const character = allResults.find(
                      (char) => char._id === charId
                    );

                    // Nếu không tìm thấy nhân vật hoặc là nhân vật ngẫu nhiên, bỏ qua
                    if (!character || charId.startsWith("random-")) return null;

                    return (
                      <div
                        key={charId}
                        className={`bg-gray-50 dark:bg-gray-800 rounded-br-md rounded-tl-md p-2 flex flex-col items-center border-2 ${
                          character.rarity === 5
                            ? "border-yellow-400"
                            : character.rarity === 4
                            ? "border-purple-400"
                            : "border-blue-400"
                        }`}
                      >
                        <div
                          className={`relative w-16 h-16 rounded-br-md rounded-tl-md overflow-hidden mb-2 ${
                            character.rarity === 5
                              ? "bg-yellow-100 dark:bg-yellow-900"
                              : character.rarity === 4
                              ? "bg-purple-100 dark:bg-purple-900"
                              : "bg-blue-100 dark:bg-blue-900"
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
                            className={`absolute bottom-0 right-0 w-5 h-5 rounded-br-md rounded-tl-md flex items-center justify-center text-xs text-white font-bold ${
                              character.rarity === 5
                                ? "bg-yellow-500"
                                : character.rarity === 4
                                ? "bg-purple-500"
                                : "bg-blue-500"
                            }`}
                          >
                            {character.rarity}
                          </div>
                        </div>
                        <h3 className="text-sm font-medium text-center text-gray-800 dark:text-white truncate w-full">
                          {character.name}
                        </h3>
                        <div className="mt-1 px-2 py-1 bg-green-100 dark:bg-green-800 rounded-xl text-xs font-medium text-green-800 dark:text-green-100">
                          SA.LV {saLevel}
                        </div>
                      </div>
                    );
                  })
                  .filter(Boolean)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GachaSimulator;
