'use client';

import OpenStudentDrawer from "@/components/openDrawerButton/OpenStudentButton";
import CreateStudent from "@/shared/createStudent/CreateStudent";
import { Input } from "antd";
import { useState } from "react";

const StudentHeader: React.FC = () => {
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
        <h2 className="text-[18px] font-medium">O&apos;quvchilar royhati</h2>
      </div>
      <div className="flex items-center gap-3">
        <Input
          type="text"
          placeholder="Search Administrative authorities"
          className="!w-[270px]"
        />
        <OpenStudentDrawer showDrawer={showDrawer} />
        <CreateStudent visible={drawerVisible} onClose={closeDrawer} />
      </div>
    </div>
  );
};

export default StudentHeader;
