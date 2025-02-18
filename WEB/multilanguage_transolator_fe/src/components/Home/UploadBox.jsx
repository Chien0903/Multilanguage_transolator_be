import React from "react";

const UploadBox = () => {
  return (
    <div className="w-full bg-white rounded-lg flex flex-col items-center text-center border border-gray-300 p-8 md:p-16 shadow-md h-auto">
      <div className="text-gray-400 text-7xl md:text-9xl">☁️</div>
      <p className="text-blue-600 font-semibold text-lg md:text-xl mt-2">Drag and drop</p>
      <p className="text-gray-500 text-sm md:text-md mb-4">Or</p>
      <button className="bg-gray-300 px-6 py-3 md:px-8 md:py-4 rounded font-bold text-lg md:text-xl">
        Browse
      </button>
    </div>
  );
};

export default UploadBox;