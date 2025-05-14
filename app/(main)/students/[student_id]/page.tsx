import { axiosInstance } from "@/hooks/useAxios/useAxios";
import StudentInfoComponent from "@/components/studentInfo/StudentInfo";

async function getStudentData(id: string) {
  try {
    const response = await axiosInstance.get(`/student/student/${id}`);
    return response.data?.data || null;
  } catch (error) {
    console.error("Ошибка при получении данных студента:", error);
    return null;
  }
}

export default async function StudentInfoPage({
  params,
}: {
  params: Promise<{ student_id: string }>;
}) {
  const { student_id } = await params;

  const studentData = await getStudentData(student_id);

  return <StudentInfoComponent id={student_id} initialData={studentData} />;
}
