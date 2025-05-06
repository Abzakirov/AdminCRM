import { axiosInstance } from '@/hooks/useAxios/useAxios';
import InfoAdmin from '@/components/InfoAdmin/InfoAdmin';

async function getAdminData(id: string) {
  try {
    const response = await axiosInstance.get(`/staff/info/${id}`);
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching admin data:", error);
    return null;
  }
}

export default async function InfoAdminPage({ params }: { params: { info_admin_id: string } }) {
  const adminData = await getAdminData(params.info_admin_id);
  
  return (
    <InfoAdmin id={params.info_admin_id} initialData={adminData} />
  );
}
