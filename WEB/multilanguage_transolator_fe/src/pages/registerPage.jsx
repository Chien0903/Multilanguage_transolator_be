import React, { useState, useEffect } from "react";
import RegisterForm from "../components/Form/RegisterForm";

const images = [
  "https://www.toray.com/global/images/index_kv_06.webp",
  "https://www.toray.com/global/images/index_kv_08.webp",
  "https://www.toray.com/global/images/index_kv_04.webp",
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
    <div className="relative flex flex-col items-center justify-center h-screen overflow-hidden bg-blue-100">
      {/* Background Slideshow */}
      <div className="absolute inset-0 w-full h-full">
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
      <div className="absolute top-0 left-0 right-0 w-full flex items-center justify-between bg-white shadow-md py-4 px-8 z-20">
        <img
          src="https://www.toray.com/global/shared/images/toray_logo.svg"
          alt="Toray Logo"
          className="w-32"
        />
      </div>

      {/* Signup Card */}
      <div className="relative z-30 bg-white rounded-2xl shadow-lg p-8 w-96 text-center mt-20">
        <h1 className="text-2xl font-semibold mb-4">Sign up</h1>
        <RegisterForm route="/api/user/register/" />
        <p className="mt-4 text-gray-600 text-sm">
          Already have an account?
          <a href="/login" className="text-blue-600 hover:underline ml-1">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
