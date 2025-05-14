"use client";

import { StudentUserType } from "@/@types";
import { axiosInstance } from "@/hooks/useAxios/useAxios";
import { useQuery } from "@tanstack/react-query";
import { Table, Tag, Avatar, Button, Dropdown, Modal } from "antd";
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
import { useRouter } from "next/navigation";
import AddStudentToGroupModal from "../mod/AddStudentGroup";

const StudentLightTable = () => {
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

  const router = useRouter();

  const [students, setStudents] = useState<StudentUserType[]>([]);
  const [selectedUser, setSelectedUser] = useState<StudentUserType | null>(
    null
  );
  const [studentToDelete, setStudentToDelete] =
    useState<StudentUserType | null>(null);
  const [studentToReturnVacation, setStudentToReturnVacation] =
    useState<StudentUserType | null>(null);
  const [studentToReturnWork, setStudentToReturnWork] =
    useState<StudentUserType | null>(null);
  const [vacationStudentId, setVacationStudentId] = useState<string | null>(
    null
  );
  const [userRole, setUserRole] = useState<string | null>(null);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [studentToAddToGroup, setStudentToAddToGroup] =
    useState<StudentUserType | null>(null);
  const [modals, setModals] = useState({
    delete: false,
    returnVacation: false,
    returnWork: false,
  });

  const { mutate: deleteStudent, isPending: isDeleting } =
    useDeleteStudentMutation();
  const { mutate: returnVacation, isPending: isReturningVacation } =
    useReturnVacationStudentMutation();
  const { mutate: returnWork } = useReturnStudentWorkMutation();

  useEffect(() => {
    if (studentsData) setStudents(studentsData.reverse());

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
      case "add-to-group":
        // Set the student for the group modal and open it
        setStudentToAddToGroup(record);
        setGroupModalOpen(true);
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
  
  const handleCloseGroupModal = () => {
    setGroupModalOpen(false);
    setStudentToAddToGroup(null);
    // Refresh the student data after adding to group
    refetch();
  };
  
  // Handle row click with proper checks for the Actions column
  const handleRowClick = (record: StudentUserType, event: React.MouseEvent) => {
    // Check if click was in the actions column
    const target = event.target as HTMLElement;
    const actionsColumn = target.closest('.actions-column, .actions-container, .actions-dropdown');
    
    // Only navigate if not clicking on actions column or its children
    if (!actionsColumn) {
      router.push(`/students/${record._id}`);
    }
  };

  const columns: ColumnsType<StudentUserType> = [
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
    { title: "Ism", dataIndex: "first_name", key: "first_name" },
    { title: "Familiya", dataIndex: "last_name", key: "last_name" },
    { title: "Telefon", dataIndex: "phone", key: "phone" },
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
    ...(userRole && ["manager", "raxbar"].includes(userRole)
      ? [
          {
            title: "Actions",
            key: "actions",
            className: "actions-column", // Add class for styling and identification
            render: (_: any, record: StudentUserType) => (
              <div 
                className="actions-container" 
                onClick={(e) => {
                  // Stop event propagation
                  e.stopPropagation();
                }}
              >
                <Dropdown
                  menu={{
                    items: [
                      { label: "Tahrirlash", key: "edit" },
                      { label: "O'chirish", key: "delete", danger: true },
                      { label: "Ta'tilga chiqarish", key: "vacation" },
                      { label: "Ta'tildan qaytarish", key: "return-vacation" },
                      { label: "O'qishga qaytarish", key: "return-work" },
                      { label: "O'quvchini guruhga qo'shish", key: "add-to-group" }, // Added menu item
                    ],
                    onClick: ({ key }) => handleMenuClick(record, key),
                  }}
                  trigger={["click"]}
                >
                  <Button 
                    type="text" 
                    icon={<MoreOutlined rotate={90} />} 
                    className="actions-dropdown"
                    onClick={(e) => e.stopPropagation()}
                  />
                </Dropdown>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={students}
        loading={isLoading}
        rowKey={(record) => record._id}
        className="px-2"
        scroll={{ x: "max-content" }}
        onRow={(record) => ({
          onClick: (event) => handleRowClick(record, event),
          style: { cursor: "pointer" },
        })}
      />

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
      
      <AddStudentToGroupModal
        open={groupModalOpen}
        onClose={handleCloseGroupModal}
        student={studentToAddToGroup}
        isDarkMode={true}
      />

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
    </>
  );
};

export default StudentLightTable;