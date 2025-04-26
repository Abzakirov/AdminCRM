"use client";

import { Table, Tag, Avatar } from "antd";

const data = [
  {
    key: "1",
    _id: "6801df1e58ae8c55c00a19ee",
    first_name: "Davron",
    last_name: "Raimjonov",
    email: "davron_raimjonov4446@mail.ru",
    role: "manager",
    status: "faol",
    active: true,
    createdAt: "2025-04-18T05:11:58.016Z",
    last_active_date: "2025-04-26T07:16:43.861Z",
    work_date: "2025-04-18T00:00:00.000Z",
    work_end: null,
    image: "",
  },
];

const columns = [
  {
    title: "Avatar",
    dataIndex: "image",
    key: "image",
    render: (image: string) =>
      image ? <Avatar src={image} /> : <Avatar>{"D"}</Avatar>,
  },
  {
    title: "First Name",
    dataIndex: "first_name",
    key: "first_name",
  },
  {
    title: "Last Name",
    dataIndex: "last_name",
    key: "last_name",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    render: (role: string) => <Tag color="blue">{role}</Tag>,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: string) => (
      <Tag color={status === "active" ? "green" : "red"}>
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
  {
    title: "Last Active Date",
    dataIndex: "last_active_date",
    key: "last_active_date",
  },
];

const MyTable = () => {
  return <Table columns={columns} dataSource={data} />;
};

export default MyTable;
