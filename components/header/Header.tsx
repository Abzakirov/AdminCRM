import BrandCrams from "@/shared/brandCramp";
import { ModeToggle } from "@/shared/mode";
import { Bell, Megaphone, MessageCircleMore, Sidebar } from "lucide-react";
import Profeles from "../profil/Profiles";

const Header = () => {
  return (
    <div className="flex items-center justify-between p-3 border-b w-full min-h-[60px]">
      <div className="flex items-center gap-2">
        <Sidebar size={19} />
        <BrandCrams />
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <Bell size={23} className="cursor-pointer" />
          <MessageCircleMore size={23} className="cursor-pointer" />
          <Megaphone size={23} className="cursor-pointer" />
          <ModeToggle />
        </div>
        <Profeles />
      </div>
    </div>
  );
};

export default Header;
