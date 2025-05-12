"use client";

import { AdminType, AdminUserType } from "@/@types";
import { axiosInstance } from "@/hooks/useAxios/useAxios";
import { useQuery } from "@tanstack/react-query";
import { Table, Tag, Avatar, Button, Dropdown, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
import { MoreOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import RightSidebar from "../right_sidebar/RightSidebar";
import {
  useDeleteAdminMutation,
  useReturnVacationMutation,
  useReturnWorkMutation,
} from "@/hooks/mutation";
import Cookies from "js-cookie";
import VacationModal from "../mod/VacationModal";
import { useRouter } from "next/navigation";

const AdminTableLight = () => {
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
  const [isReturnVacationModalOpen, setIsReturnVacationModalOpen] =
    useState(false);
  const [adminToDelete, setAdminToDelete] = useState<AdminUserType | null>(
    null
  );
  const [adminToReturnVacation, setAdminToReturnVacation] =
    useState<AdminUserType | null>(null);
  const [vacationAdminId, setVacationAdminId] = useState<string | null>(null);
  const [isReturnWorkModalOpen, setIsReturnWorkModalOpen] = useState(false);
  const [adminToReturnWork, setAdminToReturnWork] =
    useState<AdminUserType | null>(null);

  const [userRole, setUserRole] = useState<string | null>(null);

  const { mutate: deleteAdmin, isPending: isDeleting } =
    useDeleteAdminMutation();
  const { mutate: returnVacation, isPending: isReturningVacation } =
    useReturnVacationMutation();
  const { mutate: returnWork } = useReturnWorkMutation();
  const router = useRouter();

  useEffect(() => {
    if (data) setAdmins(data.reverse());

    const user = Cookies.get("user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        setUserRole(parsed.role);
      } catch (error) {
        console.error(
          "Foydalanuvchi cookie'sini tahlil qilishda xatolik:",
          error
        );
      }
    }
  }, [data]);

  const handleMenuClick = (record: AdminUserType, action: string) => {
    switch (action) {
      case "edit":
        setSelectedUser(record);
        break;
      case "delete":
        setAdminToDelete(record);
        setIsDeleteModalOpen(true);
        break;
      case "vacation":
        setVacationAdminId(record._id);
        break;
      case "return-vacation":
        setAdminToReturnVacation(record);
        setIsReturnVacationModalOpen(true);
        break;
      case "return-work-staff":
        setAdminToReturnWork(record);
        setIsReturnWorkModalOpen(true);
        break;

      default:
        break;
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
  const handleReturnWorkConfirm = () => {
    if (!adminToReturnWork) return;

    returnWork(adminToReturnWork._id, {
      onSuccess: () => {
        setIsReturnWorkModalOpen(false);
        setAdminToReturnWork(null);
        refetch();
      },
    });
  };

  const handleReturnWorkCancel = () => {
    setIsReturnWorkModalOpen(false);
    setAdminToReturnWork(null);
  };

  const handleReturnVacationConfirm = () => {
    if (!adminToReturnVacation) return;

    returnVacation(adminToReturnVacation._id, {
      onSuccess: () => {
        setIsReturnVacationModalOpen(false);
        setAdminToReturnVacation(null);
        refetch();
      },
    });
  };

  const handleReturnVacationCancel = () => {
    setIsReturnVacationModalOpen(false);
    setAdminToReturnVacation(null);
  };

  const columns: ColumnsType<AdminType> = [
    {
      title: "Avatar",
      dataIndex: "image",
      key: "image",
      render: (image: string, record) =>
        image ? (
          <Avatar src={image} />
        ) : (
          <Avatar>{record.first_name.charAt(0)}</Avatar>
        ),
    },
    {
      title: "Ism",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "Familiya",
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
      title: "Is active?",
      dataIndex: "active",
      key: "active",
      render: (active: boolean) => (
        <Tag color={active ? "green" : "red"}>{active ? "Ha" : "Yo'q"}</Tag>
      ),
    },
    ...(userRole === "manager"
      ? [
          {
            title: "Amallar",
            key: "actions",
            render: (_: any, record: AdminType) => {
              const items = [
                { label: "Tahrirlash", key: "edit" },
                { label: "O'chirish", key: "delete", danger: true },
                { label: "Ta'tilga chiqarish", key: "vacation" },
                { label: "Ta'tildan qaytarish", key: "return-vacation" },
                { label: "Ishga qaytarish", key: "return-work-staff" },
              ];
              return (
                <Dropdown
                  menu={{
                    items,
                    onClick: ({ key }) => handleMenuClick(record, key),
                  }}
                  trigger={["click"]}
                >
                  <Button type="text" icon={<MoreOutlined rotate={90} />} />
                </Dropdown>
              );
            },
          },
        ]
      : []),
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
          scroll={{ x: "max-content" }}
          onRow={(record) => {
            return {
              onClick: () => router.push(`/admins/${record._id}`),
              style: { cursor: "pointer" },
            };
          }}
        />
      </div>

      <RightSidebar user={selectedUser} onClose={() => setSelectedUser(null)} />

      <Modal
        title="O'chirishni tasdiqlang"
        open={isDeleteModalOpen}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okText="Ha"
        cancelText="Yo'q"
        okButtonProps={{ danger: true, loading: isDeleting }}
      >
        {adminToDelete && (
          <p>
            Siz rostdan ham
            <strong>
              {adminToDelete.first_name} {adminToDelete.last_name || ""}
            </strong>{" "}
            ni o'chirishni xohlaysizmi?
          </p>
        )}
      </Modal>

      <Modal
        title="Ta'tildan qaytarishni tasdiqlang"
        open={isReturnVacationModalOpen}
        onOk={handleReturnVacationConfirm}
        onCancel={handleReturnVacationCancel}
        okText="Ha"
        cancelText="Yo'q"
        okButtonProps={{ loading: isReturningVacation }}
      >
        {adminToReturnVacation && (
          <p>
            Siz rostdan ham{" "}
            <strong>
              {adminToReturnVacation.first_name}{" "}
              {adminToReturnVacation.last_name || ""}
            </strong>
            ni ta'tildan qaytarishni xohlaysizmi?
          </p>
        )}
      </Modal>
      <Modal
        title="Ishga qaytarishni tasdiqlang"
        open={isReturnWorkModalOpen}
        onOk={handleReturnWorkConfirm}
        onCancel={handleReturnWorkCancel}
        okText="Ha"
        cancelText="Yo'q"
      >
        {adminToReturnWork && (
          <p className="flex items-center gap-2">
            Siz rostdan ham{" "}
            <strong>
              {adminToReturnWork.first_name} {adminToReturnWork.last_name || ""}
            </strong>
            <p> ni ishga qaytishini xohlaysizmi?</p>
          </p>
        )}
      </Modal>

      <VacationModal
        open={!!vacationAdminId}
        onClose={() => setVacationAdminId(null)}
        adminId={vacationAdminId}
      />
    </>
  );
};

export default AdminTableLight;
