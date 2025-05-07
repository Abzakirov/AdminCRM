"use client";

import { StudentUserType } from "@/@types";
import { axiosInstance } from "@/hooks/useAxios/useAxios";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  Avatar,
  ConfigProvider,
  theme,
  Button,
  Dropdown,
  Modal,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { MoreOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import RightSidebar from "../right_sidebar/RightSidebar";
import {
  useDeleteStudentMutation,
  useReturnVacationStudentMutation,
  useReturnStudentWorkMutation,
} from "@/hooks/mutation";
import Cookies from "js-cookie";
import StudentVacation from "../mod/StudentVacation";
import "./AdminTable.css";
import { useRouter } from "next/navigation";

const StudentDarkTable = () => {
  const {
    data: studentsData,
    isLoading,
    refetch,
  } = useQuery<StudentUserType[]>({
    queryKey: ["students"],
    queryFn: async () => {
      const res = await axiosInstance.get("/student/get-all-students");
      return res.data.data;
    },
  });
  console.log(studentsData);

  const router = useRouter();

  const [students, setStudents] = useState<StudentUserType[]>([]);
  const [selectedUser, setSelectedUser] = useState<StudentUserType | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<StudentUserType | null>(null);
  const [studentToReturnVacation, setStudentToReturnVacation] = useState<StudentUserType | null>(null);
  const [studentToReturnWork, setStudentToReturnWork] = useState<StudentUserType | null>(null);
  const [vacationStudentId, setVacationStudentId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [modals, setModals] = useState({
    delete: false,
    returnVacation: false,
    returnWork: false,
  });

  const { mutate: deleteStudent, isPending: isDeleting } = useDeleteStudentMutation();
  const { mutate: returnVacation, isPending: isReturningVacation } = useReturnVacationStudentMutation();
  const { mutate: returnWork } = useReturnStudentWorkMutation();

  useEffect(() => {
    if (studentsData) setStudents(studentsData);
    const user = Cookies.get("user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        setUserRole(parsed.role);
      } catch (error) {
        console.error("Cookie parsing error:", error);
      }
    }
  }, [studentsData]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "faol":
        return { color: "#52c41a", bg: "rgba(82, 196, 26, 0.2)" };
      case "ta'tilda":
      case "tatilda":
        return { color: "#faad14", bg: "rgba(250, 173, 20, 0.2)" };
      default:
        return { color: "#ff4d4f", bg: "rgba(255, 77, 79, 0.2)" };
    }
  };

  const handleMenuClick = (record: StudentUserType, action: string) => {
    switch (action) {
      case "edit":
        setSelectedUser(record);
        break;
      case "delete":
        setStudentToDelete(record);
        setModals((prev) => ({ ...prev, delete: true }));
        break;
      case "vacation":
        setVacationStudentId(record._id);
        break;
      case "return-vacation":
        setStudentToReturnVacation(record);
        setModals((prev) => ({ ...prev, returnVacation: true }));
        break;
      case "return-work":
        setStudentToReturnWork(record);
        setModals((prev) => ({ ...prev, returnWork: true }));
        break;
    }
  };

  const handleDeleteConfirm = () => {
    if (!studentToDelete) return;
    deleteStudent(studentToDelete._id, {
      onSuccess: () => {
        setModals((prev) => ({ ...prev, delete: false }));
        setStudentToDelete(null);
        refetch();
      },
    });
  };

  const handleReturnVacationConfirm = () => {
    if (!studentToReturnVacation) return;
    returnVacation(studentToReturnVacation._id, {
      onSuccess: () => {
        setModals((prev) => ({ ...prev, returnVacation: false }));
        setStudentToReturnVacation(null);
        refetch();
      },
    });
  };

  const handleReturnWorkConfirm = () => {
    if (!studentToReturnWork) return;
    returnWork(studentToReturnWork._id, {
      onSuccess: () => {
        setModals((prev) => ({ ...prev, returnWork: false }));
        setStudentToReturnWork(null);
        refetch();
      },
    });
  };

  const columns: ColumnsType<StudentUserType> = [
    {
      title: "Avatar",
      dataIndex: "image",
      key: "image",
      render: (image: string, record) =>
        image ? <Avatar src={image} /> : <Avatar>{record.first_name?.charAt(0)}</Avatar>,
    },
    {
      title: "Ism",
      dataIndex: "first_name",
      key: "first_name",
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "Familiya",
      dataIndex: "last_name",
      key: "last_name",
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "Telefon",
      dataIndex: "phone",
      key: "phone",
      render: (text) => <span style={{ color: "#d1d5db" }}>{text}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const { color, bg } = getStatusColor(status);
        return (
          <span
            style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 500,
              color,
              backgroundColor: bg,
              border: `1px solid ${color}`,
              boxShadow: `0 0 8px ${bg}`,
            }}
          >
            {status.toUpperCase()}
          </span>
        );
      },
    },
    ...(userRole === "manager" || userRole === "raxbar"
      ? [
          {
            title: "Actions",
            key: "actions",
            render: (_: any, record: StudentUserType) => (
              <Dropdown
                menu={{
                  items: [
                    { label: "Tahrirlash", key: "edit" },
                    { label: "O'chirish", key: "delete", danger: true },
                    { label: "Ta'tilga chiqarish", key: "vacation" },
                    { label: "Ta'tildan qaytarish", key: "return-vacation" },
                    { label: "O'qishga qaytarish", key: "return-work" },
                  ],
                  onClick: ({ key }) => handleMenuClick(record, key),
                }}
                trigger={["click"]}
              >
                <Button
                  type="text"
                  icon={<MoreOutlined rotate={90} />}
                  className="actions-dropdown"
                />
              </Dropdown>
            ),
          },
        ]
      : []),
  ];

  const customTableStyles: React.CSSProperties = {
    tableLayout: "fixed",
    borderCollapse: "separate",
    borderSpacing: "0 10px",
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgContainer: "#1f2937",
          colorBorderSecondary: "#374151",
          colorText: "#ffffff",
          colorTextSecondary: "#d1d5db",
          borderRadius: 8,
          colorPrimary: "#4f46e5",
        },
        components: {
          Table: {
            headerBg: "#111827",
            headerColor: "#9ca3af",
            rowHoverBg: "#1e293b",
            colorBgContainer: "#111827",
          },
          Modal: {
            contentBg: "#1f2937",
            headerBg: "#1f2937",
            titleColor: "#ffffff",
          },
          Button: {
            colorBgContainer: "#1f2937",
            colorText: "#ffffff",
          },
        },
      }}
    >
      <div style={{ width: "100%" }}>
        <div
          style={{
            border: "1px solid #1f2937",
            overflow: "hidden",
            backgroundColor: "#111827",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)",
            borderRadius: "8px",
            margin: "8px",
          }}
        >
          <Table
            columns={columns}
            dataSource={students}
            loading={isLoading}
            rowKey={(record) => record._id}
            pagination={{
              position: ["bottomCenter"],
              className: "custom-pagination",
              showSizeChanger: false,
            }}
            className="admin-dark-table"
            style={customTableStyles}
            onRow={(record) => {
              return {
                onClick: (event) => {
                  const target = event.target as HTMLElement;
                  if (
                    target.closest(".actions-dropdown") ||
                    target.tagName === "BUTTON" ||
                    target.closest("button")
                  ) {
                    return;
                  }
                  router.push(`/students/${record._id}`);
                },
                style: { cursor: "pointer" },
              };
            }}
          />
        </div>
      </div>

      <RightSidebar user={selectedUser} onClose={() => setSelectedUser(null)} />

      <Modal
        title="O'chirishni tasdiqlang"
        open={modals.delete}
        onOk={handleDeleteConfirm}
        onCancel={() => {
          setModals((prev) => ({ ...prev, delete: false }));
          setStudentToDelete(null);
        }}
        okText="Ha"
        cancelText="Yo'q"
        okButtonProps={{ danger: true, loading: isDeleting }}
      >
        {studentToDelete && (
          <p>
            <strong>
              {studentToDelete.first_name} {studentToDelete.last_name || ""}
            </strong>{" "}
            ni o'chirishni xohlaysizmi?
          </p>
        )}
      </Modal>

      <Modal
        title="Ta'tildan qaytarishni tasdiqlang"
        open={modals.returnVacation}
        onOk={handleReturnVacationConfirm}
        onCancel={() => {
          setModals((prev) => ({ ...prev, returnVacation: false }));
          setStudentToReturnVacation(null);
        }}
        okText="Ha"
        cancelText="Yo'q"
        okButtonProps={{ loading: isReturningVacation }}
      >
        {studentToReturnVacation && (
          <p>
            <strong>
              {studentToReturnVacation.first_name}{" "}
              {studentToReturnVacation.last_name || ""}
            </strong>{" "}
            ni ta'tildan qaytarishni xohlaysizmi?
          </p>
        )}
      </Modal>

      <Modal
        title="O'qishga qaytarishni tasdiqlang"
        open={modals.returnWork}
        onOk={handleReturnWorkConfirm}
        onCancel={() => {
          setModals((prev) => ({ ...prev, returnWork: false }));
          setStudentToReturnWork(null);
        }}
        okText="Ha"
        cancelText="Yo'q"
      >
        {studentToReturnWork && (
          <p>
            <strong>
              {studentToReturnWork.first_name}{" "}
              {studentToReturnWork.last_name || ""}
            </strong>{" "}
            ni o'qishga qaytarishni xohlaysizmi?
          </p>
        )}
      </Modal>

      <StudentVacation
        open={!!vacationStudentId}
        onClose={() => setVacationStudentId(null)}
        studentId={vacationStudentId}
      />
    </ConfigProvider>
  );
};

export default StudentDarkTable;
