import { axiosInstance } from "@/hooks/useAxios/useAxios";
import TeacherInfoComponents from "@/components/teacherInfo/TeacherInfoComponents";

async function getTeacherData(id: string) {
  try {
    const response = await axiosInstance.get(`/teacher/get-teacher/${id}`);
    return response.data?.data || null;
  } catch (error) {
    console.error("Ошибка при получении данных преподавателя:", error);
    return null;
  }
}

export default async function TeacherInfoPage({
  params,
}: {
  params: Promise<{ teacher_id: string }>;
}) {
  const { teacher_id } = await params;

  const teacherData = await getTeacherData(teacher_id);

  return <TeacherInfoComponents id={teacher_id} initialData={teacherData} />;
}
