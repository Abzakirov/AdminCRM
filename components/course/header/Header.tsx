'use client';

import OpenCourseDrawer from "@/components/openDrawerButton/OpenCourseButton";
import CreateCourse from "@/shared/createCourse/CreateCourse";
import { useState } from "react";

const CourseHeader: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);

  const showDrawer = (): void => {
    setDrawerVisible(true);
  };

  const closeDrawer = (): void => {
    setDrawerVisible(false);
  };

  return (
    <div className="flex items-center justify-between p-3 mt-3">
      <div>
        <h2 className="text-[18px] font-medium">Kurslar royhati</h2>
      </div>
      <div className="flex items-center gap-3">
        <OpenCourseDrawer showDrawer={showDrawer} />
        <CreateCourse visible={drawerVisible} onClose={closeDrawer} />
      </div>
    </div>
  );
};

export default CourseHeader;
