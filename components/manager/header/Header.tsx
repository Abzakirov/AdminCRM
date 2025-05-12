'use client';

import OpenDrawerTeacherButton from "@/components/openDrawerButton/OpenDrawerTeacherButton";
import AddTeacherDrawer from "@/shared/addTeacherDrawe/AddTeahcerDrawer";
import { Input } from "antd";
import { useState } from "react";

const ManagerHeader: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);

  const showDrawer = (): void => {
    setDrawerVisible(true);
  };

  const closeDrawer = (): void => {
    setDrawerVisible(false);
  };

  return (
    <div className="flex items-center justify-between p-3 max-[600px]:gap-4 max-[600px]:flex-wrap max-[600px]:justify-center">
      <div>
        <h2 className="text-[18px] font-medium">O&#39;qituvchilar ro&#39;yxati:</h2>
      </div>
      <div className="flex items-center gap-3 max-[600px]flex-wrap max-[600px]:justify-center :">
        <Input
          type="text"
          placeholder="Search Administrative authorities"
          className="!w-[270px] max-[400px]:!w-full"
        />
        <OpenDrawerTeacherButton showDrawer={showDrawer} />
        <AddTeacherDrawer visible={drawerVisible} onClose={closeDrawer} />
      </div>
    </div>
  );
};

export default ManagerHeader;
