"use client";

import { GroupType } from "@/@types";
import { axiosInstance } from "@/hooks/useAxios/useAxios";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  ConfigProvider,
  theme,
  Button,
  Dropdown,
  Modal,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { MoreOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import {
  useDeleteGroupMutation,
} from "@/hooks/mutation";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import "./AdminTable.css";
import EditEndGroup from "../edit-end-groups/EditEndGroup";
import EditPriceGroup from "../edit-price-groups/EditPriceGroup";

const GroupDarkTable = () => {
  const {
    data: groupsData,
    isLoading,
    refetch,
  } = useQuery<GroupType[]>({
    queryKey: ["groups"],
    queryFn: async () => {
      const res = await axiosInstance.get("/group/get-all-group");
      return res.data.data;
    },
  });

  const router = useRouter();

  const [groups, setGroups] = useState<GroupType[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<GroupType | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<GroupType | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { mutate: deleteGroup, isPending: isDeleting } = useDeleteGroupMutation();

  useEffect(() => {
    if (groupsData) setGroups(groupsData);
    const user = Cookies.get("user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        setUserRole(parsed.role);
      } catch (error) {
        console.error("Cookie parsing error:", error);
      }
    }
  }, [groupsData]);

  const getStatusColor = (status: string | undefined) => {
    if (!status) {
      return { color: "#ff4d4f", bg: "rgba(255, 77, 79, 0.2)" };
    }

    switch (status.toLowerCase()) {
      case "faol":
        return { color: "#52c41a", bg: "rgba(82, 196, 26, 0.2)" };
      case "arxivlangan":
        return { color: "#faad14", bg: "rgba(250, 173, 20, 0.2)" };
      default:
        return { color: "#ff4d4f", bg: "rgba(255, 77, 79, 0.2)" };
    }
  };

  const handleMenuClick = (record: GroupType, action: string) => {
    switch (action) {
      case "edit":
        setSelectedGroup(record);
        break;
      case "delete":
        setGroupToDelete(record);
        setIsDeleteModalOpen(true);
        break;
    }
  };

  const handleDeleteConfirm = () => {
    if (!groupToDelete) return;
    deleteGroup(groupToDelete._id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setGroupToDelete(null);
        refetch();
      },
    });
  };

  const columns: ColumnsType<GroupType> = [
    {
      title: "Nomi",
      dataIndex: "name",
      key: "name",
      render: (text) => <span style={{ fontWeight: 500 }}>{text || "N/A"}</span>,
    },
    {
      title: "O'qituvchi",
      dataIndex: "teacher",
      key: "teacher",
      render: (teacher) => (
        <span style={{ fontWeight: 500 }}>
          {teacher?.first_name || ""} {teacher?.last_name || ""}
          {!teacher?.first_name && !teacher?.last_name && "N/A"}
        </span>
      ),
    },
    {
      title: "Talabalar soni",
      dataIndex: "students",
      key: "students_count",
      render: (students) => (
        <span style={{ color: "#d1d5db" }}>{students?.length || 0}</span>
      ),
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
            {status ? status.toUpperCase() : "UNKNOWN"}
          </span>
        );
      },
    },
    ...(userRole === "manager" || userRole === "raxbar"
      ? [
          {
            title: "Actions",
            key: "actions",
            render: (_: any, record: GroupType) => (
              <Dropdown
                menu={{
                  items: [
                    { label: "Edit-End-Group", key: "edit" },
                    { label: "Edit-Price-Group", key: "delete", danger: true },
                    { label: "O'chirish", key: "delete", danger: true },
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
            dataSource={groups}
            loading={isLoading}
            rowKey={(record) => record._id}
            pagination={{
              position: ["bottomRight"],
              className: "custom-pagination",
              showSizeChanger: false,
            }}
            className="admin-dark-table"
            style={customTableStyles}
            scroll={{ x: "max-content" }}
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
                  router.push(`/groups/${record._id}`);
                },
                style: { cursor: "pointer" },
              };
            }}
          />
        </div>
      </div>

      <Modal
        title="O'chirishni tasdiqlang"
        open={isDeleteModalOpen}
        onOk={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setGroupToDelete(null);
        }}
        okText="Ha"
        cancelText="Yo'q"
        okButtonProps={{ danger: true, loading: isDeleting }}
      >
        {groupToDelete && (
          <p>
            <strong>{groupToDelete.name}</strong> guruhini o'chirishni
            xohlaysizmi?
          </p>
        )}
      </Modal>

      <EditEndGroup
        group={selectedGroup}
        onClose={() => {
          setSelectedGroup(null);
          refetch();
        }}
      />

      <EditPriceGroup
      onClose={()=>{
        
        setSelectedGroup(null);
        refetch();
      }}/>
    </ConfigProvider>
  );
};

export default GroupDarkTable;
