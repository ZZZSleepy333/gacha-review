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
    "S+": "bg-gradient-to-r from-purple-600 to-pink-600",
    S: "bg-gradient-to-r from-red-600 to-red-500",
    "A+": "bg-gradient-to-r from-orange-500 to-yellow-500",
    A: "bg-gradient-to-r from-yellow-500 to-yellow-400",
    B: "bg-gradient-to-r from-green-500 to-green-400",
    C: "bg-gradient-to-r from-blue-500 to-blue-400",
    D: "bg-gradient-to-r from-gray-500 to-gray-400",
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
    <div className="max-w-6xl mx-auto bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden">
      {/* Image Section - Full width with proper aspect ratio */}
      <div className="w-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 pt-6 pb-6">
        <div className="relative aspect-[16/9] w-full max-w-4xl mx-auto rounded-t-xl overflow-hidden shadow-lg">
          <img
            className="w-full h-full object-contain "
            src={character.image || "/placeholder-character.jpg"}
            alt={character.name}
          />
        </div>
      </div>

      {/* Character Info Section - Below image */}
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        {/* Header with name and rating */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4 border-b border-gray-200 dark:border-gray-600 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {character.name}
            </h1>
            <p className="mt-1 text-lg text-gray-600 dark:text-gray-400">
              {character.title}
            </p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-white text-lg font-semibold shadow-md ${
              ratingColor[character.adminReview]
            }`}
          >
            {character.adminReview}
          </span>
        </div>

        {/* Voice Actors & Illustrators - Simplified */}
        <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-600">
          <p className="text-gray-800 dark:text-gray-200 mb-1">
            <span className="font-medium">Seiyuu:</span> {character.voiceActors}
          </p>
          <p className="text-gray-800 dark:text-gray-200">
            <span className="font-medium">Họa sĩ minh họa:</span>{" "}
            {character.illustrators}
          </p>
        </div>

        {/* Rarity Stars */}
        <div className="flex items-center mb-6">
          <div className="flex">
            {[...Array(character.rarity)].map((_, i) => (
              <svg
                key={i}
                className="h-7 w-7 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="ml-4 text-lg font-bold text-gray-700 dark:text-gray-300">
            {character.characterType.toUpperCase()}
          </p>
        </div>

        {/* Basic Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-gray-50 dark:bg-gray-600 p-4 rounded-lg hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] border border-transparent hover:border-gray-200 dark:hover:border-gray-500">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-100">
              Hệ nguyên tố
            </h3>
            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-200">
              {character.attribute}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-600 p-4 rounded-lg hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] border border-transparent hover:border-gray-200 dark:hover:border-gray-500">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-100">
              Tầm đánh
            </h3>
            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-200">
              {character.weaponType}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-600 p-4 rounded-lg hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] border border-transparent hover:border-gray-200 dark:hover:border-gray-500">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-100">
              Học viện
            </h3>
            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-200">
              {character.school}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-600 p-4 rounded-lg hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] border border-transparent hover:border-gray-200 dark:hover:border-gray-500">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-100">
              Guild
            </h3>
            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-200">
              {Array.isArray(character.guild)
                ? character.guild.join(", ")
                : character.guild}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-600 p-4 rounded-lg hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] border border-transparent hover:border-gray-200 dark:hover:border-gray-500">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-100">
              Quan hệ
            </h3>
            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-200">
              {character.affiliation}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-700 dark:to-blue-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-blue-100 dark:border-blue-600">
            <h3 className="text-lg font-medium text-blue-500 dark:text-blue-100">
              HP
            </h3>
            <p className="mt-2 text-3xl font-bold text-blue-900 dark:text-blue-50">
              {character.maxHp}
            </p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-700 dark:to-red-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-red-100 dark:border-red-600">
            <h3 className="text-lg font-medium text-red-500 dark:text-red-100">
              ATK
            </h3>
            <p className="mt-2 text-3xl font-bold text-red-900 dark:text-red-50">
              {character.maxAttack}
            </p>
          </div>
        </div>

        {/* Roles */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 pb-2">
            Vai trò
          </h2>
          <div className="flex flex-wrap gap-3">
            {character.roles.map((role, i) => (
              <span
                key={i}
                className="inline-flex items-center px-4 py-2 rounded-full text-base font-medium bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 dark:from-purple-800 dark:to-indigo-900 dark:text-purple-100 shadow-sm hover:shadow-md transition-all duration-300 border border-purple-200 dark:border-purple-700"
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        {/* Charge Skill */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-300 mb-4 border-b border-gray-200 dark:border-gray-600 pb-2">
            Charge Skill
          </h2>
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-600 dark:to-gray-700 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-500">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
              {character.chargeSkill.chargeSkillName}
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-50">
              {character.chargeSkill.chargeSkillDescription}
            </p>
          </div>
        </div>

        {/* Review Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 col-span-1 md:col-span-2 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 pb-2">
            Đánh giá
          </h2>
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-800 dark:to-green-900 p-5 rounded-lg shadow-sm border border-green-200 dark:border-green-700">
            <h2 className="text-lg md:text-xl font-semibold text-green-800 dark:text-green-100 mb-3 md:mb-4 pb-2 border-b border-green-200 dark:border-green-700">
              Điểm nổi bật
            </h2>
            <ul className="space-y-3">
              {character.strongPoints.split("\n").map(
                (point, i) =>
                  point.trim() && (
                    <li key={i} className="flex items-start">
                      <svg
                        className="h-5 w-5 text-green-500 dark:text-green-200 mr-2 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-800 dark:text-green-50 text-sm md:text-base">
                        {point}
                      </span>
                    </li>
                  )
              )}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-lg shadow-sm border border-red-200 dark:from-red-800 dark:to-red-900 dark:border-red-700">
            <h2 className="text-lg md:text-xl font-semibold text-red-800 dark:text-red-100 mb-3 md:mb-4 pb-2 border-b border-red-200 dark:border-red-700">
              Điểm lưu ý
            </h2>
            <ul className="space-y-3">
              {character.weakPoints.split("\n").map(
                (point, i) =>
                  point.trim() && (
                    <li key={i} className="flex items-start">
                      <svg
                        className="h-5 w-5 text-red-500 dark:text-red-200 mr-2 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-800 dark:text-red-50 text-sm md:text-base">
                        {point}
                      </span>
                    </li>
                  )
              )}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-lg col-span-1 md:col-span-2 shadow-sm border border-gray-200 dark:from-gray-600 dark:to-gray-700 dark:border-gray-500">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 md:mb-4 pb-2 border-b border-gray-200 dark:border-gray-600">
              Đánh giá tổng quan
            </h2>
            <div
              className="prose prose-sm md:prose-md text-gray-800 dark:text-gray-50 w-full max-w-none"
              dangerouslySetInnerHTML={{ __html: character.finalReview }}
            ></div>
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Quay lại danh sách nhân vật
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CharacterDetail;
