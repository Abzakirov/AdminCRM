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
import { useDeleteGroupMutation } from "@/hooks/mutation";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import "./AdminTable.css";
import EditEndGroup from "../edit-end-groups/EditEndGroup";
import EditPriceGroup from "../edit-price-groups/EditPriceGroup";

const GroupDarkTable = () => {
  const router = useRouter();
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<GroupType | null>(null);
  const [selectedGroupForPrice, setSelectedGroupForPrice] = useState<GroupType | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<GroupType | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Set mounted state when component mounts on client-side to prevent hydration issues
  useEffect(() => {
    setMounted(true);
    
    // Get user role from cookies - only on client side
    const user = Cookies.get("user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        setUserRole(parsed.role);
      } catch (error) {
        console.error("Cookie parsing error:", error);
      }
    }
  }, []);

  // Only fetch data after component is mounted to avoid hydration mismatch
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
    enabled: mounted, 
  });
  console.log(groupsData);

  // Update groups when data changes
  useEffect(() => {
    if (groupsData) setGroups(groupsData.reverse());
  }, [groupsData]);

  const { mutate: deleteGroup, isPending: isDeleting } = useDeleteGroupMutation();

  const handleMenuClick = (record: GroupType, action: string) => {
    switch (action) {
      case "edit-end":
        setSelectedGroup(record);
        break;
      case "edit-price":
        setSelectedGroupForPrice(record);
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

  // Only define columns after component is mounted to avoid hydration issues
  const getColumns = (): ColumnsType<GroupType> => [
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
      render: (teacher) => {
        // Handle when teacher is potentially an object (not a string)
        if (typeof teacher === 'object' && teacher !== null) {
          return (
            <span style={{ fontWeight: 500 }}>
              {teacher.first_name || ""} {teacher.last_name || ""}
              {!teacher.first_name && !teacher.last_name && "N/A"}
            </span>
          );
        }
        return <span style={{ fontWeight: 500 }}>N/A</span>;
      },
    },
    {
      title: "Talabalar soni",
      dataIndex: "students",
      key: "students_count",
      render: (students) => {
        // Make sure students is an array before accessing length
        const count = Array.isArray(students) ? students.length : 0;
        return <span style={{ color: "#d1d5db" }}>{count}</span>;
      },
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => (
        <span style={{ fontWeight: 500, color: "#4f46e5" }}>
          {price ? `$${price.toFixed(2)}` : "N/A"}
        </span>
      ),
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
                    { label: "Edit-End-Group", key: "edit-end" },
                    { label: "Edit-Price-Group", key: "edit-price" },
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

  // Render a simple placeholder during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <div 
        style={{ 
          width: "100%", 
          height: "200px", 
          backgroundColor: "#111827", 
          borderRadius: "8px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center" 
        }}
      >
        <span style={{ color: "#9ca3af" }}>Loading...</span>
      </div>
    );
  }

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
            columns={getColumns()}
            dataSource={Array.isArray(groups) ? groups : []}
            loading={isLoading}
            rowKey={(record) => record._id || Math.random().toString()}
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
                  // Type assertion for the event target
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
            <strong>{groupToDelete?.group || groupToDelete._id}</strong> guruhini o'chirishni
            xohlaysizmi?
          </p>
        )}
      </Modal>

      {selectedGroup && (
        <EditEndGroup
          group={selectedGroup}
          onClose={() => {
            setSelectedGroup(null);
            refetch();
          }}
        />
      )}

      {selectedGroupForPrice && (
        <EditPriceGroup
          group={selectedGroupForPrice}
          onClose={() => {
            setSelectedGroupForPrice(null);
            refetch();
          }}
        />
      )}
    </ConfigProvider>
  );
};

export default GroupDarkTable;
