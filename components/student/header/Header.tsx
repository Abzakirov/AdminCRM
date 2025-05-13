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
    <div className="flex items-center justify-between p-3 max-[500px]:flex-wrap max-[500px]:gap-3 max-[500px]:justify-center">
      <div>
        <h2 className="text-[18px] font-medium">O&apos;quvchilar royhati</h2>
      </div>
      <div className="flex items-center gap-3 max-[500px]:flex-wrap max-[600px]:gap-3">
        <Input
          type="text"
          placeholder="Search Administrative authorities"
          className="!w-[270px] !max-[500px]:w-full"
        />
        <OpenStudentDrawer showDrawer={showDrawer} />
        <CreateStudent visible={drawerVisible} onClose={closeDrawer} />
      </div>
    </div>
  );
};

export default StudentHeader;
