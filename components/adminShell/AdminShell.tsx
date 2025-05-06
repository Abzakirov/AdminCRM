"use client";

import { useState } from "react";
import Sidebars from "@/components/sidebar/Sidebar";
import Header from "@/components/header/Header";
import BottomSidabar from "../bottomSidebar/BottomSidabar";

const AdminShell = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <main className="flex relative min-h-screen">
      <div className=" max-[700px]:hidden">
        <Sidebars isOpen={isSidebarOpen} />
      </div>

      <div className="flex flex-col w-full">
        <Header onToggleSidebar={toggleSidebar} />
        <div className="flex-grow">{children}</div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 max-[700px]:block hidden p-2  dark:bg-[#111827] w-[100%]">
        <BottomSidabar />
      </div>
    </main>
  );
};

export default AdminShell;
