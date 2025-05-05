'use client';
import LoginForm from "@/shared/loginForm/LoginForm";
import { DarkMode } from "@/shared/mode";
import React from "react";

const LoginPage = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-[#f9f9f9] dark:bg-[#1f2937] relative">
      <div className="absolute top-4 right-8">
        <DarkMode />
      </div>
      <div
        className="w-full max-w-[500px] bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800"
        style={{
          boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)",
          transform: "translateY(-5px)",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
