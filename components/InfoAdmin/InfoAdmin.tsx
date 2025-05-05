"use client";

import  { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AdminType } from '@/@types';
import { 
  Card, 
  Avatar, 
  Descriptions, 
  Spin, 
  Divider, 
  Row, 
  Col, 
  ConfigProvider, 
  theme,
  Timeline,
  Statistic,
  message
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TeamOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { axiosInstance } from '@/hooks/useAxios/useAxios';

const InfoAdmin = () => {
  const searchParams = useSearchParams();
  const adminId = searchParams.get('_id');
  const [adminData, setAdminData] = useState<AdminType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!adminId) {
        setError("Admin ID not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axiosInstance.get(`/staff/info/${adminId}`);
        if (response.data.success) {
          setAdminData(response.data.data);
        } else {
          setError("Failed to fetch admin data");
        }
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError("Failed to fetch admin data");
        message.error("Admin ma'lumotlarini yuklashda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [adminId]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "faol":
        return { color: "#52c41a", bg: "rgba(82, 196, 26, 0.2)" };
      case "ta'tilda":
        return { color: "#faad14", bg: "rgba(250, 173, 20, 0.2)" };
      default:
        return { color: "#ff4d4f", bg: "rgba(255, 77, 79, 0.2)" };
    }
  };

  const getActiveStatus = (active: boolean) => {
    return active ? 
      { color: "#52c41a", text: "Faol", icon: <CheckCircleOutlined /> } : 
      { color: "#ff4d4f", text: "Faol emas", icon: <CloseCircleOutlined /> };
  };

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return { color: "#1890ff", bg: "rgba(24, 144, 255, 0.2)" };
      case "manager":
        return { color: "#722ed1", bg: "rgba(114, 46, 209, 0.2)" };
      default:
        return { color: "#13c2c2", bg: "rgba(19, 194, 194, 0.2)" };
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        color: '#ff4d4f'
      }}>
        <h2>Xatolik</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        color: '#ff4d4f'
      }}>
        <h2>Ma'lumot topilmadi</h2>
      </div>
    );
  }

  const statusStyle = getStatusColor(adminData.status);
  const activeStatus = getActiveStatus(adminData.active);
  const roleStyle = getRoleColor(adminData.role);
  
  const workStartDate = moment(adminData.work_date);
  const currentDate = moment();
  const workDuration = moment.duration(currentDate.diff(workStartDate));
  const years = workDuration.years();
  const months = workDuration.months();
  const days = workDuration.days();

  const workDurationText = `${years > 0 ? `${years} yil ` : ''}${months > 0 ? `${months} oy ` : ''}${days > 0 ? `${days} kun` : ''}`;

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
          Card: {
            headerBg: "#111827",
            colorBorderSecondary: "#374151",
          },
          Descriptions: {
            colorSplit: "#374151",
            colorTextHeading: "#9ca3af",
          },
          Timeline: {
            colorText: "#d1d5db",
          },
        },
      }}
    >
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#111827', 
        minHeight: '100vh'
      }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card 
              style={{ 
                backgroundColor: '#1f2937', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
                borderRadius: '8px',
                border: '1px solid #374151',
              }}
            >
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                textAlign: 'center' 
              }}>
                {adminData.image ? (
                  <Avatar 
                    src={adminData.image} 
                    size={120} 
                    style={{ marginBottom: '16px', border: '4px solid #374151' }}
                  />
                ) : (
                  <Avatar 
                    icon={<UserOutlined />} 
                    size={120} 
                    style={{ 
                      marginBottom: '16px', 
                      backgroundColor: '#4f46e5',
                      border: '4px solid #374151'
                    }}
                  />
                )}
                <h2 style={{ color: 'white', marginBottom: '4px' }}>
                  {adminData.first_name} {adminData.last_name}
                </h2>
                <div style={{ 
                  display: 'inline-block', 
                  padding: '4px 12px', 
                  borderRadius: '20px', 
                  fontSize: '14px', 
                  fontWeight: 500, 
                  textTransform: 'capitalize', 
                  color: roleStyle.color, 
                  backgroundColor: roleStyle.bg, 
                  border: `1px solid ${roleStyle.color}`, 
                  boxShadow: `0 0 8px ${roleStyle.bg}`,
                  marginBottom: '16px' 
                }}>
                  {adminData.role}
                </div>
                <p style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  color: '#d1d5db',
                  marginBottom: '8px'
                }}>
                  <MailOutlined style={{ marginRight: '8px' }} />
                  {adminData.email}
                </p>
                <Divider style={{ borderColor: '#374151', margin: '16px 0' }} />
                <div style={{ 
                  display: 'flex', 
                  width: '100%', 
                  justifyContent: 'space-around' 
                }}>
                  <div>
                    <div style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: activeStatus.color, 
                      backgroundColor: 'rgba(0, 0, 0, 0.2)', 
                      borderRadius: '50%', 
                      width: '40px', 
                      height: '40px', 
                      marginBottom: '8px' 
                    }}>
                      {activeStatus.icon}
                    </div>
                    <div style={{ color: '#d1d5db' }}>
                      {activeStatus.text}
                    </div>
                  </div>
                  <div>
                    <div style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: statusStyle.color, 
                      backgroundColor: 'rgba(0, 0, 0, 0.2)', 
                      borderRadius: '50%', 
                      width: '40px', 
                      height: '40px', 
                      marginBottom: '8px' 
                    }}>
                      <ClockCircleOutlined />
                    </div>
                    <div style={{ color: '#d1d5db' }}>
                      {adminData.status.toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <div style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: '#4f46e5', 
                      backgroundColor: 'rgba(0, 0, 0, 0.2)', 
                      borderRadius: '50%', 
                      width: '40px', 
                      height: '40px', 
                      marginBottom: '8px' 
                    }}>
                      <TeamOutlined />
                    </div>
                    <div style={{ color: '#d1d5db' }}>
                      Admin
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card 
              title="Ish tajribasi" 
              style={{ 
                backgroundColor: '#1f2937', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
                borderRadius: '8px',
                border: '1px solid #374151',
                marginTop: '16px'
              }}
              headStyle={{ 
                borderBottom: '1px solid #374151', 
                color: '#d1d5db', 
                fontWeight: 600 
              }}
            >
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Statistic 
                    title="Ish tajribasi" 
                    value={workDurationText} 
                    valueStyle={{ color: '#4f46e5' }}
                    prefix={<TrophyOutlined />}
                  />
                </Col>
              </Row>
              <Divider style={{ borderColor: '#374151', margin: '16px 0' }} />
              <Timeline
                items={[
                  {
                    color: '#4f46e5',
                    children: (
                      <div>
                        <p style={{ margin: 0, fontWeight: 500, color: '#ffffff' }}>Ishga qabul qilingan</p>
                        <p style={{ margin: 0, color: '#9ca3af' }}>{moment(adminData.work_date).format('DD.MM.YYYY')}</p>
                      </div>
                    )
                  },
                  ...(adminData.work_end ? [
                    {
                      color: '#f5222d',
                      children: (
                        <div>
                          <p style={{ margin: 0, fontWeight: 500, color: '#ffffff' }}>Ishdan ketgan</p>
                          <p style={{ margin: 0, color: '#9ca3af' }}>{moment(adminData.work_end).format('DD.MM.YYYY')}</p>
                        </div>
                      )
                    }
                  ] : []),
                  ...(adminData.leave_history && adminData.leave_history.length > 0 ? 
                    adminData.leave_history.map((leave: any, index: number) => ({
                      color: '#faad14',
                      children: (
                        <div key={index}>
                          <p style={{ margin: 0, fontWeight: 500, color: '#ffffff' }}>Ta'tilga chiqqan</p>
                          <p style={{ margin: 0, color: '#9ca3af' }}>
                            {moment(leave.start_date).format('DD.MM.YYYY')} - {moment(leave.end_date).format('DD.MM.YYYY')}
                          </p>
                          {leave.reason && <p style={{ margin: 0, color: '#9ca3af' }}>Sabab: {leave.reason}</p>}
                        </div>
                      )
                    })) : []
                  )
                ]}
              />
            </Card>
          </Col>
          
          <Col xs={24} md={16}>
            <Card
              title="Admin ma'lumotlari"
              style={{ 
                backgroundColor: '#1f2937', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
                borderRadius: '8px',
                border: '1px solid #374151',
              }}
              headStyle={{ 
                borderBottom: '1px solid #374151', 
                color: '#d1d5db', 
                fontWeight: 600 
              }}
            >
              <Descriptions
                bordered
                column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                size="middle"
                labelStyle={{ color: '#9ca3af' }}
                contentStyle={{ color: '#ffffff' }}
                style={{ 
                  backgroundColor: '#1f2937',
                }}
              >
                <Descriptions.Item label="Ism">{adminData.first_name}</Descriptions.Item>
                <Descriptions.Item label="Familiya">{adminData.last_name}</Descriptions.Item>
                <Descriptions.Item label="Email">{adminData.email}</Descriptions.Item>
                <Descriptions.Item label="Status">
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 500,
                      color: statusStyle.color,
                      backgroundColor: statusStyle.bg,
                      border: `1px solid ${statusStyle.color}`,
                      boxShadow: `0 0 8px ${statusStyle.bg}`,
                    }}
                  >
                    {adminData.status.toUpperCase()}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Rol">
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 500,
                      textTransform: 'capitalize',
                      color: roleStyle.color,
                      backgroundColor: roleStyle.bg,
                      border: `1px solid ${roleStyle.color}`,
                      boxShadow: `0 0 8px ${roleStyle.bg}`,
                    }}
                  >
                    {adminData.role}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Faol holati">
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 500,
                      color: activeStatus.color,
                      backgroundColor: `${activeStatus.color}20`,
                      border: `1px solid ${activeStatus.color}`,
                      boxShadow: `0 0 8px ${activeStatus.color}20`,
                    }}
                  >
                    {adminData.active ? "HA" : "YO'Q"}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Ishga kirgan sana">
                  {moment(adminData.work_date).format('DD.MM.YYYY')}
                </Descriptions.Item>
                {adminData.work_end && (
                  <Descriptions.Item label="Ishdan ketgan sana">
                    {moment(adminData.work_end).format('DD.MM.YYYY')}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Ro'yxatdan o'tgan sana">
                  {moment(adminData.createdAt).format('DD.MM.YYYY')}
                </Descriptions.Item>
                <Descriptions.Item label="Oxirgi yangilanish">
                  {moment(adminData.updatedAt).format('DD.MM.YYYY')}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {adminData.leave_history && adminData.leave_history.length > 0 && (
              <Card
                title="Ta'til tarixi"
                style={{ 
                  backgroundColor: '#1f2937', 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
                  borderRadius: '8px',
                  border: '1px solid #374151',
                  marginTop: '16px'
                }}
                headStyle={{ 
                  borderBottom: '1px solid #374151', 
                  color: '#d1d5db', 
                  fontWeight: 600 
                }}
              >
                {adminData.leave_history.map((leave: any, index: number) => (
                  <div key={index} style={{ 
                    padding: '12px', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    marginBottom: index < adminData.leave_history.length - 1 ? '12px' : 0,
                    backgroundColor: '#111827'
                  }}>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} md={12}>
                        <div style={{ color: '#9ca3af' }}>Boshlanish sanasi:</div>
                        <div style={{ 
                          color: 'white', 
                          display: 'flex', 
                          alignItems: 'center' 
                        }}>
                          <CalendarOutlined style={{ marginRight: '8px', color: '#faad14' }} />
                          {moment(leave.start_date).format('DD.MM.YYYY')}
                        </div>
                      </Col>
                      <Col xs={24} md={12}>
                        <div style={{ color: '#9ca3af' }}>Tugash sanasi:</div>
                        <div style={{ 
                          color: 'white', 
                          display: 'flex', 
                          alignItems: 'center' 
                        }}>
                          <CalendarOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
                          {moment(leave.end_date).format('DD.MM.YYYY')}
                        </div>
                      </Col>
                    </Row>
                    {leave.reason && (
                      <>
                        <Divider style={{ borderColor: '#374151', margin: '12px 0' }} />
                        <div style={{ color: '#9ca3af' }}>Sabab:</div>
                        <div style={{ color: 'white' }}>{leave.reason}</div>
                      </>
                    )}
                  </div>
                ))}
              </Card>
            )}
          </Col>
        </Row>
      </div>
    </ConfigProvider>
  );
};

export default InfoAdmin;