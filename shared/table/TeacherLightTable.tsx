"use client";

import { TeacherType } from "@/@types";
import { axiosInstance } from "@/hooks/useAxios/useAxios";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  Tag,
  Avatar,
  Button,
  Dropdown,
  Modal,
  ConfigProvider,
  theme,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { MoreOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import {
  useDeleteTeahcerMutation,
  useReturnTeacherWorkMutation,
} from "@/hooks/mutation";
import Cookies from "js-cookie";
import "./ManagerTable.css";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

const TeachersTable = () => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  const { data, isLoading, refetch } = useQuery<TeacherType[]>({
    queryKey: ["teachers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/teacher/get-all-teachers");
      return res.data.data;
    },
  });

  const [teachers, setTeachers] = useState<TeacherType[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<TeacherType | null>(
    null
  );
  const [isReturnWorkModalOpen, setIsReturnWorkModalOpen] = useState(false);
  const [teacherToReturnWork, setTeacherToReturnWork] =
    useState<TeacherType | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const { mutate: deleteTeacher, isPending: isDeleting } =
    useDeleteTeahcerMutation();
  const { mutate: returnWork } = useReturnTeacherWorkMutation();
  const router = useRouter();

  useEffect(() => {
    if (data) setTeachers(data.reverse());

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

  const getFieldColor = (field: string) => {
    switch (field) {
      case "Frontend dasturlash":
        return "blue";
      case "Backend dasturlash":
        return "purple";
      case "Rus tili":
        return "red";
      case "Ingliz tili":
        return "cyan";
      default:
        return "default";
    }
  };

  const handleMenuClick = (record: TeacherType, action: string) => {
    switch (action) {
      case "delete":
        setTeacherToDelete(record);
        setIsDeleteModalOpen(true);
        break;
      case "return-work-staff":
        setTeacherToReturnWork(record);
        setIsReturnWorkModalOpen(true);
        break;
      default:
        break;
    }
  };

  const handleDeleteConfirm = () => {
    if (!teacherToDelete) return;
    deleteTeacher(teacherToDelete._id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setTeacherToDelete(null);
        refetch();
      },
    });
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setTeacherToDelete(null);
  };

  const handleReturnWorkConfirm = () => {
    if (!teacherToReturnWork) return;
    returnWork(teacherToReturnWork._id, {
      onSuccess: () => {
        setIsReturnWorkModalOpen(false);
        setTeacherToReturnWork(null);
        refetch();
      },
    });
  };

  const handleReturnWorkCancel = () => {
    setIsReturnWorkModalOpen(false);
    setTeacherToReturnWork(null);
  };

  const columns: ColumnsType<TeacherType> = [
    {
      title: (
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          Ism
        </div>
      ),
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: (
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          Familiya
        </div>
      ),
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: (
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          Email
        </div>
      ),
      dataIndex: "email",
      key: "email",
    },
    {
      title: (
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          Field
        </div>
      ),
      dataIndex: "field",
      key: "field",
      render: (field: string) => (
        <Tag color={getFieldColor(field)}>{field || "Not specified"}</Tag>
      ),
    },
    {
      title: (
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          Status
        </div>
      ),
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
    ...(userRole === "manager"
      ? [
          {
            title: (
              <div
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                Actions
              </div>
            ),
            key: "actions",
            render: (_: any, record: TeacherType) => {
              const items = [
                { label: "O'chirish", key: "delete", danger: true },
                { label: "Ishga qaytarish", key: "return-work-staff" },
              ];
              return (
                <div onClick={(e) => e.stopPropagation()}>
                  <Dropdown
                    menu={{
                      items,
                      onClick: ({ key }) => handleMenuClick(record, key),
                    }}
                    trigger={["click"]}
                  >
                    <Button type="text" icon={<MoreOutlined rotate={90} />} />
                  </Dropdown>
                </div>
              );
            },
          },
        ]
      : []),
  ];

  const darkModalTheme = {
    algorithm: theme.darkAlgorithm,
    components: {
      Modal: {
        contentBg: "#1f2937",
        headerBg: "#1f2937",
        titleColor: "#ffffff",
        colorText: "#ffffff",
      },
      Button: {
        defaultBg: "#374151",
        defaultColor: "white",
        defaultBorderColor: "#4b5563",
      },
    },
  };

  return (
    <>
      <div className="w-full">
        <Table
          columns={columns}
          dataSource={teachers}
          loading={isLoading}
          rowKey={(record) => record._id}
          scroll={{ x: "max-content" }}
          onRow={(record) => {
            return {
              onClick: () => router.push(`/teachers/${record._id}`),
              style: { cursor: "pointer" },
            };
          }}
        />
      </div>

      <ConfigProvider theme={isDarkMode ? darkModalTheme : undefined}>
        <Modal
          title="O'chirishni tasdiqlang"
          open={isDeleteModalOpen}
          onOk={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          okText="Ha"
          cancelText="Yo'q"
          okButtonProps={{ danger: true, loading: isDeleting }}
          className={isDarkMode ? "dark-modal" : ""}
        >
          {teacherToDelete && (
            <p className={isDarkMode ? "text-gray-200" : ""}>
              Siz rostdan ham{" "}
              <strong className={isDarkMode ? "text-white" : ""}>
                {teacherToDelete.first_name} {teacherToDelete.last_name || ""}
              </strong>{" "}
              ni o'chirishni xohlaysizmi?
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
          className={isDarkMode ? "dark-modal" : ""}
        >
          {teacherToReturnWork && (
            <p className={isDarkMode ? "text-gray-200" : ""}>
              Siz rostdan ham{" "}
              <strong className={isDarkMode ? "text-white" : ""}>
                {teacherToReturnWork.first_name}{" "}
                {teacherToReturnWork.last_name || ""}
              </strong>{" "}
              ni ishga qaytishini xohlaysizmi?
            </p>
          )}
        </Modal>
      </ConfigProvider>
    </>
  );
};

export default TeachersTable;