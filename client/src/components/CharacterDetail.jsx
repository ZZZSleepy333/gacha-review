import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const CharacterDetail = () => {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/characters/${id}`
        );
        setCharacter(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch character");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacter();
  }, [id]);

  const ratingColor = {
    "S+": "from-purple-600 to-pink-600",
    S: "bg-red-600",
    "A+": "bg-orange-500",
    A: "bg-yellow-500",
    B: "bg-green-500",
    C: "bg-blue-500",
    D: "bg-gray-500",
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-red-500 mb-4">{error}</div>
        <Link to="/" className="text-blue-600 hover:underline">
          Quay về trang chủ
        </Link>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="text-center py-16">
        <p>Không tìm thấy nhân vật</p>
        <Link to="/" className="text-blue-600 hover:underline">
          Quay về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* Image Section - Top 50% width */}
      <div className="w-full">
        <div className="flex justify-center">
          <img
            className="w-1/2 object-cover"
            src={character.image || "/placeholder-character.jpg"}
            alt={character.name}
          />
        </div>
      </div>

      {/* Character Info Section - Below image */}
      <div className="p-8">
        {/* Header with name and rating */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="mt-1 text-lg text-gray-600">{character.title}</p>
            <h1 className="text-3xl font-bold text-gray-900">
              {character.name}
            </h1>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-white ${
              ratingColor[character.adminReview]
            }`}
          >
            {character.adminReview}
          </span>
        </div>

        {/* Rarity Stars */}
        <div className="flex mb-6">
          {[...Array(character.rarity)].map((_, i) => (
            <svg
              key={i}
              className="h-6 w-6 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <p className="ml-4 font-bold text-md">
            {character.characterType.toUpperCase()}
          </p>
        </div>

        {/* Basic Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Hệ nguyên tố</h3>
            <p className="mt-1 text-sm font-semibold text-gray-900">
              {character.attribute}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Tầm đánh</h3>
            <p className="mt-1 text-sm font-semibold text-gray-900">
              {character.weaponType}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Học viện</h3>
            <p className="mt-1 text-sm font-semibold text-gray-900">
              {character.school}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Guild</h3>
            <p className="mt-1 text-sm font-semibold text-gray-900">
              {character.guild}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Quan hệ</h3>
            <p className="mt-1 text-sm font-semibold text-gray-900">
              {character.affiliation}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-500">
              HP ở Max Level
            </h3>
            <p className="mt-1 text-2xl font-bold text-blue-900">
              {character.maxHp}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-red-500">
              ATK ở Max Level
            </h3>
            <p className="mt-1 text-2xl font-bold text-red-900">
              {character.maxAttack}
            </p>
          </div>
        </div>

        {/* Roles */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Vai trò</h2>
          <div className="flex flex-wrap gap-2">
            {character.roles.map((role, i) => (
              <span
                key={i}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        {/* Charge Skill */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Charge Skill
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800">
              {character.chargeSkill.chargeSkillName}
            </h3>
            <p className="mt-2 text-gray-600">
              {character.chargeSkill.chargeSkillDescription}
            </p>
          </div>
        </div>

        {/* Review Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 col-span-2">
            Đánh giá
          </h2>
          <div className="bg-green-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-green-800 mb-4">
              Điểm nổi bật
            </h2>
            <ul className="space-y-2">
              {character.strongPoints.split("\n").map(
                (point, i) =>
                  point.trim() && (
                    <li key={i} className="flex items-start">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  )
              )}
            </ul>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-red-800 mb-4">
              Điểm lưu ý
            </h2>
            <ul className="space-y-2">
              {character.weakPoints.split("\n").map(
                (point, i) =>
                  point.trim() && (
                    <li key={i} className="flex items-start">
                      <svg
                        className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  )
              )}
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Đánh giá tổng quan
            </h2>
            <div
              className="prose prose-md text-gray-800 w-full max-w-none"
              dangerouslySetInnerHTML={{ __html: character.finalReview }}
            ></div>
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Quay lại danh sách nhân vật
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CharacterDetail;
