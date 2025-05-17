"use client";

import { AdminUserType, ManagerType } from "@/@types";
import { axiosInstance } from "@/hooks/useAxios/useAxios";
import { useQuery } from "@tanstack/react-query";
import { Table, Tag, Avatar, Button, Dropdown } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";
import { MoreOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import EditManager from "../EditManager/EditManager";
import "./ManagerTable.css";

const ManagerLightTable = () => {
  const { data, isLoading } = useQuery<ManagerType[]>({
    queryKey: ["managers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/staff/all-managers");
      return res.data.data;
    },
  });

  const [userRole, setUserRole] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<ManagerType | null>(null);

  useEffect(() => {
    const user = Cookies.get("user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        setUserRole(parsed.role);
      } catch (error) {
        console.error("Failed to parse user cookie:", error);
      }
    }
  }, []);

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
      title: (
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          Avatar
        </div>
      ),
      dataIndex: "image",
      key: "image",
      render: (image: string, record) =>
        image ? <Avatar src={image} /> : <Avatar>{record.first_name.charAt(0)}</Avatar>,
    },
    {
      title: (
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          First Name
        </div>
      ),
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: (
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          Last Name
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
          Role
        </div>
      ),
      dataIndex: "role",
      key: "role",
      render: (role: string) => <Tag color="blue" className="capitalize">{role}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "faol" ? "green" : "red"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Is Active?",
      dataIndex: "active",
      key: "active",
      render: (active: boolean) => (
        <Tag color={active ? "green" : "red"}>{active ? "Yes" : "No"}</Tag>
      ),
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

  return (
    <>
      <Table
        columns={columns}
        dataSource={data || []}
        loading={isLoading}
        rowKey={(record) => record._id}
      />
      <EditManager user={selectedUser} onClose={handleClose} />
    </>
  );
};

export default ManagerLightTable;