import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const CharacterList = () => {
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    rarity: "",
    attribute: "",
    weaponType: "",
    characterType: "",
    adminReview: "",
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
    // Search filter
    const matchesSearch =
      character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      character.title.toLowerCase().includes(searchTerm.toLowerCase());

    // Additional filters
    const matchesRarity = filters.rarity
      ? character.rarity === parseInt(filters.rarity)
      : true;
    const matchesAttribute = filters.attribute
      ? character.attribute === filters.attribute
      : true;
    const matchesWeaponType = filters.weaponType
      ? character.weaponType === filters.weaponType
      : true;
    const matchesCharacterType = filters.characterType
      ? character.characterType === filters.characterType
      : true;
    const matchesAdminReview = filters.adminReview
      ? character.adminReview === filters.adminReview
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
  const attributes = [...new Set(characters.map((c) => c.attribute))].filter(
    Boolean
  );
  const weaponTypes = [...new Set(characters.map((c) => c.weaponType))].filter(
    Boolean
  );
  const characterTypes = [
    ...new Set(characters.map((c) => c.characterType)),
  ].filter(Boolean);

  const adminReviews = [
    ...new Set(characters.map((c) => c.adminReview)),
  ].filter(Boolean);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      {/* <div className="bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Review nhân vật Housamo
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-blue-100">
            Làm bởi Tokyo Afterschool Summoners VN
          </p>
        </div>
      </div> */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Filter/Search Bar */}
        <div className="bg-white shadow rounded-lg p-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tìm kiếm nhân vật
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
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
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search by name or title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Rarity Filter */}
            <div>
              <label
                htmlFor="rarity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Độ hiếm
              </label>
              <select
                id="rarity"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                value={filters.rarity}
                onChange={(e) =>
                  setFilters({ ...filters, rarity: e.target.value })
                }
              >
                <option value="">All Rarities</option>
                <option value="1">1 ★</option>
                <option value="2">2 ★</option>
                <option value="3">3 ★</option>
                <option value="4">4 ★</option>
                <option value="5">5 ★</option>
              </select>
            </div>

            {/* Attribute Filter */}
            <div>
              <label
                htmlFor="attribute"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Hệ nguyên tố
              </label>
              <select
                id="attribute"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                value={filters.attribute}
                onChange={(e) =>
                  setFilters({ ...filters, attribute: e.target.value })
                }
              >
                <option value="">All Elements</option>
                {attributes.map((attr) => (
                  <option key={attr} value={attr}>
                    {attr}
                  </option>
                ))}
              </select>
            </div>

            {/* Weapon Type Filter */}
            <div>
              <label
                htmlFor="weaponType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tầm đánh
              </label>
              <select
                id="weaponType"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                value={filters.weaponType}
                onChange={(e) =>
                  setFilters({ ...filters, weaponType: e.target.value })
                }
              >
                <option value="">All Weapons</option>
                {weaponTypes.map((weapon) => (
                  <option key={weapon} value={weapon}>
                    {weapon}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="weaponType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Loại nhân vật
              </label>
              <select
                id="characterType"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                value={filters.characterType}
                onChange={(e) =>
                  setFilters({ ...filters, characterType: e.target.value })
                }
              >
                <option value="">All Types</option>
                {characterTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="adminReview"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tier
              </label>
              <select
                id="adminReview"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                value={filters.adminReview}
                onChange={(e) =>
                  setFilters({ ...filters, adminReview: e.target.value })
                }
              >
                <option value="">All Elements</option>
                {adminReviews.map((tier) => (
                  <option key={tier} value={tier}>
                    {tier}
                  </option>
                ))}
              </select>
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
                    rarity: "",
                    attribute: "",
                    weaponType: "",
                    characterType: "",
                    adminReview: "",
                  })
                }
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
          <div className="text-center py-16 bg-white rounded-lg shadow">
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
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              Không tìm thấy nhân vật nào
            </h3>
            <p className="mt-1 text-sm text-gray-500">
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
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
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
                      <div className="flex space-x-1">
                        {[...Array(character.rarity)].map((_, i) => (
                          <svg
                            key={i}
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {character.attribute}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {character.weaponType}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Character Info */}
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">
                          {character.name}
                        </h2>
                        <p className="text-sm text-gray-600">
                          {character.title}
                        </p>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <p className="text-xs text-gray-500">HP</p>
                        <p className="font-semibold">{character.maxHp}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <p className="text-xs text-gray-500">ATK</p>
                        <p className="font-semibold">{character.maxAttack}</p>
                      </div>
                    </div>

                    {/* Roles */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {character.roles.map((role, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"
                        >
                          {role}
                        </span>
                      ))}
                    </div>

                    {/* Review Summary */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-start">
                        <p className="text-xs text-gray-700 line-clamp-2">
                          {character.finalReview}
                        </p>
                      </div>
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
