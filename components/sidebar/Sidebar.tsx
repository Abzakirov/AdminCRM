"use client";
import { sidebarMenu } from "@/util";
import React from "react";
import { Button } from "antd";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  console.log(pathname);
  return (
    <div className="w-[280px] h-screen p-4 border-r border-gray-200">
      <div className="flex justify-center items-center">
        <img
          className="w-[100px] h-[100px] object-contain"
          src="/logo.jpg"
          alt="Logo"
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold mt-4">Menu</h2>
        <div className="flex flex-col gap-2 mt-4">
          {sidebarMenu.map(({ Icons, id, title ,path}) => (
            <Button
              key={id}
              className={`!flex !items-center !gap-3 !justify-start !w-full !p-2 !border !border-transparent hover:!border-gray-300 ${pathname===path&&"border-accent"}`}
              type="text"
            >
              <Icons className="text-xl" />
              <span className="text-base">{title}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
