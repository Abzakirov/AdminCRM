"use client";

import {  ManagerType } from "@/@types";
import { axiosInstance } from "@/hooks/useAxios/useAxios";
import { useQuery } from "@tanstack/react-query";
import { Table, Avatar, ConfigProvider, theme, Dropdown, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";
import { MoreOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import EditManager from "../EditManager/EditManager";

const ManagerTable = () => {
  const { data, isLoading } = useQuery<ManagerType[]>({
    queryKey: ["managers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/staff/all-managers");
      return res.data.data;
    },
  });


  const [managers, setManagers] = useState<ManagerType[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<ManagerType | null>(null);

  useEffect(() => {
    if (data) {
      setManagers(data);
    }
    const user = Cookies.get("user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        setUserRole(parsed.role);
      } catch (error) {
        console.error("Failed to parse user cookie:", error);
      }
    }
  }, [data]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "faol":
        return { color: "#52c41a", bg: "rgba(82, 196, 26, 0.2)" };
      case "ta'tilda":
        return { color: "#faad14", bg: "rgba(250, 173, 20, 0.2)" };
      default:
        return { color: "#ff4d4f", bg: "rgba(255, 77, 79, 0.2)" };
    }
  };

  const getActiveColor = (active: boolean) => {
    return active
      ? { color: "#52c41a", bg: "rgba(82, 196, 26, 0.2)" }
      : { color: "#ff4d4f", bg: "rgba(255, 77, 79, 0.2)" };
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return { color: "#722ed1", bg: "rgba(114, 46, 209, 0.2)" };
      case "manager":
        return { color: "#1890ff", bg: "rgba(24, 144, 255, 0.2)" };
      default:
        return { color: "#13c2c2", bg: "rgba(19, 194, 194, 0.2)" };
    }
  };

  const handleClose = () => {
    setSelectedUser(null);
  };

  const handleMenuClick = (record: ManagerType, action: string) => {
    switch (action) {
      case "edit":
        setSelectedUser(record);
        break;
      default:
        break;
    }
  };
  const columns: ColumnsType<ManagerType> = [
    {
      title: "Avatar",
      dataIndex: "image",
      key: "image",
      render: (image: string, record: ManagerType) =>
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
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <span style={{ color: "#d1d5db" }}>{text}</span>,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => {
        const { color, bg } = getRoleColor(role);
        return (
          <span
            style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 500,
              textTransform: "capitalize",
              color: color,
              backgroundColor: bg,
              border: `1px solid ${color}`,
              boxShadow: `0 0 8px ${bg}`,
            }}
          >
            {role}
          </span>
        );
      },
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
              color: color,
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
    {
      title: "Is Active?",
      dataIndex: "active",
      key: "active",
      render: (active: boolean) => {
        const { color, bg } = getActiveColor(active);
        return (
          <span
            style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 500,
              color: color,
              backgroundColor: bg,
              border: `1px solid ${color}`,
              boxShadow: `0 0 8px ${bg}`,
            }}
          >
            {active ? "TRUE" : "FALSE"}
          </span>
        );
      },
    },
    ...(userRole === "manager"
      ? [
          {
            title: "Amallar",
            key: "actions",
            render: (_: any, record: ManagerType) => {
              const items = [
                { label: "Tahrirlash", key: "edit" },
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

  const customTableStyles = {
    tableLayout: "fixed",
    borderCollapse: "separate",
    borderSpacing: "0 10px",
  } as React.CSSProperties;
  const rowClassName = () => "manager-table-row";

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
        },
      }}
    >
      <div
        style={{
          width: "100%",
        }}
      >
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
            dataSource={managers}
            loading={isLoading}
            rowKey={(record) => record._id}
            pagination={{
              position: ["bottomCenter"],
              className: "custom-pagination",
              showSizeChanger: false,
            }}
            className="manager-dark-table"
            style={customTableStyles}
            rowClassName={rowClassName}
            scroll={{ x: "max-content" }}
          />
          <EditManager user={selectedUser} onClose={handleClose} />
        </div>
      </div>
    </ConfigProvider>
  );
};

export default ManagerTable;