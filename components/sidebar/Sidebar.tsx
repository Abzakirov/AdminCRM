"use client";

import { others_menu, sidebarMenu } from "@/util";
import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import Cookie from "js-cookie";
import { showSuccessToast } from "@/shared/toast/Toast";
import LogOutModal from "@/shared/mod/LogOutModal";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<string>("");

  const [filteredSidebarMenu, setFilteredSidebarMenu] = useState(sidebarMenu);
  const [filteredOthersMenu, setFilteredOthersMenu] = useState(others_menu);

  useEffect(() => {
    const userCookie = Cookie.get("user");
    if (userCookie) {
      try {
        const user = JSON.parse(userCookie);
        setUserRole(user.role || "");
      } catch (error) {
        console.error("Error parsing user cookie:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!userRole) return;

    const filterByRole = (menu: typeof sidebarMenu) =>
      menu.filter((item) => item.roles?.includes(userRole));

    setFilteredSidebarMenu(filterByRole(sidebarMenu));
    setFilteredOthersMenu(filterByRole(others_menu));
  }, [userRole]);

  const handleLogout = () => {
    Cookie.remove("token");
    Cookie.remove("user");
    showSuccessToast("Logout successful!");
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
              {isOpen && (
                <span
                  className={`${
                    isActive ? "font-semibold text-[19px]" : "text-[18px]"
                  }`}
                >
                  {title}
                </span>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div
      className={`${
        isOpen ? "w-[280px]" : "w-[80px]"
      } h-screen p-4 border-r border-gray-200 dark:border-gray-700 transition-all
    sticky top-0 bg-white dark:bg-[#1f1f1f] z-30`}
    >
      <div className="flex justify-center items-center">
        <div className="dark:hidden flex items-center">
          <img
            className="w-[100px] h-[100px] object-contain"
            src="/logoLight.png"
            alt="Logo"
          />
        </div>
        <div className="hidden dark:flex items-center">
          <img
            className="w-[100px] h-[100px] object-contain"
            src="/LogoDark.png"
            alt="Logo"
          />
        </div>
      </div>

      {renderMenuSection("Menu:", filteredSidebarMenu)}
      {renderMenuSection("Others:", filteredOthersMenu)}

      <div className="mt-4">
        <Button
          onClick={() => setIsModalOpen(true)}
          className="!flex !items-center !gap-3 !justify-start !w-full !p-2 !border-none !text-red-600 dark:!text-red-400"
          type="text"
        >
          <LogOut size={24} />
          {isOpen && <span className="text-[18px]">Log out</span>}
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
