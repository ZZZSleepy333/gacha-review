import React from "react";

const BannerForm = ({
  banner,
  selectedCharacters,
  onSubmit,
  onCancel,
  onRateUpChange,
  isEditing,
}) => {
  const [formData, setFormData] = React.useState(banner);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-6">
      <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
        {isEditing ? "Chỉnh sửa Banner" : "Tạo Banner Mới"}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tên Banner
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Hình ảnh URL
            </label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white"
              required
            />
          </div>
        </div>

        {/* {selectedCharacters.length > 0 && (
          <div className="mb-4">
            <h4 className="text-md font-medium mb-2 text-gray-800 dark:text-white">
              Nhân vật đã chọn ({selectedCharacters.length})
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {selectedCharacters.map((char) => (
                <div
                  key={char._id}
                  className="border border-gray-200 dark:border-gray-700 rounded-md p-2 flex flex-col items-center"
                >
                  <img
                    src={char.image}
                    alt={char.name}
                    className="w-12 h-12 object-cover rounded-full mb-1"
                  />
                  <p className="text-xs font-medium text-center text-gray-800 dark:text-white">
                    {char.name}
                  </p>
                  <select
                    value={char.rateUpStatus}
                    onChange={(e) => onRateUpChange(char._id, e.target.value)}
                    className="mt-1 text-xs w-full p-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-800 dark:text-white"
                  >
                    <option value="normal">Thường</option>
                    <option value="rateup">Rate Up</option>
                    <option value="featured">Featured</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        )} */}

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isEditing ? "Cập nhật" : "Tạo mới"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BannerForm;
