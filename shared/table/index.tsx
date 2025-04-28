"use client";

import { ManagerType } from "@/@types";
import { axiosInstance } from "@/hooks/useAxios/useAxios";
import { useQuery } from "@tanstack/react-query";
import { Table, Tag, Avatar, Button } from "antd";
import type { ColumnsType } from "antd/es/table";

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

];

const ManagerTable = () => {
  const { data, isLoading } = useQuery<ManagerType[]>({
    queryKey: ["managers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/staff/all-managers");
      return res.data.data;
    },
  });

  return (
    <Table
      columns={columns}
      dataSource={data || []}
      loading={isLoading}
      rowKey={(record) => record._id}
    />
  );
};

export default ManagerTable;
