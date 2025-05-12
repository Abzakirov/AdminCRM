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
  params: { groups_info_id: string };
}) {
  const groupId = params.groups_info_id;
  const groupData = await getGroupData(groupId);

  return <GroupInfoComponent id={groupId} initialData={groupData} />;
}
