import React from "react";
import RegisterForm from "../../components/features/register/index";

const RegisterPage = () => {
  return (
    <div className="flex min-h-screen">
      {/* Left column - Sign up form */}
      <div className="w-[45%] flex flex-col justify-center px-20 py-12 bg-white">
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-4xl text-center font-bold mb-10">Sign up</h1>

          <RegisterForm route="/api/user/register/" />

          <p className="mt-6 text-gray-600 text-sm text-center">
            Already have an account?{" "}
            <a href="/login" className="text-[#3881A2] hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>

      {/* Right column - Logo and illustration */}
      <div className="w-[55%] flex flex-col items-center justify-center bg-[#E9F9F9]">
        <div className="flex flex-col items-center w-full">
          <img
            src="/assets/Logo.png"
            alt="AI4LIFE Logo"
            className="h-15 w-auto mb-15 mt-6"
          />
          <img
            src="/assets/Group 102.png"
            alt="Group 102"
            className="w-4/5 md:w-3/4 lg:w-2/3 xl:w-[600px] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
