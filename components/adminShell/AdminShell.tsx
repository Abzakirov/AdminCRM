"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import Header from "@/components/header/Header";

const AdminShell = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <main className="flex">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="w-full">
        <Header onToggleSidebar={toggleSidebar} />
        <div className="w-full">{children}</div>
      </div>
    </main>
  );
};

export default AdminShell;
