import StudentLightTable from "@/shared/table/StudentLightTable";
import StudentHeader from "./header/Header";

const StudentComponent = () => {
  return (
    <div>
      <StudentHeader />
      <StudentLightTable />
    </div>
  );
};

export default StudentComponent;
