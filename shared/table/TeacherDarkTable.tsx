"use client";

import { TeacherType } from "@/@types";
import { axiosInstance } from "@/hooks/useAxios/useAxios";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
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
import { useTheme } from "next-themes";

const TeacherDarkTable = () => {
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
  const [teacherToDelete, setTeacherToDelete] = useState<TeacherType | null>(null);
  const [isReturnWorkModalOpen, setIsReturnWorkModalOpen] = useState(false);
  const [teacherToReturnWork, setTeacherToReturnWork] = useState<TeacherType | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const { mutate: deleteTeacher, isPending: isDeleting } = useDeleteTeahcerMutation();
  const { mutate: returnWork } = useReturnTeacherWorkMutation();

  useEffect(() => {
    if (data) setTeachers(data);

    const user = Cookies.get("user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        setUserRole(parsed.role);
      } catch (error) {
        console.error("Error parsing user cookie:", error);
      }
    }
  }, [data]);

  const getFieldColor = (field: string) => {
    switch (field) {
      case "Frontend dasturlash":
        return "#3b82f6";
      case "Backend dasturlash":
        return "#8b5cf6";
      case "Rus tili":
        return "#ef4444";
      case "Ingliz tili":
        return "#06b6d4";
      default:
        return "#64748b";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "faol":
        return "#10b981";
      case "TA'TILDA":
        return "#f59e0b";
      default:
        return "#ef4444";
    }
  };

  const handleMenuClick = (record: TeacherType, action: string) => {
    if (action === "delete") {
      setTeacherToDelete(record);
      setIsDeleteModalOpen(true);
    } else if (action === "return-work-staff") {
      setTeacherToReturnWork(record);
      setIsReturnWorkModalOpen(true);
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

  const columns: ColumnsType<TeacherType> = [
    {
      title: "Ism",
      dataIndex: "first_name",
      key: "first_name",
      render: (text) => (
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {text}
        </span>
      ),
    },
    {
      title: "Familiya",
      dataIndex: "last_name",
      key: "last_name",
      render: (text) => (
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {text || ""}
        </span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => (
        <span className="text-gray-600 dark:text-gray-300">{text}</span>
      ),
    },
    {
      title: "Field",
      dataIndex: "field",
      key: "field",
      render: (field: string) => {
        const color = getFieldColor(field);
        return (
          <span
            style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 500,
              textTransform: "capitalize",
              color,
              backgroundColor: `${color}20`,
              border: `1px solid ${color}`,
              boxShadow: `${color}33 0px 0px 8px`,
            }}
          >
            {field || "Ko'rsatilmagan"}
          </span>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color = getStatusColor(status);
        return (
          <span
            style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 500,
              color,
              backgroundColor: `${color}20`,
              border: `1px solid ${color}`,
              boxShadow: `${color}33 0px 0px 8px`,
            }}
          >
            {status}
          </span>
        );
      },
    },
    ...(userRole === "manager"
      ? [
          {
            title: "Actions",
            key: "actions",
            render: (_: any, record: TeacherType) => {
              const items = [
                { label: "O'chirish", key: "delete", danger: true },
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
                  <Button
                    type="text"
                    icon={<MoreOutlined rotate={90} />}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  />
                </Dropdown>
              );
            },
          },
        ]
      : []),
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorBgContainer: isDarkMode ? "#1f2937" : "#ffffff",
          colorBorderSecondary: isDarkMode ? "#374151" : "#f0f0f0",
          colorText: isDarkMode ? "#ffffff" : "inherit",
          colorTextSecondary: isDarkMode ? "#d1d5db" : "inherit",
          borderRadius: 8,
          colorPrimary: "#4f46e5",
        },
        components: {
          Table: {
            headerBg: isDarkMode ? "#111827" : "#f9fafb",
            headerColor: isDarkMode ? "#9ca3af" : "inherit",
            rowHoverBg: isDarkMode ? "#1e293b" : "#f9fafb",
            colorBgContainer: isDarkMode ? "#111827" : "#ffffff",
          },
          Modal: {
            contentBg: isDarkMode ? "#1f2937" : "#ffffff",
            headerBg: isDarkMode ? "#1f2937" : "#ffffff",
            titleColor: isDarkMode ? "white" : "inherit",
          },
        },
      }}
    >
      <div className="w-full">
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
          <Table
            columns={columns}
            dataSource={teachers}
            loading={isLoading}
            rowKey={(record) => record._id}
            pagination={{
              position: ["bottomCenter"],
              showSizeChanger: false,
              className: "px-4 py-2",
            }}
            className="[&_.ant-table-tbody>tr>td]:py-3 [&_.ant-table-thead>tr>th]:py-3"
            scroll={{ x: "max-content" }}
          />
        </div>
      </div>

      <Modal
        title={
          <span className="text-lg font-bold text-red-500">
            O'chirishni tasdiqlang
          </span>
        }
        open={isDeleteModalOpen}
        onOk={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="O'chirish"
        cancelText="Bekor qilish"
        okButtonProps={{
          danger: true,
          loading: isDeleting,
          className: "bg-red-500 hover:bg-red-600 border-red-500",
        }}
        cancelButtonProps={{
          className: "hover:bg-gray-100 dark:hover:bg-gray-700",
        }}
        centered
      >
        {teacherToDelete && (
          <p className="text-gray-700 dark:text-gray-300">
            Siz rostdan ham{" "}
            <span className="font-bold dark:text-white">
              {teacherToDelete.first_name} {teacherToDelete.last_name || ""}
            </span>{" "}
            ni o'chirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi.
          </p>
        )}
      </Modal>

      <Modal
        title={
          <span className="text-lg font-bold text-blue-500">
            Ishga qaytarishni tasdiqlang
          </span>
        }
        open={isReturnWorkModalOpen}
        onOk={handleReturnWorkConfirm}
        onCancel={() => setIsReturnWorkModalOpen(false)}
        okText="Ha"
        cancelText="Yo'q"
        okButtonProps={{
          className: "bg-blue-500 hover:bg-blue-600 border-blue-500",
        }}
        cancelButtonProps={{
          className: "hover:bg-gray-100 dark:hover:bg-gray-700",
        }}
        centered
      >
        {teacherToReturnWork && (
          <p className="text-gray-700 dark:text-gray-300">
            Siz rostdan ham{" "}
            <span className="font-bold dark:text-white">
              {teacherToReturnWork.first_name} {teacherToReturnWork.last_name || ""}
            </span>{" "}
            ni ishga qaytarmoqchimisiz?
          </p>
        )}
      </Modal>
    </ConfigProvider>
  );
};

export default TeacherDarkTable;
