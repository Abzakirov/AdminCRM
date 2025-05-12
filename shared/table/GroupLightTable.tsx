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
import EditEndGroup from "../edit-end-groups/EditEndGroup"; 
import EditPriceGroup from "../edit-price-groups/EditPriceGroup"; 
import "./AdminTable.css";

const GroupLightTable = () => {
  const {
    data: groupsData,
    isLoading,
    refetch,
  } = useQuery<GroupType[]>({
    queryKey: ["groups"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/group/get-all-group");
        return res.data.data || [];
      } catch (error) {
        console.error("Failed to fetch groups:", error);
        return [];
      }
    },
  });

  const router = useRouter();

  const [groups, setGroups] = useState<GroupType[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<GroupType | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<GroupType | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [modals, setModals] = useState({
    delete: false,
  });

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

  const handleMenuClick = (record: GroupType, action: string) => {
    switch (action) {
      case "edit":
        setSelectedGroup(record);
        break;
      case "delete":
        setGroupToDelete(record);
        setModals((prev) => ({ ...prev, delete: true }));
        break;
    }
  };

  const handleDeleteConfirm = () => {
    if (!groupToDelete) return;
    deleteGroup(groupToDelete._id, {
      onSuccess: () => {
        setModals((prev) => ({ ...prev, delete: false }));
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
      render: (text) => <span style={{ fontWeight: 500 }}>{text || 'N/A'}</span>,
    },
    {
      title: "O'qituvchi",
      dataIndex: "teacher",
      key: "teacher",
      render: (teacher) => (
        <span style={{ fontWeight: 500 }}>
          {teacher?.first_name || ''} {teacher?.last_name || ''}
          {!teacher?.first_name && !teacher?.last_name && 'N/A'}
        </span>
      ),
    },
    {
      title: "Talabalar soni",
      dataIndex: "students",
      key: "students_count",
      render: (students) => <span style={{ color: "#606060" }}>{students?.length || 0}</span>,
    },
    {
      title: "Price",
      dataIndex: "price",  
      key: "price",
      render: (price: number) => <span style={{ color: "#606060" }}>{price || 'N/A'}</span>,
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
                    { label: "Tahrirlash", key: "edit" },
                    { label: "O'chirish", key: "delete", danger: true },
                  ],
                  onClick: ({ key }) => handleMenuClick(record, key),
                }}
                trigger={["click"]}
              >
                <Button
                  type="text"
                  icon={<MoreOutlined rotate={90} />}
                  className="actions-dropdown-light"
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
        algorithm: theme.defaultAlgorithm,
        token: {
          colorBgContainer: "#ffffff",
          colorBorderSecondary: "#e5e7eb",
          colorText: "#111827",
          colorTextSecondary: "#6b7280",
          borderRadius: 8,
          colorPrimary: "#4f46e5",
        },
        components: {
          Table: {
            headerBg: "#f9fafb",
            headerColor: "#4b5563",
            rowHoverBg: "#f3f4f6",
            colorBgContainer: "#f9fafb",
          },
          Modal: {
            contentBg: "#ffffff",
            headerBg: "#ffffff",
            titleColor: "#111827",
          },
          Button: {
            colorBgContainer: "#ffffff",
            colorText: "#111827",
          },
        },
      }}
    >
      <div style={{ width: "100%" }}>
        <div
          style={{
            border: "1px solid #e5e7eb",
            overflow: "hidden",
            backgroundColor: "#f9fafb",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
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
              className: "custom-pagination-light",
              showSizeChanger: false,
            }}
            className="admin-light-table"
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
        open={modals.delete}
        onOk={handleDeleteConfirm}
        onCancel={() => {
          setModals((prev) => ({ ...prev, delete: false }));
          setGroupToDelete(null);
        }}
        okText="Ha"
        cancelText="Yo'q"
        okButtonProps={{ danger: true, loading: isDeleting }}
      >
        {groupToDelete && (
          <p>
            <strong>{groupToDelete._id}</strong> guruhini o'chirishni xohlaysizmi?
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
        onClose={() => {
          setSelectedGroup(null);
          refetch();
        }}
      />
    </ConfigProvider>
  );
};

export default GroupLightTable;
