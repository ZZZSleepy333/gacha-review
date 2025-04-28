import React from "react";

const BannerList = ({ banners, onEdit, onDelete, onAddNew }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Danh sách Banners ({banners.length})
        </h2>
        <button
          onClick={onAddNew}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Thêm Banner mới
        </button>
      </div>

      {banners.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            Chưa có banner nào. Hãy tạo banner mới!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {banners.map((banner) => (
            <div
              key={banner._id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative h-40">
                <img
                  src={banner.image}
                  alt={banner.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder-banner.jpg";
                  }}
                />
              </div>
              <div className="p-4">
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                  {banner.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {banner.characters?.length || 0} nhân vật
                </p>
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    onClick={() => onEdit(banner)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => onDelete(banner._id)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerList;
