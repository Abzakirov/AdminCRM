"use client";

import { StudentUserType, GroupType } from "@/@types"; // Убедись, что у тебя есть GroupType
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
  useReturnWorkMutation,
} from "@/hooks/mutation";
import Cookies from "js-cookie";
import VacationModal from "../mod/VacationModal";

const StudentLightTable = () => {
  const { data: studentsData, isLoading, refetch } = useQuery<StudentUserType[]>({
    queryKey: ["students"],
    queryFn: async () => {
      const res = await axiosInstance.get("/student/get-all-students");
      return res.data.data;
    },
  });

  const { data: groupsData } = useQuery<GroupType[]>({
    queryKey: ["groups"],
    queryFn: async () => {
      const res = await axiosInstance.get("/group/get-all-group");
      return res.data.data;
    },
  });

  const [students, setStudents] = useState<StudentUserType[]>([]);
  const [selectedUser, setSelectedUser] = useState<StudentUserType | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReturnVacationModalOpen, setIsReturnVacationModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<StudentUserType | null>(null);
  const [studentToReturnVacation, setStudentToReturnVacation] = useState<StudentUserType | null>(null);
  const [vacationStudentId, setVacationStudentId] = useState<string | null>(null);
  const [isReturnWorkModalOpen, setIsReturnWorkModalOpen] = useState(false);
  const [studentToReturnWork, setStudentToReturnWork] = useState<StudentUserType | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const { mutate: deleteStudent, isPending: isDeleting } = useDeleteStudentMutation();
  const { mutate: returnVacation, isPending: isReturningVacation } = useReturnVacationStudentMutation();
  const { mutate: returnWork } = useReturnWorkMutation();

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

  const getGroupNameById = (groupId: string | undefined) => {
    if (!groupId || !groupsData) return "—";
    const group = groupsData.find((g) => g._id === groupId);
    return group?.name || "—";
  };

  const handleMenuClick = (record: StudentUserType, action: string) => {
    switch (action) {
      case "edit":
        setSelectedUser(record);
        break;
      case "delete":
        setStudentToDelete(record);
        setIsDeleteModalOpen(true);
        break;
      case "vacation":
        setVacationStudentId(record._id);
        break;
      case "return-vacation":
        setStudentToReturnVacation(record);
        setIsReturnVacationModalOpen(true);
        break;
      case "return-work":
        setStudentToReturnWork(record);
        setIsReturnWorkModalOpen(true);
        break;
      default:
        break;
    }
  };

  const handleDeleteConfirm = () => {
    if (!studentToDelete) return;
    deleteStudent(studentToDelete._id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setStudentToDelete(null);
        refetch();
      },
    });
  };

  const handleReturnWorkConfirm = () => {
    if (!studentToReturnWork) return;
    returnWork(studentToReturnWork._id, {
      onSuccess: () => {
        setIsReturnWorkModalOpen(false);
        setStudentToReturnWork(null);
        refetch();
      },
    });
  };

  const handleReturnVacationConfirm = () => {
    if (!studentToReturnVacation) return;
    returnVacation(studentToReturnVacation._id, {
      onSuccess: () => {
        setIsReturnVacationModalOpen(false);
        setStudentToReturnVacation(null);
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
        image ? <Avatar src={image} /> : <Avatar>{record.first_name.charAt(0)}</Avatar>,
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
      title: "Telefon",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Holat",
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
      title: "Guruh",
      key: "group",
      render: (_, record) => <span>{getGroupNameById(record._id)}</span>,
    },
    ...(userRole === "manager"
      ? [
          {
            title: "Amallar",
            key: "actions",
            render: (_: any, record: StudentUserType) => {
              const items = [
                { label: "Tahrirlash", key: "edit" },
                { label: "O'chirish", key: "delete", danger: true },
                { label: "Ta'tilga chiqarish", key: "vacation" },
                { label: "Ta'tildan qaytarish", key: "return-vacation" },
                { label: "Ishga qaytarish", key: "return-work" },
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
          dataSource={students}
          loading={isLoading}
          rowKey={(record) => record._id}
          className="px-2"
          scroll={{ x: "max-content" }}
        />
      </div>

      <RightSidebar user={selectedUser} onClose={() => setSelectedUser(null)} />

      <Modal
        title="O'chirishni tasdiqlang"
        open={isDeleteModalOpen}
        onOk={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setStudentToDelete(null);
        }}
        okText="Ha"
        cancelText="Yo'q"
        okButtonProps={{ danger: true, loading: isDeleting }}
      >
        {studentToDelete && (
          <p>
            Siz rostdan ham{" "}
            <strong>
              {studentToDelete.first_name} {studentToDelete.last_name || ""}
            </strong>{" "}
            ni o'chirishni xohlaysizmi?
          </p>
        )}
      </Modal>

      <Modal
        title="Ta'tildan qaytarishni tasdiqlang"
        open={isReturnVacationModalOpen}
        onOk={handleReturnVacationConfirm}
        onCancel={() => {
          setIsReturnVacationModalOpen(false);
          setStudentToReturnVacation(null);
        }}
        okText="Ha"
        cancelText="Yo'q"
        okButtonProps={{ loading: isReturningVacation }}
      >
        {studentToReturnVacation && (
          <p>
            Siz rostdan ham{" "}
            <strong>
              {studentToReturnVacation.first_name}{" "}
              {studentToReturnVacation.last_name || ""}
            </strong>{" "}
            ni ta'tildan qaytarishni xohlaysizmi?
          </p>
        )}
      </Modal>

      <Modal
        title="Ishga qaytarishni tasdiqlang"
        open={isReturnWorkModalOpen}
        onOk={handleReturnWorkConfirm}
        onCancel={() => {
          setIsReturnWorkModalOpen(false);
          setStudentToReturnWork(null);
        }}
        okText="Ha"
        cancelText="Yo'q"
      >
        {studentToReturnWork && (
          <p>
            Siz rostdan ham{" "}
            <strong>
              {studentToReturnWork.first_name} {studentToReturnWork.last_name || ""}
            </strong>{" "}
            ni ishga qaytishini xohlaysizmi?
          </p>
        )}
      </Modal>

      <VacationModal
        open={!!vacationStudentId}
        onClose={() => setVacationStudentId(null)}
        adminId={vacationStudentId}
      />
    </>
  );
};

export default StudentLightTable;
