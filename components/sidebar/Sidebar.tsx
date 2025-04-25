"use client";
import { others_menu, sidebarMenu } from "@/util";
import React, { useState } from "react";
import { Button } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import Cookie from "js-cookie";
import { showSuccessToast } from "@/shared/toast/Toast";
import LogOutModal from "@/shared/mod/LogOutModal";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    Cookie.remove("token");
    Cookie.remove("user");
    showSuccessToast("Вы успешно вышли!");
    router.push("/login");
  };

  const renderMenuSection = (
    title: string,
    items: typeof sidebarMenu | typeof others_menu
  ) => (
    <div className="mt-5">
      <h2 className="text-lg font-semibold dark:text-white">{title}</h2>
      <div className="flex flex-col gap-3 mt-4">
        {items.map(({ Icons, id, title, path }) => {
          const isActive = pathname === path;

          return (
            <Button
              key={id}
              onClick={() => router.push(path)}
              className={`!flex !items-center !gap-3 !justify-start !w-full !p-2 !border transition-all duration-200
                ${
                  isActive
                    ? "!border-accent !bg-accent text-[black] dark:!text-white "
                    : "!border-transparent hover:!border-gray-300 dark:!text-white"
                }`}
              type="text"
            >
              <Icons size={24} />
              <span
                className={`${
                  isActive ? "font-semibold text-[19px]" : "text-[18px]"
                }`}
              >
                {title}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="w-[280px] h-screen p-4 border-r border-gray-200 dark:border-gray-700">
      <div className="flex justify-center items-center">
        <div className="dark:hidden flex items-center ">
          <h2 className="absolute left-4 font-black">ADMIN</h2>
          <img 
            className="w-[100px] h-[100px] object-contain relative"
            src="/logoLight.png"
            alt="Logo"
          />
          <h2 className="absolute right-[86.5%] font-bold">CRM</h2>
        </div>
        <div className="hidden dark:flex items-center ">
          <h2 className="absolute left-4 font-black">ADMIN</h2>
          <img
            className="w-[100px] h-[100px] object-contain relative"
            src="/LogoDark.png"
            alt="Logo"
          />
          <h2 className="absolute right-[86.5%] font-bold">CRM</h2>
        </div>
      </div>

      {renderMenuSection("Menu:", sidebarMenu)}
      {renderMenuSection("Others:", others_menu)}

      <div className="mt-4">
        <Button
          onClick={() => setIsModalOpen(true)}
          className="!flex !items-center !gap-3 !justify-start !w-full !p-2 !border-none !text-red-600 dark:!text-red-400"
          type="text"
        >
          <LogOut size={24} />
          <span className="text-[18px]">Log out</span>
        </Button>

        <LogOutModal
          open={isModalOpen}
          onConfirm={() => {
            setIsModalOpen(false);
            handleLogout();
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default Sidebar;
