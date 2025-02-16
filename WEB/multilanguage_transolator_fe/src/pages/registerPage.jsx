import React, { useState, useEffect } from "react";
import RegisterForm from "../components/RegisterForm";

const API_URL = import.meta.env.VITE_API_URL; 

console.log(API_URL);
const images = [
  "https://www.toray.com/global/images/index_kv_06.webp",
  "https://www.toray.com/global/images/index_kv_08.webp",
  "https://www.toray.com/global/images/index_kv_04.webp",
  "https://www.toray.com/global/images/index_kv_01.webp",
  "https://www.toray.com/global/images/index_kv_05.webp",
  "https://www.toray.com/global/images/index_kv_02.webp",
];
const RegisterPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 relative">
      {/* Background Slideshow */}
      <div className="absolute inset-0 w-full h-[120vh]">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${image})` }}
          ></div>
        ))}
      </div>

      {/* Header Section */}
      <div className="w-full flex items-center justify-between bg-white py-0 px-8 shadow-md mb-6 absolute top-0 left-0 right-0">
        <div className="flex items-center">
          <img
            src="https://www.toray.com/global/shared/images/toray_logo.svg"
            alt="Logo"
            className="w-30 h-30 mr-3"
          />
        </div>
      </div>

      {/* Signup Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 w-96 text-center mt-40 relative z-10">
        <h1 className="text-2xl font-semibold mb-4">Sign up</h1>
        <RegisterForm route={`${API_URL}api/user/register/`} method="register" />
        <p className="mt-4 text-gray-600 text-sm">
          Already have an account?
          <a href="/login" className="text-blue-600 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );

};

export default RegisterPage;
