'use client';

import { AdminType, AdminUserType } from "@/@types";
import { axiosInstance } from "@/hooks/useAxios/useAxios";
import { useQuery } from "@tanstack/react-query";
import { Table, Avatar, Button, Dropdown, Modal, ConfigProvider, theme } from "antd";
import type { ColumnsType } from "antd/es/table";
import { MoreOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import RightSidebar from "../right_sidebar/RightSidebar";
import { useDeleteAdminMutation } from "@/hooks/mutation";
import Cookies from "js-cookie";
import "./AdminTable.css";

const AdminTable = () => {
  const { data, isLoading, refetch } = useQuery<AdminType[]>({
    queryKey: ["admins"],
    queryFn: async () => {
      const res = await axiosInstance.get("/staff/all-admins");
      return res.data.data;
    },
  });

  const [admins, setAdmins] = useState<AdminType[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUserType | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<AdminUserType | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const { mutate: deleteAdmin, isPending: isDeleting } = useDeleteAdminMutation();

  useEffect(() => {
    if (data) {
      setAdmins(data);
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

  const handleMenuClick = (record: AdminType, action: string) => {
    if (action === "edit") {
      setSelectedUser(record as unknown as AdminUserType);
    } else if (action === "delete") {
      setAdminToDelete(record as unknown as AdminUserType);
      setIsDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = () => {
    if (!adminToDelete) return;

    deleteAdmin(adminToDelete._id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setAdminToDelete(null);
        refetch();
      },
    });
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setAdminToDelete(null);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'faol':
        return { color: '#52c41a', bg: 'rgba(82, 196, 26, 0.2)' };
      case "ta'tilda":
        return { color: '#faad14', bg: 'rgba(250, 173, 20, 0.2)' };
      default:
        return { color: '#ff4d4f', bg: 'rgba(255, 77, 79, 0.2)' };
    }
  };

  const getActiveColor = (active: boolean) => {
    return active 
      ? { color: '#52c41a', bg: 'rgba(82, 196, 26, 0.2)' }
      : { color: '#ff4d4f', bg: 'rgba(255, 77, 79, 0.2)' };
  };
  
  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return { color: '#1890ff', bg: 'rgba(24, 144, 255, 0.2)' };
      case 'manager':
        return { color: '#722ed1', bg: 'rgba(114, 46, 209, 0.2)' };
      default:
        return { color: '#13c2c2', bg: 'rgba(19, 194, 194, 0.2)' };
    }
  };

  const columns: ColumnsType<AdminType> = [
    {
      title: "Avatar",
      dataIndex: "image",
      key: "image",
      render: (image: string, record: AdminType) =>
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
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <span style={{ color: '#d1d5db' }}>{text}</span>
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
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 500,
              textTransform: 'capitalize',
              color: color, 
              backgroundColor: bg,
              border: `1px solid ${color}`,
              boxShadow: `0 0 8px ${bg}`
            }}
          >
            {role}
          </span>
        );
      }
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
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 500,
              color: color, 
              backgroundColor: bg,
              border: `1px solid ${color}`,
              boxShadow: `0 0 8px ${bg}`
            }}
          >
            {status.toUpperCase()}
          </span>
        );
      }
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
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 500,
              color: color, 
              backgroundColor: bg,
              border: `1px solid ${color}`,
              boxShadow: `0 0 8px ${bg}`
            }}
          >
            {active ? "TRUE" : "FALSE"}
          </span>
        );
      }
    },
    ...(userRole === "manager"
      ? [
          {
            title: "Actions",
            key: "actions",
            render: (_: any, record: AdminType) => {
              const items = [
                {
                  label: "Edit",
                  key: "edit",
                },
                {
                  label: "Delete",
                  key: "delete",
                  danger: true,
                },
              ];

              return (
                <Dropdown
                  menu={{
                    items,
                    onClick: ({ key }: {key: string}) => handleMenuClick(record, key),
                  }}
                  trigger={["click"]}
                >
                  <Button 
                    type="text" 
                    icon={<MoreOutlined rotate={90} />} 
                    style={{ 
                      color: '#d1d5db' 
                    }}
                  />
                </Dropdown>
              );
            },
          },
        ] as ColumnsType<AdminType>
      : []),
  ];

  const customTableStyles = {
    tableLayout: 'fixed',
    borderCollapse: 'separate',
    borderSpacing: '0 10px' 
  } as React.CSSProperties;
  const rowClassName = () => "admin-table-row";

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgContainer: '#1f2937',
          colorBorderSecondary: '#374151',
          colorText: '#ffffff',
          colorTextSecondary: '#d1d5db',
          borderRadius: 8,
          colorPrimary: '#4f46e5',
        },
        components: {
          Table: {
            headerBg: '#111827',
            headerColor: '#9ca3af',
            rowHoverBg: '#1e293b',
            colorBgContainer: '#111827',
          },
          Modal: {
            contentBg: '#1f2937',
            headerBg: '#1f2937',
            titleColor: 'white',
          },
          Button: {
            defaultBg: '#374151',
            defaultColor: 'white',
            primaryColor: 'white',
          },
        }
      }}
    >
      <div style={{
        width: '100%', 
      }}>
      
        
        <div style={{
          border: '1px solid #1f2937',
          overflow: 'hidden',
          backgroundColor: '#111827',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)'
        }}>
          <Table
            columns={columns}
            dataSource={admins}
            loading={isLoading}
            rowKey={(record) => record._id}
            pagination={{ 
              position: ['bottomCenter'],
              className: 'custom-pagination',
              showSizeChanger: false
            }}
            className="admin-dark-table "
            style={customTableStyles}
            rowClassName={rowClassName}
            scroll={{ x: 'max-content' }}
          />
        </div>
      </div>

      <RightSidebar user={selectedUser} onClose={() => setSelectedUser(null)} />

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', color: '#ef4444' }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Confirm Deletion</span>
          </div>
        }
        open={isDeleteModalOpen}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ 
          danger: true, 
          loading: isDeleting,
          style: { backgroundColor: '#ef4444', borderColor: '#ef4444' }
        }}
        cancelButtonProps={{
          style: { borderColor: '#4b5563', color: '#d1d5db' }
        }}
        className="admin-dark-modal"
        centered
      >
        {adminToDelete && (
          <p style={{ color: '#d1d5db' }}>
            Are you sure you want to delete <span style={{ fontWeight: 'bold', color: 'white' }}>{adminToDelete.first_name} {adminToDelete.last_name}</span>? This action cannot be undone.
          </p>
        )}
      </Modal>
    </ConfigProvider>);
};

export default AdminTable;