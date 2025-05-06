import TeacherInfoComponents from "@/components/teacherInfo/TeacherInfoComponents";
import { axiosInstance } from "@/hooks/useAxios/useAxios";

const TeacherInfo = async ({ params }: { params: { teacher_id: string } }) => {

  async function getTeacherData(id: string) {
    try {
      const response = await axiosInstance.get(`/teacher/get-teacher/${id}`);
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
  
        
  const TeacherData = await getTeacherData(params.teacher_id);

  return (
    <div>
      <TeacherInfoComponents id={params?.teacher_id} initialData={TeacherData} />
    </div>
  );
};

export default TeacherInfo;
