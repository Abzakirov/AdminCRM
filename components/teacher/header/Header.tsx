'use client'

import OpenDrawerTeacherButton from "@/components/openDrawerButton/OpenDrawerTeacherButton";
import AddTeacherDrawer from "@/shared/addTeacherDrawe/AddTeahcerDrawer";
import { Input } from "antd";
import { useState } from "react";

const TeacherHeader: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);

  const showDrawer = (): void => {
    setDrawerVisible(true);
  };

  const closeDrawer = (): void => {
    setDrawerVisible(false);
  };

  return (
    <div className="flex items-center justify-between p-3">
      <div>
        <h2 className="text-[18px] font-medium">O'qituvchilar ro'yxati:</h2>
      </div>
      <div className="flex items-center gap-3">
        <Input type="text" placeholder="Search Administrative authorities" className="!w-[270px]" />
        <OpenDrawerTeacherButton showDrawer={showDrawer} />
        <AddTeacherDrawer visible={drawerVisible} onClose={closeDrawer} />
      </div>
    </div>
  );
};

export default TeacherHeader;
