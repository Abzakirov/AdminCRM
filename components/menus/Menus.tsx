"use client";
import LogOutModal from "@/shared/mod/LogOutModal";
import { MenuData } from "@/util";
import { Button } from "antd";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import Cookie from "js-cookie";
import { showSuccessToast } from "@/shared/toast/Toast";
import { LogOut } from "lucide-react";

const Menus = () => {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    Cookie.remove("token");
    Cookie.remove("user");
    showSuccessToast("Logout successful!");
    router.push("/login");
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="grid grid-cols-2 gap-4 max-w-2xl w-full mx-auto p-4">
        {MenuData.map(({ Icons, id, title, path }) => {
          const isActive = pathname === path;

          return (
            <Button
              key={id}
              onClick={() => router.push(path)}
              className={`!flex !items-center !gap-3 !justify-center !p-4 !border transition-all duration-200 !rounded-lg !h-full
                ${
                  isActive
                    ? "!border-accent !bg-[#F2F3F4] dark:!bg-[#374151] text-[black] dark:!text-white"
                    : "!bg-[#1f2937] hover:!bg-[#374151] dark:!text-white"
                }`}
              type="text"
            >
              <div className="flex flex-col items-center gap-2">
                <Icons size={24} />
                <span
                  className={`${
                    isActive ? "font-semibold text-[19px]" : "text-[18px]"
                  }`}
                >
                  {title}
                </span>
              </div>
            </Button>
          );
        })}

        {/* Log out styled same as other buttons */}
        <Button
          onClick={() => setIsModalOpen(true)}
          className="!flex !items-center !justify-center !p-4 !rounded-lg !h-full !bg-red-600 !text-white hover:!bg-red-700 transition-all duration-200"
          type="text"
        >
          <div className="flex flex-col items-center gap-2">
            <LogOut size={24} />
            <span className="text-[18px]">Log out</span>
          </div>
        </Button>
      </div>

      <LogOutModal
        open={isModalOpen}
        onConfirm={() => {
          setIsModalOpen(false);
          handleLogout();
        }}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Menus;
