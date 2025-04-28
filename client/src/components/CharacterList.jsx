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
        return "bg-gradient-to-r from-purple-600 to-pink-600";
      case "S":
        return "bg-red-600";
      case "A+":
        return "bg-orange-500";
      case "A":
        return "bg-yellow-500";
      case "B":
        return "bg-green-500";
      case "C":
        return "bg-blue-500";
      case "D":
        return "bg-gray-500";
      default:
        return "bg-gray-200";
    }
  };

  console.log(typeof attributes);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Filter/Search Bar */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-8 ">
          <div className="flex flex-col md:flex-col items-start  gap-4">
            {/* Search Input */}
            <div className="flex-1 flex flex-col md:flex-row gap-4">
              <div>
                <label
                  htmlFor="search"
                  className="block text-sm font-medium text-gray-700 dark:text-white mb-2"
                >
                  Tìm kiếm nhân vật
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400 dark:text-gray-100"
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
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300  dark:text-gray-100 dark:bg-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search by name or title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              {/* Tier Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
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
                        className={`flex items-center justify-center w-8 h-8 rounded-full border transition text-sm font-semibold ${
                          selected
                            ? "bg-blue-500 border-blue-600 text-white dark:bg-gray-700 dark:text-gray-300 dark:border-blue-600 "
                            : "bg-white border-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-300 hover:dark:bg-gray-300 hover:text-gray-100 hover:dark:text-gray-600"
                        }`}
                      >
                        {review}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Rarity Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
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
                        className={`flex flex-col items-center justify-center p-2 rounded-lg border transition ${
                          selected
                            ? "bg-blue-500 border-blue-600 text-white dark:bg-gray-700 dark:text-gray-300 dark:border-blue-600"
                            : "bg-white border-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-300 hover:dark:bg-gray-300 hover:text-gray-100 hover:dark:text-gray-600"
                        }`}
                      >
                        <img
                          src={attr.image}
                          alt={attr.value}
                          className="w-8 h-8 mb-1"
                        />
                        <span className="text-xs">{attr.value}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
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
                        className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg border transition text-sm ${
                          selected
                            ? "bg-blue-500 border-blue-600 text-white dark:bg-gray-700 dark:text-gray-300 dark:border-blue-600"
                            : "bg-white border-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-300 hover:dark:bg-gray-300 hover:text-gray-100 hover:dark:text-gray-600"
                        }`}
                      >
                        {icon && (
                          <div className="flex justify-center items-center w-full">
                            <FontAwesomeIcon
                              icon={icon}
                              className="w-8 h-8 mb-1"
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
            <div className="flex flex-col md:flex-row gap-4">
              {/* Weapon Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
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
                        className={`flex flex-col items-center justify-center p-2 rounded-lg border transition ${
                          selected
                            ? "bg-blue-500 border-blue-600 text-white dark:bg-gray-700 dark:text-gray-300 dark:border-blue-600"
                            : "bg-white border-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-300 hover:dark:bg-gray-300 hover:text-gray-100 hover:dark:text-gray-600"
                        }`}
                      >
                        <img
                          src={attr.image}
                          alt={attr.value}
                          className="w-8 h-8 mb-1"
                        />
                        <span className="text-xs">{attr.value}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Attribute Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
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
                        className={`flex flex-col items-center justify-center p-2 rounded-lg border transition ${
                          selected
                            ? "bg-blue-500 border-blue-600 text-white dark:bg-gray-700 dark:text-gray-300 dark:border-blue-600"
                            : "bg-white border-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-300 hover:dark:bg-gray-300 hover:text-gray-100 hover:dark:text-gray-600"
                        }`}
                      >
                        <img
                          src={attr.image}
                          alt={attr.value}
                          className="w-8 h-8 mb-1"
                        />
                        <span className="text-xs">{attr.value}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Reset Filters */}
            {(filters.rarity ||
              filters.attribute ||
              filters.weaponType ||
              filters.characterType ||
              filters.tier) && (
              <button
                onClick={() =>
                  setFilters({
                    rarity: [],
                    attribute: [],
                    weaponType: [],
                    characterType: [],
                    adminReview: [],
                  })
                }
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-50 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500  "
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Character Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredCharacters.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow dark:bg-gray-700">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
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
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-300">
              Không tìm thấy nhân vật nào
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
              {searchTerm ||
              filters.rarity ||
              filters.attribute ||
              filters.weaponType ||
              filters.characterType ||
              filters.adminReview
                ? "Hãy thử tìm kiếm khác"
                : "Không có nhân vật nào trong danh sách"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCharacters.map((character) => (
              <div
                key={character._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 dark:bg-gray-700 dark:text-gray-300"
              >
                <Link
                  key={character._id}
                  to={`/characters/${character._id}`}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Character Image with Rating Badge */}
                  <div className="relative">
                    <img
                      src={character.image || "/placeholder-character.jpg"}
                      alt={character.name}
                      className="w-full h-48 object-cover"
                      onError={(e) =>
                        (e.target.src = "/placeholder-character.jpg")
                      }
                    />
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${ratingColor(
                          character.adminReview
                        )}`}
                      >
                        {character.adminReview}
                      </span>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 px-2 rounded-xl flex justify-between items-center">
                      <div className="flex  rounded-xl bg-yellow-100 dark:bg-yellow-600 px-1">
                        {[...Array(character.rarity)].map((_, i) => (
                          <svg
                            key={i}
                            className="h-5 w-5 text-yellow-400 dark:text-yellow-50"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <div className="flex space-x-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-600 dark:text-blue-50">
                          {character.attribute}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-600 dark:text-blue-50">
                          {character.weaponType}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Character Info */}
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-300">
                          {character.name}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {character.title}
                        </p>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="bg-blue-50 dark:bg-blue-600 p-2 rounded-lg">
                        <p className="text-xs text-blue-900 dark:text-blue-100 font-bold">
                          HP
                        </p>
                        <p className="font-semibold text-blue-500 dark:text-blue-50">
                          {character.maxHp}
                        </p>
                      </div>
                      <div className="bg-red-50 dark:bg-red-600 p-2 rounded-lg ">
                        <p className="text-xs text-red-900 dark:text-red-100 font-bold">
                          ATK
                        </p>
                        <p className="font-semibold text-red-500 dark:text-red-50">
                          {character.maxAttack}
                        </p>
                      </div>
                    </div>

                    {/* Roles */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {character.roles.map((role, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-600 dark:text-purple-50"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
    </div>
  );
};

export default CharacterList;
