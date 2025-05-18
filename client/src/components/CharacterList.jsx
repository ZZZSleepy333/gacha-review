import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfinity, // Icon cho Permanent
  faGift, // Icon cho Welfare (hoặc một icon phù hợp)
  faTree, // Icon cho Christmas Variant
  faHeart, // Icon cho Valentine Variant
  faSun, // Icon cho Summer Variant
  faGhost, // Icon cho Halloween Variant
  faBookOpen, // Icon cho Main Story Variant
  faUserClock, // Icon cho Welfare (hoặc một icon phù hợp)
  faFilter, // Added for filter toggle
  faTimesCircle, // Added for clear filters
} from "@fortawesome/free-solid-svg-icons";

const CharacterList = () => {
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    attribute: [], // array of selected attributes
    rarity: [],
    weaponType: [],
    characterType: [],
    adminReview: [],
  });
  const [showFilters, setShowFilters] = useState(true); // For mobile filter toggle

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

  // Filter characters
  const filteredCharacters = characters.filter((character) => {
    const matchesSearch =
      character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      character.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRarity =
      filters.rarity.length > 0
        ? filters.rarity.includes(character.rarity)
        : true;

    const matchesAttribute =
      filters.attribute.length > 0
        ? filters.attribute.includes(character.attribute)
        : true;

    const matchesWeaponType =
      filters.weaponType.length > 0
        ? filters.weaponType.includes(character.weaponType)
        : true;

    const matchesCharacterType =
      filters.characterType.length > 0
        ? filters.characterType.includes(character.characterType)
        : true;

    const matchesAdminReview =
      filters.adminReview.length > 0
        ? filters.adminReview.includes(character.adminReview)
        : true;

    return (
      matchesSearch &&
      matchesRarity &&
      matchesAttribute &&
      matchesWeaponType &&
      matchesCharacterType &&
      matchesAdminReview
    );
  });

  // Get unique filter options
  const rarities = [
    {
      value: 1,
      image:
        "https://cdn.housamo.xyz/housamo/unity/Android/ui/button/ui_button_rare1.png",
    },
    {
      value: 2,
      image:
        "https://cdn.housamo.xyz/housamo/unity/Android/ui/button/ui_button_rare2.png",
    },
    {
      value: 3,
      image:
        "https://cdn.housamo.xyz/housamo/unity/Android/ui/button/ui_button_rare3.png",
    },
    {
      value: 4,
      image:
        "https://cdn.housamo.xyz/housamo/unity/Android/ui/button/ui_button_rare4.png",
    },
    {
      value: 5,
      image:
        "https://cdn.housamo.xyz/housamo/unity/Android/ui/button/ui_button_rare5.png",
    },
  ];
  const attributes = [
    {
      value: "Fire",
      image: "https://cdn.housamo.xyz/wiki/images/3/3d/Element_fire.png",
    },
    {
      value: "Water",
      image: "https://cdn.housamo.xyz/wiki/images/4/42/Element_water.png",
    },
    {
      value: "Wood",
      image: "https://cdn.housamo.xyz/wiki/images/6/68/Element_earth.png",
    },
    {
      value: "Aether",
      image: "https://cdn.housamo.xyz/wiki/images/a/a6/Element_light.png",
    },
    {
      value: "Nether",
      image: "https://cdn.housamo.xyz/wiki/images/8/8b/Element_dark.png",
    },
    {
      value: "All",
      image: "https://cdn.housamo.xyz/wiki/images/3/3a/Element_none.png",
    },

    {
      value: "World",
      image: "https://cdn.housamo.xyz/wiki/images/3/3d/Element_world.png",
    },
    {
      value: "Valiant",
      image: "https://cdn.housamo.xyz/wiki/images/e/e6/Element_hero.png",
    },
    {
      value: "Infernal",
      image: "https://cdn.housamo.xyz/wiki/images/6/67/Element_evil.png",
    },
    {
      value: "Infinity",
      image: "https://cdn.housamo.xyz/wiki/images/9/9d/Element_infinity.png",
    },
    {
      value: "Null",
      image: "https://cdn.housamo.xyz/wiki/images/2/2c/Element_zero.png",
    },
    {
      value: "Divine",
      image: "https://cdn.housamo.xyz/wiki/images/5/52/Element_god.png",
    },
  ];
  const weaponTypes = [
    {
      value: "Slash",
      image: "https://cdn.housamo.xyz/wiki/images/e/ec/Icon_weapon_slash.png",
    },
    {
      value: "Long Slash",
      image:
        "https://cdn.housamo.xyz/wiki/images/3/37/Icon_weapon_longslash.png",
    },
    {
      value: "Blunt",
      image: "https://cdn.housamo.xyz/wiki/images/9/97/Icon_weapon_knock.png",
    },
    {
      value: "Thrust",
      image: "https://cdn.housamo.xyz/wiki/images/8/8f/Icon_weapon_thrust.png",
    },
    {
      value: "Shot",
      image: "https://cdn.housamo.xyz/wiki/images/a/af/Icon_weapon_shoot.png",
    },
    {
      value: "Snipe",
      image: "https://cdn.housamo.xyz/wiki/images/d/d6/Icon_weapon_snipe.png",
    },
    {
      value: "Magic",
      image: "https://cdn.housamo.xyz/wiki/images/a/a3/Icon_weapon_magic.png",
    },
    {
      value: "All",
      image: "https://cdn.housamo.xyz/wiki/images/6/66/Icon_weapon_all.png",
    },
    {
      value: "None",
      image: "https://cdn.housamo.xyz/wiki/images/3/39/Icon_weapon_nothing.png",
    },
  ];
  const characterTypes = [
    "Permanent",
    "Limited",
    "Christmas Variant",
    "Valentine Variant",
    "Summer Variant",
    "Halloween Variant",
    "Main Story Variant",
    "Welfare",
  ];
  const characterTypeIcons = {
    Permanent: faInfinity,
    Limited: faUserClock,
    "Christmas Variant": faTree,
    "Valentine Variant": faHeart,
    "Summer Variant": faSun,
    "Halloween Variant": faGhost,
    "Main Story Variant": faBookOpen,
    Welfare: faGift,
  };

  const adminReviews = ["D", "C", "B", "A", "A+", "S", "S+"];

  // Rating color mapping
  const ratingColor = (rating) => {
    switch (rating) {
      case "S+":
        return "bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500";
      case "S":
        return "bg-red-600 dark:bg-red-500";
      case "A+":
        return "bg-orange-500 dark:bg-orange-400";
      case "A":
        return "bg-yellow-500 dark:bg-yellow-400";
      case "B":
        return "bg-green-500 dark:bg-green-400";
      case "C":
        return "bg-blue-500 dark:bg-blue-400";
      case "D":
        return "bg-gray-500 dark:bg-gray-400";
      default:
        return "bg-gray-200 dark:bg-gray-600";
    }
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return (
      filters.rarity.length > 0 ||
      filters.attribute.length > 0 ||
      filters.weaponType.length > 0 ||
      filters.characterType.length > 0 ||
      filters.adminReview.length > 0 ||
      searchTerm.length > 0
    );
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      rarity: [],
      attribute: [],
      weaponType: [],
      characterType: [],
      adminReview: [],
    });
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4 flex justify-between items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faFilter} className="mr-2" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>

          {hasActiveFilters() && (
            <button
              onClick={clearAllFilters}
              className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
            >
              <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
              Clear All
            </button>
          )}
        </div>

        {/* Filter/Search Bar */}
        <div
          className={`bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-8 transition-all duration-300 ${
            showFilters ? "block" : "hidden md:block"
          }`}
        >
          <div className="flex flex-col md:flex-col items-start gap-4">
            {/* Search Input */}
            <div className="flex-1 flex flex-col md:flex-row gap-4 w-full">
              <div className="w-full md:w-auto">
                <label
                  htmlFor="search"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                >
                  Tìm kiếm nhân vật
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400 dark:text-gray-300"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
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
                    id="search"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 dark:text-gray-100 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Search by name or title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              {/* Tier Filter */}
              <div className="w-full md:w-auto">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Đánh giá nhân vật
                </label>
                <div className="flex flex-wrap gap-2">
                  {adminReviews.map((review) => {
                    const selected = filters.adminReview.includes(review);
                    return (
                      <button
                        key={review}
                        onClick={() => {
                          const newAdminReviews = selected
                            ? filters.adminReview.filter((r) => r !== review)
                            : [...filters.adminReview, review];
                          setFilters({
                            ...filters,
                            adminReview: newAdminReviews,
                          });
                        }}
                        className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-200 text-sm font-semibold ${
                          selected
                            ? "bg-blue-500 border-blue-600 text-white dark:bg-blue-600 dark:border-blue-700"
                            : "bg-white border-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                        }`}
                      >
                        {review}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 w-full">
              {/* Rarity Filter */}
              <div className="w-full md:w-auto">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Độ hiếm
                </label>
                <div className="flex flex-wrap gap-2">
                  {rarities.map((attr) => {
                    const selected = filters.rarity.includes(attr.value);
                    return (
                      <button
                        key={attr.value}
                        onClick={() => {
                          const newRarities = selected
                            ? filters.rarity.filter((a) => a !== attr.value)
                            : [...filters.rarity, attr.value];
                          setFilters({ ...filters, rarity: newRarities });
                        }}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all duration-200 ${
                          selected
                            ? "bg-blue-500 border-blue-600 text-white dark:bg-blue-600 dark:border-blue-700"
                            : "bg-white border-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                        }`}
                      >
                        <img
                          src={attr.image}
                          alt={attr.value}
                          className="w-8 h-8 mb-1 filter dark:brightness-110"
                        />
                        <span className="text-xs">{attr.value}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="w-full md:w-auto">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Loại nhân vật
                </label>
                <div className="flex flex-wrap gap-2">
                  {characterTypes.map((type) => {
                    const selected = filters.characterType.includes(type);
                    const icon = characterTypeIcons[type];

                    return (
                      <button
                        key={type}
                        onClick={() => {
                          const newCharacterTypes = selected
                            ? filters.characterType.filter((t) => t !== type)
                            : [...filters.characterType, type];
                          setFilters({
                            ...filters,
                            characterType: newCharacterTypes,
                          });
                        }}
                        className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                          selected
                            ? "bg-blue-500 border-blue-600 text-white dark:bg-blue-600 dark:border-blue-700"
                            : "bg-white border-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                        }`}
                      >
                        {icon && (
                          <div className="flex justify-center items-center w-full">
                            <FontAwesomeIcon
                              icon={icon}
                              className="w-6 h-6 mb-1"
                            />
                          </div>
                        )}
                        <span className="text-xs text-center w-full">
                          {type}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 w-full">
              {/* Weapon Type Filter */}
              <div className="w-full md:w-auto">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Tầm đánh
                </label>
                <div className="flex flex-wrap gap-2">
                  {weaponTypes.map((attr) => {
                    const selected = filters.weaponType.includes(attr.value);
                    return (
                      <button
                        key={attr.value}
                        onClick={() => {
                          const newWeaponTypes = selected
                            ? filters.weaponType.filter((a) => a !== attr.value)
                            : [...filters.weaponType, attr.value];
                          setFilters({
                            ...filters,
                            weaponType: newWeaponTypes,
                          });
                        }}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all duration-200 ${
                          selected
                            ? "bg-blue-500 border-blue-600 text-white dark:bg-blue-600 dark:border-blue-700"
                            : "bg-white border-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                        }`}
                      >
                        <img
                          src={attr.image}
                          alt={attr.value}
                          className="w-8 h-8 mb-1 filter dark:brightness-110"
                        />
                        <span className="text-xs">{attr.value}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Attribute Filter */}
              <div className="w-full md:w-auto">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Hệ nguyên tố
                </label>
                <div className="flex flex-wrap gap-2">
                  {attributes.map((attr) => {
                    const selected = filters.attribute.includes(attr.value);
                    return (
                      <button
                        key={attr.value}
                        onClick={() => {
                          const newAttributes = selected
                            ? filters.attribute.filter((a) => a !== attr.value)
                            : [...filters.attribute, attr.value];
                          setFilters({ ...filters, attribute: newAttributes });
                        }}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all duration-200 ${
                          selected
                            ? "bg-blue-500 border-blue-600 text-white dark:bg-blue-600 dark:border-blue-700"
                            : "bg-white border-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                        }`}
                      >
                        <img
                          src={attr.image}
                          alt={attr.value}
                          className="w-8 h-8 mb-1 filter dark:brightness-110"
                        />
                        <span className="text-xs">{attr.value}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Reset Filters - Desktop */}
            {hasActiveFilters() && (
              <button
                onClick={clearAllFilters}
                className="hidden md:block px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
                Reset All Filters
              </button>
            )}
          </div>
        </div>

        {/* Character Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
          </div>
        ) : filteredCharacters.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow dark:bg-gray-800 transition-colors duration-200">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
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
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-200">
              Không tìm thấy nhân vật nào
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {hasActiveFilters()
                ? "Hãy thử tìm kiếm khác hoặc điều chỉnh bộ lọc"
                : "Không có nhân vật nào trong danh sách"}
            </p>
            {hasActiveFilters() && (
              <button
                onClick={clearAllFilters}
                className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCharacters.map((character) => (
              <Link
                key={character._id}
                to={`/characters/${character._id}`}
                className="group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition transform hover:scale-105 hover:shadow-lg duration-200 h-full flex flex-col">
                  {/* Character Image */}
                  <div className="relative">
                    <img
                      src={character.image}
                      alt={character.name}
                      className="w-full h-48 object-cover object-center"
                      loading="lazy"
                    />
                    {/* Rating Badge */}
                    {character.adminReview && (
                      <div
                        className={`absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-white font-bold rounded-full ${ratingColor(
                          character.adminReview
                        )}`}
                      >
                        {character.adminReview}
                      </div>
                    )}
                  </div>

                  {/* Character Info */}
                  <div className="p-4 flex-grow flex flex-col">
                    <div className="flex items-center mb-2">
                      {/* Rarity */}
                      <div className="flex mr-2">
                        {[...Array(character.rarity)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-4 h-4 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>

                      {/* Attribute */}
                      {character.attribute && (
                        <img
                          src={
                            attributes.find(
                              (attr) => attr.value === character.attribute
                            )?.image
                          }
                          alt={character.attribute}
                          className="w-5 h-5 mr-1"
                        />
                      )}

                      {/* Weapon Type */}
                      {character.weaponType && (
                        <img
                          src={
                            weaponTypes.find(
                              (w) => w.value === character.weaponType
                            )?.image
                          }
                          alt={character.weaponType}
                          className="w-5 h-5"
                        />
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                      {character.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 italic mb-2 line-clamp-1">
                      {character.title}
                    </p>

                    {/* Character Type */}
                    {character.characterType && (
                      <div className="mt-auto pt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <FontAwesomeIcon
                          icon={characterTypeIcons[character.characterType]}
                          className="mr-1"
                        />
                        {character.characterType}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
    </div>
  );
};

export default CharacterList;
