"use client";

import BrandCrams from "@/shared/brandCramp";
import { Bell, Megaphone, MessageCircleMore, Sidebar as SidebarIcon } from "lucide-react";
import ProfilesServer from "../profileServer/ProfileServer";
import { DarkMode } from "@/shared/mode";

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  return (
    <div className="flex items-center justify-between p-3 border-b w-full min-h-[60px] max-[600px]:w-full">
      <div className="flex items-center gap-2">
        <button onClick={onToggleSidebar}>
          <SidebarIcon size={19} />
        </button>
        <BrandCrams />
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 max-[380px]:hidden">
        <Bell size={23} className="cursor-pointer" />
          <MessageCircleMore size={23} className="cursor-pointer" />
          <Megaphone size={23} className="cursor-pointer" />
        </div>
          <DarkMode />
        </div>
        <ProfilesServer />
      </div>
    </div>
  );
};

export default Header;
