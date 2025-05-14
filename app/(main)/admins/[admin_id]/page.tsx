import { axiosInstance } from '@/hooks/useAxios/useAxios';
import InfoAdmin from '@/components/InfoAdmin/InfoAdmin';

async function getAdminData(id: string) {
  try {
    const response = await axiosInstance.get(`/staff/info/${id}`);
    return response.data?.data || null;
  } catch (error) {
    console.error('Error fetching admin data:', error);
    return null;
  }
}


export default async function InfoAdminPage({ 
  params,
}: {
  params: Promise<{ admin_id: string }>;
}) {

  const { admin_id } = await params;

  const adminData = await getAdminData(admin_id);
  


  return <InfoAdmin id={admin_id} initialData={adminData} />;
}