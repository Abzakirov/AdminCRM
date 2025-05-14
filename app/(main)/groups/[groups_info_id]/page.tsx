import { axiosInstance } from '@/hooks/useAxios/useAxios';
import GroupInfoComponent from '@/components/GroupInfo/GroupInfoComponent';

async function getGroupData(id: string) {
  try {
    const response = await axiosInstance.get(`/group/one-group/${id}`);
    return response.data?.data || null;
  } catch (error) {
    console.error("Error fetching group data:", error);
    return null;
  }
}

export default async function GroupInfoPage({
  params,
}: {
  params: Promise<{ groups_info_id: string }>;
}) {
  const { groups_info_id } = await params;
  const groupData = await getGroupData(groups_info_id);

  return <GroupInfoComponent id={groups_info_id} initialData={groupData} />;
}
