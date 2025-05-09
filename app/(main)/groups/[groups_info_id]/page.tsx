import { axiosInstance } from '@/hooks/useAxios/useAxios';
import InfoAdmin from '@/components/InfoAdmin/InfoAdmin';

async function getAdminData(id: string) {
  try {
    const response = await axiosInstance.get(`/group/one-group/${id}`);
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching admin data:", error);
    return null;
  }
}

export default async function GroupInfoPage({ params }: { params: { group_id: string } }) {
  const adminData = await getAdminData(params.group_id);
  
  return (
    <InfoAdmin id={params?.group_id} initialData={adminData} />
  );
}
