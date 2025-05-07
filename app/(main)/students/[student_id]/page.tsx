import StudentInfoComponent from "@/components/studentInfo/StudentInfo";
import { axiosInstance } from "@/hooks/useAxios/useAxios";

const StudentInfo = async ({ params }: { params: { student_id: string } }) => {

    
  async function getStudentData(id: string) {
    try {
      const response = await axiosInstance.get(`/student/student//${id}`);
      if (response.data && response.data.data) {
        console.log("Данные от бэкенда:", response.data.data); 
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error("Ошибка при получении данных администратора:", error);
      return null;
    }
  }
  
        
  const StudentData = await getStudentData(params.student_id);

  return (
    <div>
      <StudentInfoComponent id={params?.student_id} initialData={StudentData} />
    </div>
  );
};

export default StudentInfo;
