"use client";

import { AdminType, AdminUserType } from "@/@types";
import { axiosInstance } from "@/hooks/useAxios/useAxios";
import { useQuery } from "@tanstack/react-query";
import { Table, Tag, Avatar, Button, Dropdown, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
import { MoreOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import RightSidebar from "../right_sidebar/RightSidebar";
import { useDeleteAdminMutation } from "@/hooks/mutation";

const AdminTable = () => {
  const { data, isLoading, refetch } = useQuery<AdminType[]>({
    queryKey: ["admins"],
    queryFn: async () => {
      const res = await axiosInstance.get("/staff/all-admins");
      return res.data.data;
    },
  });

  const [admins, setAdmins] = useState<AdminType[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUserType | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<AdminUserType | null>(null);

  const { mutate: deleteAdmin, isPending: isDeleting } = useDeleteAdminMutation();

  useEffect(() => {
    if (data) {
      setAdmins(data);
    }
  }, [data]);

  const handleMenuClick = (record: AdminUserType, action: string) => {
    if (action === "edit") {
      setSelectedUser(record);
    } else if (action === "delete") {
      setAdminToDelete(record);
      setIsDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = () => {
    if (!adminToDelete) return;
    
    deleteAdmin(adminToDelete._id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setAdminToDelete(null);
        refetch();
      },
    });
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setAdminToDelete(null);
  };

  const columns: ColumnsType<AdminType> = [
    {
      title: "Avatar",
      dataIndex: "image",
      key: "image",
      render: (image: string, record: AdminType) =>
        image ? (
          <Avatar src={image} />
        ) : (
          <Avatar>{record.first_name.charAt(0)}</Avatar>
        ),
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <Tag color="blue" className="capitalize">
          {role}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={
            status === "faol"
              ? "green"
              : status === "TA'TILDA"
              ? "yellow"
              : "red"
          }
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Is Active?",
      dataIndex: "active",
      key: "active",
      render: (active: boolean) => (
        <Tag color={active ? "green" : "red"}>{active ? "True" : "False"}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: AdminType) => {
        const items = [
          {
            label: "Edit",
            key: "edit",
          },
          {
            label: "Delete",
            key: "delete",
            danger: true,
          },
        ];

        return (
          <Dropdown
            menu={{
              items,
              onClick: ({ key }) => handleMenuClick(record, key),
            }}
            trigger={["click"]}
          >
            <Button
              type="text"
              icon={<MoreOutlined rotate={90} />}
            />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <>
      <div className="w-full">
        <Table
          columns={columns}
          dataSource={admins}
          loading={isLoading}
          rowKey={(record) => record._id}
          className="px-2"
        />
      </div>
      
      <RightSidebar user={selectedUser} onClose={() => setSelectedUser(null)} />
      
      <Modal
        title="Confirm Deletion"
        open={isDeleteModalOpen}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okText="Yes"
        cancelText="No"
        okButtonProps={{ danger: true, loading: isDeleting }}
      >
        {adminToDelete && (
          <p>Are you sure you want to delete {adminToDelete.first_name} {adminToDelete.last_name}?</p>
        )}
      </Modal>
    </>
  );
};

export default AdminTable;