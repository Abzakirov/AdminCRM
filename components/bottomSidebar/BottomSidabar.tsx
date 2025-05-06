import { usePathname, useRouter } from "next/navigation";
import React from "react";
import Cookie from "js-cookie";
import { showSuccessToast } from "@/shared/toast/Toast";
import { ButtomsidebarMenu } from "@/util";
import { Button } from "antd";
import { Menu } from "lucide-react";

const BottomSidabar = () => {
  const pathname = usePathname();
  const router = useRouter();


  return (
    <div className="mt-5">
      <div className="flex gap-2 mt-4 w-full">
        {ButtomsidebarMenu.map(({ Icons, id, path }) => {
          const isActive = pathname === path;

          return (
         <div className="w-full"
         key={id}>
             <Button
              key={id}
              onClick={() => router.push(path)}
              className={`!flex !items-center !gap-3 !justify-start  !p-2 !border transition-all duration-200 w-[40px] h-[40px]
                ${
                  isActive
                    ? "!border-accent !bg-[#F2F3F4] dark:!bg-[#374151] text-[black]  dark:!text-white"
                    : "!border-transparent hover:!border-gray-300 dark:!text-white"
                }`}
              type="text"
            >
              <Icons size={24} />
            </Button>
         </div>
          );
        })}
        <button onClick={()=>router.push("/menu")}>
          <Menu />
        </button>
      </div>
    </div>
  );
};

export default BottomSidabar;
