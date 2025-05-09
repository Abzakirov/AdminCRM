"use client";

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { StudentType } from '@/@types';
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
  Tag,
  Badge
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  BookOutlined,
  SmileOutlined,
  FrownOutlined,
  ExperimentOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { axiosInstance } from '@/hooks/useAxios/useAxios';
import { useTheme } from "next-themes";

const { darkAlgorithm, defaultAlgorithm } = theme;

const StudentInfoComponent = ({ id, initialData = null }: { id: string, initialData?: StudentType | null }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const { theme: nextTheme } = useTheme();

  useEffect(() => {
    if (nextTheme) {
      setIsDarkMode(nextTheme === 'dark');
    }
  }, [nextTheme]);

  // Fetch student data using useQuery
  const { data: studentData, isLoading, error } = useQuery({
    queryKey: ['studentData', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/student/student/${id}`);
      if (response.data && response.data.data) {
        return response.data.data as StudentType;
      }
      throw new Error("Ma'lumot topilmadi");
    },
    initialData: initialData || undefined,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const getStatusColor = (status: string) => {
    if (isDarkMode) {
      switch (status?.toLowerCase()) {
        case "faol":
          return { color: "#52c41a", bg: "rgba(82, 196, 26, 0.2)" };
        case "ta'tilda":
          return { color: "#faad14", bg: "rgba(250, 173, 20, 0.2)" };
        case "yakunladi":
          return { color: "#ff4d4f", bg: "rgba(255, 77, 79, 0.2)" };
        default:
          return { color: "#8c8c8c", bg: "rgba(140, 140, 140, 0.2)" };
      }
    } else {
      switch (status?.toLowerCase()) {
        case "faol":
          return { color: "#389e0d", bg: "rgba(82, 196, 26, 0.1)" };
        case "ta'tilda":
          return { color: "#d48806", bg: "rgba(250, 173, 20, 0.1)" };
        case "yakunladi":
          return { color: "#cf1322", bg: "rgba(255, 77, 79, 0.1)" };
        default:
          return { color: "#595959", bg: "rgba(140, 140, 140, 0.1)" };
      }
    }
  };

  const getSpecializationColor = (specialization: string) => {
    if (isDarkMode) {
      switch (specialization?.toLowerCase()) {
        case "frontend":
          return { color: "#1890ff", bg: "rgba(24, 144, 255, 0.2)" };
        case "backend":
          return { color: "#722ed1", bg: "rgba(114, 46, 209, 0.2)" };
        case "mobile":
          return { color: "#eb2f96", bg: "rgba(235, 47, 150, 0.2)" };
        case "qa":
          return { color: "#fa8c16", bg: "rgba(250, 140, 22, 0.2)" };
        case "devops":
          return { color: "#13c2c2", bg: "rgba(19, 194, 194, 0.2)" };
        default:
          return { color: "#8c8c8c", bg: "rgba(140, 140, 140, 0.2)" };
      }
    } else {
      switch (specialization?.toLowerCase()) {
        case "frontend":
          return { color: "#096dd9", bg: "rgba(24, 144, 255, 0.1)" };
        case "backend":
          return { color: "#531dab", bg: "rgba(114, 46, 209, 0.1)" };
        case "mobile":
          return { color: "#c41d7f", bg: "rgba(235, 47, 150, 0.1)" };
        case "qa":
          return { color: "#d46b08", bg: "rgba(250, 140, 22, 0.1)" };
        case "devops":
          return { color: "#08979c", bg: "rgba(19, 194, 194, 0.1)" };
        default:
          return { color: "#595959", bg: "rgba(140, 140, 140, 0.1)" };
      }
    }
  };

  const themeConfig = {
    dark: {
      bgContainer: "#1f2937",
      bgPage: "#111827",
      borderColor: "#374151",
      textColor: "#ffffff",
      textSecondary: "#d1d5db",
      textTertiary: "#9ca3af",
      headerBg: "#111827",
      accentColor: "#4f46e5",
      cardShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)",
      timelineColor: "#4f46e5",
      cardHoverBg: "#2d3748",
    },
    light: {
      bgContainer: "#ffffff",
      bgPage: "#f9fafb",
      borderColor: "#e5e7eb",
      textColor: "#111827",
      textSecondary: "#4b5563",
      textTertiary: "#6b7280",
      headerBg: "#f3f4f6",
      accentColor: "#4f46e5",
      cardShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      timelineColor: "#4f46e5",
      cardHoverBg: "#f1f5f9",
    }
  };

  const currentTheme = isDarkMode ? themeConfig.dark : themeConfig.light;

  if (isLoading) {
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
        color: isDarkMode ? '#ff4d4f' : '#cf1322'
      }}>
        <h2>Xatolik</h2>
        <p>{(error as any).message || "Ma'lumotni yuklashda xatolik yuz berdi"}</p>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        color: isDarkMode ? '#ff4d4f' : '#cf1322'
      }}>
        <h2>Ma'lumot topilmadi</h2>
      </div>
    );
  }

  const statusStyle = getStatusColor(studentData.status || "");
  const specializationStyle = getSpecializationColor(studentData.specialization || "");
  
  // Assuming these fields might be added to the StudentType
  const specialization = studentData.specialization || "Ma'lumot yo'q"; 
  const group = studentData.group || "Ma'lumot yo'q";

  const startDate = moment(studentData.createdAt);
  const currentDate = moment();
  const studyDuration = moment.duration(currentDate.diff(startDate));
  const years = studyDuration.years();
  const months = studyDuration.months();
  const days = studyDuration.days();

  const studyDurationText = `${years > 0 ? `${years} yil ` : ''}${months > 0 ? `${months} oy ` : ''}${days > 0 ? `${days} kun` : ''}`;

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
        token: {
          colorBgContainer: currentTheme.bgContainer,
          colorBorderSecondary: currentTheme.borderColor,
          colorText: currentTheme.textColor,
          colorTextSecondary: currentTheme.textSecondary,
          borderRadius: 8,
          colorPrimary: currentTheme.accentColor,
        },
        components: {
          Card: {
            headerBg: currentTheme.headerBg,
            colorBorderSecondary: currentTheme.borderColor,
          },
          Descriptions: {
            colorSplit: currentTheme.borderColor,
            colorTextHeading: currentTheme.textTertiary,
          },
          Timeline: {
            colorText: currentTheme.textSecondary,
          },
          Tag: {
            colorBorder: currentTheme.borderColor,
          },
        },
      }}
    >
      <div style={{
        padding: '20px',
        backgroundColor: currentTheme.bgPage,
        minHeight: '100vh',
        transition: 'all 0.3s ease'
      }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card
              style={{
                backgroundColor: currentTheme.bgContainer,
                boxShadow: currentTheme.cardShadow,
                borderRadius: '8px',
                border: `1px solid ${currentTheme.borderColor}`,
                transition: 'all 0.3s ease',
              }}
              hoverable
              bodyStyle={{ padding: '24px' }}
            >
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}>
                <Badge
                  count={
                    <span style={{
                      backgroundColor: statusStyle.color,
                      color: isDarkMode ? '#fff' : '#fff',
                      padding: '0 8px',
                      fontSize: '12px',
                      borderRadius: '10px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}>
                      {(studentData.status || "NOMA'LUM").toUpperCase()}
                    </span>
                  }
                >
                  <Avatar
                    icon={<UserOutlined />}
                    size={120}
                    style={{
                      marginBottom: '16px',
                      backgroundColor: currentTheme.accentColor,
                      border: `4px solid ${currentTheme.borderColor}`,
                      boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
                    }}
                  />
                </Badge>
                <h2 style={{ color: currentTheme.textColor, marginBottom: '4px', fontSize: '22px' }}>
                  {studentData.first_name} {studentData.last_name}
                </h2>
                <p style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: currentTheme.textSecondary,
                  marginBottom: '8px'
                }}>
                  <MailOutlined style={{ marginRight: '8px' }} />
                  {studentData.phone}
                </p>
                
                {/* Specialization Tag */}
                <Tag style={{
                  marginBottom: '12px',
                  color: specializationStyle.color,
                  backgroundColor: specializationStyle.bg,
                  borderColor: specializationStyle.color,
                  padding: '2px 12px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 500,
                  boxShadow: `0 0 8px ${specializationStyle.bg}`,
                }}>
                  <ExperimentOutlined style={{ marginRight: '6px' }} />
                  {specialization}
                </Tag>
                
                <Divider style={{ borderColor: currentTheme.borderColor, margin: '16px 0' }} />
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
                      color: statusStyle.color,
                      backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      marginBottom: '8px',
                      transition: 'all 0.3s ease',
                      transform: 'scale(1)',
                      boxShadow: `0 0 0 rgba(${statusStyle.color}, 0)`,
                      ':hover': {
                        transform: 'scale(1.1)',
                        boxShadow: `0 0 12px ${statusStyle.bg}`,
                      }
                    }}>
                      <ClockCircleOutlined />
                    </div>
                    <div style={{ color: currentTheme.textSecondary }}>
                      {(studentData.status || "NOMA'LUM").toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: currentTheme.accentColor,
                      backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      marginBottom: '8px',
                      transition: 'all 0.3s ease',
                    }}>
                      <TeamOutlined />
                    </div>
                    <div style={{ color: currentTheme.textSecondary }}>
                      O'quvchi
                    </div>
                  </div>
                  <div>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isDarkMode ? '#1890ff' : '#096dd9',
                      backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      marginBottom: '8px',
                      transition: 'all 0.3s ease',
                    }}>
                      <UsergroupAddOutlined />
                    </div>
                    <div style={{ color: currentTheme.textSecondary }}>
                      {group}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card
              title="O'quv davri"
              style={{
                backgroundColor: currentTheme.bgContainer,
                boxShadow: currentTheme.cardShadow,
                borderRadius: '8px',
                border: `1px solid ${currentTheme.borderColor}`,
                marginTop: '16px',
                transition: 'all 0.3s ease',
              }}
              hoverable
              headStyle={{
                borderBottom: `1px solid ${currentTheme.borderColor}`,
                color: currentTheme.textSecondary,
                fontWeight: 600,
                padding: '16px 24px',
              }}
              bodyStyle={{ padding: '24px' }}
            >
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Statistic
                    title="O'qish davomiyligi"
                    value={studyDurationText}
                    valueStyle={{ color: currentTheme.accentColor, fontSize: '18px' }}
                    prefix={<BookOutlined style={{ marginRight: '8px' }} />}
                  />
                </Col>
              </Row>
              <Divider style={{ borderColor: currentTheme.borderColor, margin: '16px 0' }} />
              <Timeline
                items={[
                  {
                    color: currentTheme.accentColor,
                    dot: <SmileOutlined style={{ fontSize: '16px' }} />,
                    children: (
                      <div>
                        <p style={{ margin: 0, fontWeight: 500, color: currentTheme.textColor }}>O'qishni boshlagan</p>
                        <p style={{ margin: 0, color: currentTheme.textTertiary }}>{moment(studentData.createdAt).format('DD.MM.YYYY')}</p>
                      </div>
                    )
                  },
                  ...(studentData.leave_history && studentData.leave_history.length > 0 ?
                    studentData.leave_history.map((leave: any, index: number) => {
                      const isHealthReason = leave.reason.toLowerCase().includes('tobi');
                      return {
                        color: isHealthReason ? (isDarkMode ? '#ff4d4f' : '#cf1322') : (isDarkMode ? '#faad14' : '#d48806'),
                        dot: isHealthReason ? <FrownOutlined style={{ fontSize: '16px' }} /> : <ClockCircleOutlined style={{ fontSize: '16px' }} />,
                        children: (
                          <div key={index}>
                            <p style={{ margin: 0, fontWeight: 500, color: currentTheme.textColor }}>Ta'tilga chiqqan</p>
                            <p style={{ margin: 0, color: currentTheme.textTertiary }}>
                              {moment(leave.start_date).format('DD.MM.YYYY')} - {leave.end_date ? moment(leave.end_date).format('DD.MM.YYYY') : 'Hozirgi kungacha'}
                            </p>
                            {leave.reason && <p style={{ margin: 0, color: currentTheme.textTertiary }}>Sabab: {leave.reason}</p>}
                          </div>
                        )
                      };
                    }) : []
                  )
                ]}
              />
            </Card>
          </Col>
          <Col xs={24} md={16}>
            {/* Group and Specialization Card */}
            <Card
              title="O'quv yo'nalishi va guruh"
              style={{
                backgroundColor: currentTheme.bgContainer,
                boxShadow: currentTheme.cardShadow,
                borderRadius: '8px',
                border: `1px solid ${currentTheme.borderColor}`,
                marginBottom: '16px',
                transition: 'all 0.3s ease',
              }}
              hoverable
              headStyle={{
                borderBottom: `1px solid ${currentTheme.borderColor}`,
                color: currentTheme.textSecondary,
                fontWeight: 600,
                padding: '16px 24px',
              }}
              bodyStyle={{ padding: '24px' }}
            >
              <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                  <div style={{
                    padding: '20px',
                    backgroundColor: isDarkMode ? 'rgba(24, 144, 255, 0.1)' : 'rgba(24, 144, 255, 0.05)',
                    borderRadius: '8px',
                    border: `1px solid ${isDarkMode ? 'rgba(24, 144, 255, 0.3)' : 'rgba(24, 144, 255, 0.2)'}`,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    transition: 'all 0.3s ease',
                  }}
                  className="hover:transform hover:scale-105"
                  >
                    <div style={{
                      backgroundColor: isDarkMode ? 'rgba(24, 144, 255, 0.2)' : 'rgba(24, 144, 255, 0.1)',
                      borderRadius: '50%',
                      width: '64px',
                      height: '64px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: '12px',
                    }}>
                      <ExperimentOutlined style={{ 
                        fontSize: '32px', 
                        color: isDarkMode ? '#1890ff' : '#096dd9' 
                      }} />
                    </div>
                    <h3 style={{ 
                      color: currentTheme.textColor, 
                      marginBottom: '8px',
                      fontSize: '18px'
                    }}>Yo'nalish</h3>
                    <p style={{ 
                      color: isDarkMode ? '#1890ff' : '#096dd9',
                      fontWeight: 600,
                      fontSize: '16px',
                      margin: 0
                    }}>{specialization}</p>
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div style={{
                    padding: '20px',
                    backgroundColor: isDarkMode ? 'rgba(114, 46, 209, 0.1)' : 'rgba(114, 46, 209, 0.05)',
                    borderRadius: '8px',
                    border: `1px solid ${isDarkMode ? 'rgba(114, 46, 209, 0.3)' : 'rgba(114, 46, 209, 0.2)'}`,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    transition: 'all 0.3s ease',
                  }}
                  className="hover:transform hover:scale-105"
                  >
                    <div style={{
                      backgroundColor: isDarkMode ? 'rgba(114, 46, 209, 0.2)' : 'rgba(114, 46, 209, 0.1)',
                      borderRadius: '50%',
                      width: '64px',
                      height: '64px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: '12px',
                    }}>
                      <UsergroupAddOutlined style={{ 
                        fontSize: '32px', 
                        color: isDarkMode ? '#722ed1' : '#531dab' 
                      }} />
                    </div>
                    <h3 style={{ 
                      color: currentTheme.textColor, 
                      marginBottom: '8px',
                      fontSize: '18px'
                    }}>Guruh</h3>
                    <p style={{ 
                      color: isDarkMode ? '#722ed1' : '#531dab',
                      fontWeight: 600,
                      fontSize: '16px',
                      margin: 0
                    }}>{group}</p>
                  </div>
                </Col>
              </Row>
            </Card>
            
            <Card
              title="O'quvchi ma'lumotlari"
              style={{
                backgroundColor: currentTheme.bgContainer,
                boxShadow: currentTheme.cardShadow,
                borderRadius: '8px',
                border: `1px solid ${currentTheme.borderColor}`,
                transition: 'all 0.3s ease',
              }}
              hoverable
              headStyle={{
                borderBottom: `1px solid ${currentTheme.borderColor}`,
                color: currentTheme.textSecondary,
                fontWeight: 600,
                padding: '16px 24px',
              }}
              bodyStyle={{ padding: '24px' }}
            >
              <Descriptions
                bordered
                column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                size="middle"
                labelStyle={{ color: currentTheme.textTertiary }}
                contentStyle={{ color: currentTheme.textColor }}
                style={{
                  backgroundColor: currentTheme.bgContainer,
                }}
              >
                <Descriptions.Item label="Ism">{studentData.first_name}</Descriptions.Item>
                <Descriptions.Item label="Familiya">{studentData.last_name}</Descriptions.Item>
                <Descriptions.Item label="Telefon">{studentData.phone}</Descriptions.Item>
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
                    {(studentData.status || "NOMA'LUM").toUpperCase()}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Yo'nalish">
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 500,
                      color: specializationStyle.color,
                      backgroundColor: specializationStyle.bg,
                      border: `1px solid ${specializationStyle.color}`,
                      boxShadow: `0 0 8px ${specializationStyle.bg}`,
                    }}
                  >
                    {specialization}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Guruh">
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 500,
                      color: isDarkMode ? '#722ed1' : '#531dab',
                      backgroundColor: isDarkMode ? 'rgba(114, 46, 209, 0.2)' : 'rgba(114, 46, 209, 0.1)',
                      border: `1px solid ${isDarkMode ? '#722ed1' : '#531dab'}`,
                      boxShadow: isDarkMode ? '0 0 8px rgba(114, 46, 209, 0.2)' : '0 0 8px rgba(114, 46, 209, 0.1)',
                    }}
                  >
                    {group}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="O'qishni boshlagan sana">
                  {moment(studentData.createdAt).format('DD.MM.YYYY')}
                </Descriptions.Item>
                <Descriptions.Item label="Ro'yxatdan o'tgan sana">
                  {moment(studentData.createdAt).format('DD.MM.YYYY')}
                </Descriptions.Item>
                <Descriptions.Item label="Oxirgi yangilanish">
                  {moment(studentData.updatedAt).format('DD.MM.YYYY')}
                </Descriptions.Item>
              </Descriptions>
            </Card>
            {studentData.leave_history && studentData.leave_history.length > 0 && (
              <Card
                title="Ta'til tarixi"
                style={{
                  backgroundColor: currentTheme.bgContainer,
                  boxShadow: currentTheme.cardShadow,
                  borderRadius: '8px',
                  border: `1px solid ${currentTheme.borderColor}`,
                  marginTop: '16px',
                  transition: 'all 0.3s ease',
                }}
                hoverable
                headStyle={{
                  borderBottom: `1px solid ${currentTheme.borderColor}`,
                  color: currentTheme.textSecondary,
                  fontWeight: 600,
                  padding: '16px 24px',
                }}
                bodyStyle={{ padding: '24px' }}
              >
                {studentData.leave_history.map((leave: any, index: number) => (
                  <div key={index} style={{
                    padding: '16px',
                    border: `1px solid ${currentTheme.borderColor}`,
                    borderRadius: '8px',
                    backgroundColor: isDarkMode ? currentTheme.headerBg : '#f8fafc',
                    marginBottom: index < studentData.leave_history.length - 1 ? '12px' : '0px',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'default',
                    ':hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                    }
                  }}
                  className="hover:shadow-lg hover:-translate-y-1"
                  >
                    <Row gutter={[16, 16]}>
                      <Col xs={24} md={12}>
                        <div style={{ color: currentTheme.textTertiary }}>Boshlanish sanasi:</div>
                        <div style={{
                          color: currentTheme.textColor,
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <CalendarOutlined style={{ marginRight: '8px', color: isDarkMode ? '#faad14' : '#d48806' }} />
                          {moment(leave.start_date).format('DD.MM.YYYY')}
                        </div>
                      </Col>
                      <Col xs={24} md={12}>
                        <div style={{ color: currentTheme.textTertiary }}>Tugash sanasi:</div>
                        <div style={{
                          color: currentTheme.textColor,
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <CalendarOutlined style={{ marginRight: '8px', color: isDarkMode ? '#52c41a' : '#389e0d' }} />
                          {leave.end_date ? moment(leave.end_date).format('DD.MM.YYYY') : 'Hozirgi kungacha'}
                        </div>
                      </Col>
                    </Row>
                    {leave.reason && (
                      <>
                        <Divider style={{ borderColor: currentTheme.borderColor, margin: '12px 0' }} />
                        <div style={{ color: currentTheme.textTertiary }}>Sabab:</div>
                        <div style={{ color: currentTheme.textColor }}>{leave.reason}</div>
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

export default StudentInfoComponent;