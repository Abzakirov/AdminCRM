"use client";

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TeacherType } from '@/@types';
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
  message,
  Badge
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TeamOutlined,
  TrophyOutlined,
  DollarOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { axiosInstance } from '@/hooks/useAxios/useAxios';
import { useTheme } from "next-themes";

const { darkAlgorithm, defaultAlgorithm } = theme;

const TeacherInfoComponents = ({ id, initialData = null }: { id: string, initialData?: TeacherType | null }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const { theme: nextTheme } = useTheme();
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    if (nextTheme) {
      setIsDarkMode(nextTheme === 'dark');
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 400);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [nextTheme]);

  // Fetch teacher data using useQuery
  const { data: teacherData, isLoading, error } = useQuery({
    queryKey: ['teacherData', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/teacher/get-teacher/${id}`);
      if (response.data && response.data.data) {
        return response.data.data as TeacherType;
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
        case "ishdan bo'shatilgan":
          return { color: "#ff4d4f", bg: "rgba(255, 77, 79, 0.2)" };
        default:
          return { color: "#ff4d4f", bg: "rgba(255, 77, 79, 0.2)" };
      }
    } else {
      switch (status?.toLowerCase()) {
        case "faol":
          return { color: "#389e0d", bg: "rgba(82, 196, 26, 0.1)" };
        case "ta'tilda":
          return { color: "#d48806", bg: "rgba(250, 173, 20, 0.1)" };
        case "ishdan bo'shatilgan":
          return { color: "#cf1322", bg: "rgba(255, 77, 79, 0.1)" };
        default:
          return { color: "#cf1322", bg: "rgba(255, 77, 79, 0.1)" };
      }
    }
  };

  const getActiveStatus = (active: boolean) => {
    if (isDarkMode) {
      return active
        ? { color: "#52c41a", text: "Faol", icon: <CheckCircleOutlined /> }
        : { color: "#ff4d4f", text: "Faol emas", icon: <CloseCircleOutlined /> };
    } else {
      return active
        ? { color: "#389e0d", text: "Faol", icon: <CheckCircleOutlined /> }
        : { color: "#cf1322", text: "Faol emas", icon: <CloseCircleOutlined /> };
    }
  };

  const getFieldColor = (field: string) => {
    if (isDarkMode) {
      switch (field?.split(' ')[0]?.toLowerCase()) {
        case "frontend":
          return { color: "#1890ff", bg: "rgba(24, 144, 255, 0.2)" };
        case "backend":
          return { color: "#722ed1", bg: "rgba(114, 46, 209, 0.2)" };
        case "ui/ux":
          return { color: "#eb2f96", bg: "rgba(235, 47, 150, 0.2)" };
        case "android":
          return { color: "#52c41a", bg: "rgba(82, 196, 26, 0.2)" };
        case "ios":
          return { color: "#fa8c16", bg: "rgba(250, 140, 22, 0.2)" };
        default:
          return { color: "#13c2c2", bg: "rgba(19, 194, 194, 0.2)" };
      }
    } else {
      switch (field?.split(' ')[0]?.toLowerCase()) {
        case "frontend":
          return { color: "#096dd9", bg: "rgba(24, 144, 255, 0.1)" };
        case "backend":
          return { color: "#531dab", bg: "rgba(114, 46, 209, 0.1)" };
        case "ui/ux":
          return { color: "#c41d7f", bg: "rgba(235, 47, 150, 0.1)" };
        case "android":
          return { color: "#389e0d", bg: "rgba(82, 196, 26, 0.1)" };
        case "ios":
          return { color: "#d46b08", bg: "rgba(250, 140, 22, 0.1)" };
        default:
          return { color: "#08979c", bg: "rgba(19, 194, 194, 0.1)" };
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

  if (!teacherData) {
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

  const statusStyle = getStatusColor(teacherData.status);
  const activeStatus = getActiveStatus(!teacherData.is_deleted);
  const fieldStyle = getFieldColor(teacherData.field);

  const workStartDate = moment(teacherData.work_date);
  const workEndDate = teacherData.work_end ? moment(teacherData.work_end) : moment();
  const workDuration = moment.duration(workEndDate.diff(workStartDate));
  const years = workDuration.years();
  const months = workDuration.months();
  const days = workDuration.days();

  const workDurationText = `${years > 0 ? `${years} yil ` : ''}${months > 0 ? `${months} oy ` : ''}${days > 0 ? `${days} kun` : ''}`;

  // Count active and inactive groups
  const activeGroups = teacherData.groups ? teacherData.groups.filter((group: any) => !group.is_deleted).length : 0;
  const inactiveGroups = teacherData.groups ? teacherData.groups.filter((group: any) => group.is_deleted).length : 0;
  
  // Count total students
  const totalStudents = teacherData.groups ? 
    teacherData.groups.reduce((acc: number, group: any) => acc + (group.students ? group.students.length : 0), 0) : 0;

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
        },
      }}
    >
      <div style={{
        padding: isMobile ? '12px' : '20px',
        backgroundColor: currentTheme.bgPage,
        minHeight: '100vh',
        transition: 'all 0.3s ease'
      }}>
        <Row gutter={[isMobile ? 8 : 16, isMobile ? 8 : 16]}>
          <Col xs={24} md={8}>
            <Card
              style={{
                backgroundColor: currentTheme.bgContainer,
                boxShadow: currentTheme.cardShadow,
                borderRadius: '8px',
                border: `1px solid ${currentTheme.borderColor}`,
              }}
            >
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}>
                {teacherData.image ? (
                  <Avatar
                    src={teacherData.image}
                    size={isMobile ? 80 : 120}
                    style={{ 
                      marginBottom: isMobile ? '12px' : '16px', 
                      border: `4px solid ${currentTheme.borderColor}` 
                    }}
                  />
                ) : (
                  <Avatar
                    icon={<UserOutlined />}
                    size={isMobile ? 80 : 120}
                    style={{
                      marginBottom: isMobile ? '12px' : '16px',
                      backgroundColor: currentTheme.accentColor,
                      border: `4px solid ${currentTheme.borderColor}`
                    }}
                  />
                )}
                <h2 style={{ 
                  color: currentTheme.textColor, 
                  marginBottom: '4px',
                  fontSize: isMobile ? '18px' : '24px'
                }}>
                  {teacherData.first_name} {teacherData.last_name}
                </h2>
                <div style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: isMobile ? '12px' : '14px',
                  fontWeight: 500,
                  textTransform: 'capitalize',
                  color: fieldStyle.color,
                  backgroundColor: fieldStyle.bg,
                  border: `1px solid ${fieldStyle.color}`,
                  boxShadow: `0 0 8px ${fieldStyle.bg}`,
                  marginBottom: isMobile ? '12px' : '16px'
                }}>
                  {teacherData.field}
                </div>
                <p style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: currentTheme.textSecondary,
                  marginBottom: '8px',
                  fontSize: isMobile ? '13px' : '14px'
                }}>
                  <MailOutlined style={{ marginRight: '8px' }} />
                  {teacherData.email}
                </p>
                <p style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: currentTheme.textSecondary,
                  marginBottom: '8px',
                  fontSize: isMobile ? '13px' : '14px'
                }}>
                  <PhoneOutlined style={{ marginRight: '8px' }} />
                  {teacherData.phone}
                </p>
                <Divider style={{ 
                  borderColor: currentTheme.borderColor, 
                  margin: isMobile ? '12px 0' : '16px 0' 
                }} />
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
                      backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)',
                      borderRadius: '50%',
                      width: isMobile ? '32px' : '40px',
                      height: isMobile ? '32px' : '40px',
                      marginBottom: '8px'
                    }}>
                      {activeStatus.icon}
                    </div>
                    <div style={{ 
                      color: currentTheme.textSecondary,
                      fontSize: isMobile ? '12px' : '14px'
                    }}>
                      {activeStatus.text}
                    </div>
                  </div>
                  <div>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: statusStyle.color,
                      backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)',
                      borderRadius: '50%',
                      width: isMobile ? '32px' : '40px',
                      height: isMobile ? '32px' : '40px',
                      marginBottom: '8px'
                    }}>
                      <ClockCircleOutlined />
                    </div>
                    <div style={{ 
                      color: currentTheme.textSecondary,
                      fontSize: isMobile ? '12px' : '14px'
                    }}>
                      {teacherData.status.toUpperCase()}
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
                      width: isMobile ? '32px' : '40px',
                      height: isMobile ? '32px' : '40px',
                      marginBottom: '8px'
                    }}>
                      <TeamOutlined />
                    </div>
                    <div style={{ 
                      color: currentTheme.textSecondary,
                      fontSize: isMobile ? '12px' : '14px'
                    }}>
                      O'qituvchi
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            <Card
              title="Ish tajribasi"
              style={{
                backgroundColor: currentTheme.bgContainer,
                boxShadow: currentTheme.cardShadow,
                borderRadius: '8px',
                border: `1px solid ${currentTheme.borderColor}`,
                marginTop: isMobile ? '12px' : '16px'
              }}
              headStyle={{
                borderBottom: `1px solid ${currentTheme.borderColor}`,
                color: currentTheme.textSecondary,
                fontWeight: 600,
                fontSize: isMobile ? '14px' : 'inherit'
              }}
            >
              <Row gutter={[isMobile ? 8 : 16, isMobile ? 8 : 16]}>
                <Col span={24}>
                  <Statistic
                    title="Ish tajribasi"
                    value={workDurationText}
                    valueStyle={{ 
                      color: currentTheme.accentColor,
                      fontSize: isMobile ? '16px' : '24px'
                    }}
                    prefix={<TrophyOutlined />}
                  />
                </Col>
                {teacherData.salary > 0 && (
                  <Col span={24}>
                    <Statistic
                      title="Oylik maosh"
                      value={teacherData.salary.toLocaleString()}
                      valueStyle={{ 
                        color: '#52c41a',
                        fontSize: isMobile ? '16px' : '24px'
                      }}
                      prefix={<DollarOutlined />}
                      suffix="UZS"
                    />
                  </Col>
                )}
              </Row>
              <Divider style={{ 
                borderColor: currentTheme.borderColor, 
                margin: isMobile ? '12px 0' : '16px 0' 
              }} />
              <Timeline
                items={[
                  {
                    color: currentTheme.accentColor,
                    children: (
                      <div>
                        <p style={{ 
                          margin: 0, 
                          fontWeight: 500, 
                          color: currentTheme.textColor,
                          fontSize: isMobile ? '14px' : 'inherit'
                        }}>
                          Ishga qabul qilingan
                        </p>
                        <p style={{ 
                          margin: 0, 
                          color: currentTheme.textTertiary,
                          fontSize: isMobile ? '12px' : 'inherit'
                        }}>
                          {moment(teacherData.work_date).format('DD.MM.YYYY')}
                        </p>
                      </div>
                    )
                  },
                  ...(teacherData.work_end ? [
                    {
                      color: isDarkMode ? '#f5222d' : '#cf1322',
                      children: (
                        <div>
                          <p style={{ 
                            margin: 0, 
                            fontWeight: 500, 
                            color: currentTheme.textColor,
                            fontSize: isMobile ? '14px' : 'inherit'
                          }}>
                            Ishdan ketgan
                          </p>
                          <p style={{ 
                            margin: 0, 
                            color: currentTheme.textTertiary,
                            fontSize: isMobile ? '12px' : 'inherit'
                          }}>
                            {moment(teacherData.work_end).format('DD.MM.YYYY')}
                          </p>
                        </div>
                      )
                    }
                  ] : [])
                ]}
              />
            </Card>
            
            <Card
              title="Guruhlar statistikasi"
              style={{
                backgroundColor: currentTheme.bgContainer,
                boxShadow: currentTheme.cardShadow,
                borderRadius: '8px',
                border: `1px solid ${currentTheme.borderColor}`,
                marginTop: isMobile ? '12px' : '16px'
              }}
              headStyle={{
                borderBottom: `1px solid ${currentTheme.borderColor}`,
                color: currentTheme.textSecondary,
                fontWeight: 600,
                fontSize: isMobile ? '14px' : 'inherit'
              }}
            >
              <Row gutter={[isMobile ? 8 : 16, isMobile ? 8 : 16]}>
                <Col span={24}>
                  <Statistic
                    title="Jami guruhlar"
                    value={teacherData.groups ? teacherData.groups.length : 0}
                    valueStyle={{ 
                      color: currentTheme.accentColor,
                      fontSize: isMobile ? '16px' : '24px'
                    }}
                    prefix={<TeamOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Faol guruhlar"
                    value={activeGroups}
                    valueStyle={{ 
                      color: isDarkMode ? '#52c41a' : '#389e0d',
                      fontSize: isMobile ? '16px' : '24px'
                    }}
                    prefix={<CheckCircleOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Yopiq guruhlar"
                    value={inactiveGroups}
                    valueStyle={{ 
                      color: isDarkMode ? '#ff4d4f' : '#cf1322',
                      fontSize: isMobile ? '16px' : '24px'
                    }}
                    prefix={<CloseCircleOutlined />}
                  />
                </Col>
                <Col span={24}>
                  <Statistic
                    title="Jami o'quvchilar"
                    value={totalStudents}
                    valueStyle={{ 
                      color: isDarkMode ? '#faad14' : '#d48806',
                      fontSize: isMobile ? '16px' : '24px'
                    }}
                    prefix={<UserOutlined />}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xs={24} md={16}>
            <Card
              title="O'qituvchi ma'lumotlari"
              style={{
                backgroundColor: currentTheme.bgContainer,
                boxShadow: currentTheme.cardShadow,
                borderRadius: '8px',
                border: `1px solid ${currentTheme.borderColor}`,
              }}
              headStyle={{
                borderBottom: `1px solid ${currentTheme.borderColor}`,
                color: currentTheme.textSecondary,
                fontWeight: 600,
                fontSize: isMobile ? '14px' : 'inherit'
              }}
            >
              <Descriptions
                bordered
                column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                size={isMobile ? 'small' : 'middle'}
                labelStyle={{ 
                  color: currentTheme.textTertiary,
                  fontSize: isMobile ? '12px' : 'inherit'
                }}
                contentStyle={{ 
                  color: currentTheme.textColor,
                  fontSize: isMobile ? '13px' : 'inherit'
                }}
                style={{
                  backgroundColor: currentTheme.bgContainer,
                }}
              >
                <Descriptions.Item label="Ism">{teacherData.first_name}</Descriptions.Item>
                <Descriptions.Item label="Familiya">{teacherData.last_name}</Descriptions.Item>
                <Descriptions.Item label="Email">{teacherData.email}</Descriptions.Item>
                <Descriptions.Item label="Telefon">{teacherData.phone}</Descriptions.Item>
                <Descriptions.Item label="Status">
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: isMobile ? '11px' : '12px',
                      fontWeight: 500,
                      color: statusStyle.color,
                      backgroundColor: statusStyle.bg,
                      border: `1px solid ${statusStyle.color}`,
                      boxShadow: `0 0 8px ${statusStyle.bg}`,
                    }}
                  >
                    {teacherData.status.toUpperCase()}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Ta'lim yo'nalishi">
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: isMobile ? '11px' : '12px',
                      fontWeight: 500,
                      textTransform: 'capitalize',
                      color: fieldStyle.color,
                      backgroundColor: fieldStyle.bg,
                      border: `1px solid ${fieldStyle.color}`,
                      boxShadow: `0 0 8px ${fieldStyle.bg}`,
                    }}
                  >
                    {teacherData.field}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Faol holati">
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: isMobile ? '11px' : '12px',
                      fontWeight: 500,
                      color: activeStatus.color,
                      backgroundColor: `${activeStatus.color}20`,
                      border: `1px solid ${activeStatus.color}`,
                      boxShadow: `0 0 8px ${activeStatus.color}20`,
                    }}
                  >
                    {!teacherData.is_deleted ? "HA" : "YO'Q"}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Ishga kirgan sana">
                  {moment(teacherData.work_date).format('DD.MM.YYYY')}
                </Descriptions.Item>
                {teacherData.work_end && (
                  <Descriptions.Item label="Ishdan ketgan sana">
                    {moment(teacherData.work_end).format('DD.MM.YYYY')}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Ro'yxatdan o'tgan sana">
                  {moment(teacherData.createdAt).format('DD.MM.YYYY')}
                </Descriptions.Item>
                <Descriptions.Item label="Oxirgi yangilanish">
                  {moment(teacherData.updatedAt).format('DD.MM.YYYY')}
                </Descriptions.Item>
                {teacherData.salary > 0 && (
                  <Descriptions.Item label="Oylik maosh">
                    {teacherData.salary.toLocaleString()} UZS
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>
            
            {teacherData.groups && teacherData.groups.length > 0 && (
              <Card
                title="Guruhlar"
                style={{
                  backgroundColor: currentTheme.bgContainer,
                  boxShadow: currentTheme.cardShadow,
                  borderRadius: '8px',
                  border: `1px solid ${currentTheme.borderColor}`,
                  marginTop: isMobile ? '12px' : '16px'
                }}
                headStyle={{
                  borderBottom: `1px solid ${currentTheme.borderColor}`,
                  color: currentTheme.textSecondary,
                  fontWeight: 600,
                  fontSize: isMobile ? '14px' : 'inherit'
                }}
              >
                <Row gutter={[isMobile ? 8 : 16, isMobile ? 8 : 16]}>
                  {teacherData.groups.map((group: any, index: number) => (
                    <Col xs={24} sm={12} lg={8} key={index}>
                      <Card
                        size="small"
                        title={group.name}
                        style={{
                          backgroundColor: isDarkMode ? currentTheme.headerBg : '#f8fafc',
                          border: `1px solid ${currentTheme.borderColor}`,
                          borderRadius: '8px',
                          height: '100%'
                        }}
                        headStyle={{
                          borderBottom: `1px solid ${currentTheme.borderColor}`,
                          color: currentTheme.textSecondary,
                          fontWeight: 500,
                          fontSize: isMobile ? '13px' : 'inherit'
                        }}
                        extra={
                          <Badge 
                            status={group.is_deleted ? "error" : "success"} 
                            text={group.is_deleted ? "Yopiq" : "Faol"} 
                            style={{ 
                              color: group.is_deleted ? 
                                (isDarkMode ? '#ff4d4f' : '#cf1322') : 
                                (isDarkMode ? '#52c41a' : '#389e0d'),
                              fontSize: isMobile ? '11px' : 'inherit'
                            }}
                          />
                        }
                      >
                        <div style={{ 
                          color: currentTheme.textTertiary,
                          fontSize: isMobile ? '12px' : 'inherit'
                        }}>
                          O'quvchilar soni:
                        </div>
                        <div style={{ 
                          color: currentTheme.textColor, 
                          fontSize: isMobile ? '16px' : '18px', 
                          fontWeight: 500,
                          marginBottom: '8px' 
                        }}>
                          {group.students?.length || 0}
                        </div>
                        <div style={{ 
                          color: currentTheme.textTertiary,
                          fontSize: isMobile ? '12px' : 'inherit'
                        }}>
                          Boshlangan sana:
                        </div>
                        <div style={{ 
                          color: currentTheme.textColor,
                          marginBottom: '8px',
                          fontSize: isMobile ? '13px' : 'inherit'
                        }}>
                          {moment(group.started_group).format('DD.MM.YYYY')}
                        </div>
                        {group.end_group && (
                          <>
                            <div style={{ 
                              color: currentTheme.textTertiary,
                              fontSize: isMobile ? '12px' : 'inherit'
                            }}>
                              Yakunlangan sana:
                            </div>
                            <div style={{ 
                              color: currentTheme.textColor,
                              fontSize: isMobile ? '13px' : 'inherit'
                            }}>
                              {moment(group.end_group).format('DD.MM.YYYY')}
                            </div>
                          </>
                        )}
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            )}
          </Col>
        </Row>
      </div>
    </ConfigProvider>
  );
};

export default TeacherInfoComponents;
// //
// "use client";

// import { useEffect, useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { TeacherType, GroupType } from '@/@types';
// import {
//     Card,
//     Avatar,
//     Descriptions,
//     Spin,
//     Divider,
//     Row,
//     Col,
//     ConfigProvider,
//     theme,
//     Timeline,
//     Statistic,
//     Badge
// } from 'antd';
// import {
//     UserOutlined,
//     MailOutlined,
//     PhoneOutlined,
//     // CalendarOutlined, // Removed as it's unused
//     ClockCircleOutlined,
//     CheckCircleOutlined,
//     CloseCircleOutlined,
//     TeamOutlined,
//     TrophyOutlined,
//     DollarOutlined
// } from '@ant-design/icons';
// import moment from 'moment';
// import { axiosInstance } from '@/hooks/useAxios/useAxios';
// import { useTheme } from "next-themes";

// const { darkAlgorithm, defaultAlgorithm } = theme;

// interface TeacherInfoProps {
//     id: string;
//     initialData?: TeacherType | null;
// }

// const TeacherInfoComponents = ({ id, initialData = null }: TeacherInfoProps) => {
//     const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
//     const { theme: nextTheme } = useTheme();
//     const [isMobile, setIsMobile] = useState<boolean>(false);

//     useEffect(() => {
//         if (nextTheme) {
//             setIsDarkMode(nextTheme === 'dark');
//         }

//         const handleResize = () => {
//             setIsMobile(window.innerWidth < 400);
//         };

//         handleResize();
//         window.addEventListener('resize', handleResize);
//         return () => window.removeEventListener('resize', handleResize);

//     }, [nextTheme]);

//     // Fetch teacher data using useQuery
//     const { data: teacherData, isLoading, error } = useQuery<TeacherType, Error>({ // Specify error type
//         queryKey: ['teacherData', id],
//         queryFn: async () => {
//             const response = await axiosInstance.get(`/teacher/get-teacher/${id}`);
//             if (response.data && response.data.data) {
//                 return response.data.data as TeacherType;
//             }
//             throw new Error("Ma'lumot topilmadi");
//         },
//         initialData: initialData || undefined,
//         staleTime: 5 * 60 * 1000,
//         refetchInterval: 10 * 60 * 1000,
//         refetchOnWindowFocus: true,
//     });

//     const getStatusColor = (status: string | undefined) => { // Handle undefined status
//         if (isDarkMode) {
//             switch (status?.toLowerCase()) {
//                 case "faol":
//                     return { color: "#52c41a", bg: "rgba(82, 196, 26, 0.2)" };
//                 case "ta'tilda":
//                     return { color: "#faad14", bg: "rgba(250, 173, 20, 0.2)" };
//                 case "ishdan bo'shatilgan":
//                     return { color: "#ff4d4f", bg: "rgba(255, 77, 79, 0.2)" };
//                 default:
//                     return { color: "#ff4d4f", bg: "rgba(255, 77, 79, 0.2)" };
//             }
//         } else {
//             switch (status?.toLowerCase()) {
//                 case "faol":
//                     return { color: "#389e0d", bg: "rgba(82, 196, 26, 0.1)" };
//                 case "ta'tilda":
//                     return { color: "#d48806", bg: "rgba(250, 173, 20, 0.1)" };
//                 case "ishdan bo'shatilgan":
//                     return { color: "#cf1322", bg: "rgba(255, 77, 79, 0.1)" };
//                 default:
//                     return { color: "#cf1322", bg: "rgba(255, 77, 79, 0.1)" };
//             }
//         }
//     };

//     const getActiveStatus = (active: boolean) => {
//         if (isDarkMode) {
//             return active
//                 ? { color: "#52c41a", text: "Faol", icon: <CheckCircleOutlined /> }
//                 : { color: "#ff4d4f", text: "Faol emas", icon: <CloseCircleOutlined /> };
//         } else {
//             return active
//                 ? { color: "#389e0d", text: "Faol", icon: <CheckCircleOutlined /> }
//                 : { color: "#cf1322", text: "Faol emas", icon: <CloseCircleOutlined /> };
//         }
//     };

//     const getFieldColor = (field: string | undefined) => { // Handle undefined field
//         if (isDarkMode) {
//             switch (field?.split(' ')[0]?.toLowerCase()) { // Handle potential undefined field
//                 case "frontend":
//                     return { color: "#1890ff", bg: "rgba(24, 144, 255, 0.2)" };
//                 case "backend":
//                     return { color: "#722ed1", bg: "rgba(114, 46, 209, 0.2)" };
//                 case "ui/ux":
//                     return { color: "#eb2f96", bg: "rgba(235, 47, 150, 0.2)" };
//                 case "android":
//                     return { color: "#52c41a", bg: "rgba(82, 196, 26, 0.2)" };
//                 case "ios":
//                     return { color: "#fa8c16", bg: "rgba(250, 140, 22, 0.2)" };
//                 default:
//                     return { color: "#13c2c2", bg: "rgba(19, 194, 194, 0.2)" };
//             }
//         } else {
//             switch (field?.split(' ')[0]?.toLowerCase()) { // Handle potential undefined field
//                 case "frontend":
//                     return { color: "#096dd9", bg: "rgba(24, 144, 255, 0.1)" };
//                 case "backend":
//                     return { color: "#531dab", bg: "rgba(114, 46, 209, 0.1)" };
//                 case "ui/ux":
//                     return { color: "#c41d7f", bg: "rgba(235, 47, 150, 0.1)" };
//                 case "android":
//                     return { color: "#389e0d", bg: "rgba(82, 196, 26, 0.1)" };
//                 case "ios":
//                     return { color: "#d46b08", bg: "rgba(250, 140, 22, 0.1)" };
//                 default:
//                     return { color: "#08979c", bg: "rgba(19, 194, 194, 0.1)" };
//             }
//         }
//     };

//     const themeConfig = {
//         dark: {
//             bgContainer: "#1f2937",
//             bgPage: "#111827",
//             borderColor: "#374151",
//             textColor: "#ffffff",
//             textSecondary: "#d1d5db",
//             textTertiary: "#9ca3af",
//             headerBg: "#111827",
//             accentColor: "#4f46e5",
//             cardShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)",
//             timelineColor: "#4f46e5",
//         },
//         light: {
//             bgContainer: "#ffffff",
//             bgPage: "#f9fafb",
//             borderColor: "#e5e7eb",
//             textColor: "#111827",
//             textSecondary: "#4b5563",
//             textTertiary: "#6b7280",
//             headerBg: "#f3f4f6",
//             accentColor: "#4f46e5",
//             cardShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
//             timelineColor: "#4f46e5",
//         }
//     };

//     const currentTheme = isDarkMode ? themeConfig.dark : themeConfig.light;

//     if (isLoading) {
//         return (
//             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//                 <Spin size="large" />
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div style={{
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 height: '100vh',
//                 flexDirection: 'column',
//                 color: isDarkMode ? '#ff4d4f' : '#cf1322'
//             }}>
//                 <h2>Xatolik</h2>
//                 <p>{error.message || "Ma'lumotni yuklashda xatolik yuz berdi"}</p>
//             </div>
//         );
//     }

//     if (!teacherData) {
//         return (
//             <div style={{
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 height: '100vh',
//                 flexDirection: 'column',
//                 color: isDarkMode ? '#ff4d4f' : '#cf1322'
//             }}>
//                 <h2>Ma'lumot topilmadi</h2>
//             </div>
//         );
//     }

//     const statusStyle = getStatusColor(teacherData.status);
//     const activeStatus = getActiveStatus(!teacherData.is_deleted);
//     const fieldStyle = getFieldColor(teacherData.field);

//     const workStartDate = moment(teacherData.work_date);
//     const workEndDate = teacherData.work_end ? moment(teacherData.work_end) : moment();
//     const workDuration = moment.duration(workEndDate.diff(workStartDate));
//     const years = workDuration.years();
//     const months = workDuration.months();
//     const days = workDuration.days();

//     const workDurationText = `${years > 0 ? `${years} yil ` : ''}${months > 0 ? `${months} oy ` : ''}${days > 0 ? `${days} kun` : ''}`;

//     // Count active and inactive groups
//     const activeGroups = teacherData.groups ? teacherData.groups.filter((group: GroupType) => !group.is_deleted).length : 0; // Specify GroupType
//     const inactiveGroups = teacherData.groups ? teacherData.groups.filter((group: GroupType) => group.is_deleted).length : 0; // Specify GroupType

//     // Count total students
//     const totalStudents = teacherData.groups ?
//         teacherData.groups.reduce((acc: number, group: GroupType) => acc + (group.students ? group.students.length : 0), 0) : 0; // Specify GroupType

//     return (
//         <ConfigProvider
//             theme={{
//                 algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
//                 token: {
//                     colorBgContainer: currentTheme.bgContainer,
//                     colorBorderSecondary: currentTheme.borderColor,
//                     colorText: currentTheme.textColor,
//                     colorTextSecondary: currentTheme.textSecondary,
//                     borderRadius: 8,
//                     colorPrimary: currentTheme.accentColor,
//                 },
//                 components: {
//                     Card: {
//                         headerBg: currentTheme.headerBg,
//                         colorBorderSecondary: currentTheme.borderColor,
//                     },
//                     Descriptions: {
//                         colorSplit: currentTheme.borderColor,
//                         colorTextHeading: currentTheme.textTertiary,
//                     },
//                     Timeline: {
//                         colorText: currentTheme.textSecondary,
//                     },
//                 },
//             }}
//         >
//             <div style={{
//                 padding: isMobile ? '12px' : '20px',
//                 backgroundColor: currentTheme.bgPage,
//                 minHeight: '100vh',
//                 transition: 'all 0.3s ease'
//             }}>
//                 <Row gutter={[isMobile ? 8 : 16, isMobile ? 8 : 16]}>
//                     <Col xs={24} md={8}>
//                         <Card
//                             style={{
//                                 backgroundColor: currentTheme.bgContainer,
//                                 boxShadow: currentTheme.cardShadow,
//                                 borderRadius: '8px',
//                                 border: `1px solid ${currentTheme.borderColor}`,
//                             }}
//                         >
//                             <div style={{
//                                 display: 'flex',
//                                 flexDirection: 'column',
//                                 alignItems: 'center',
//                                 textAlign: 'center'
//                             }}>
//                                 {teacherData.image ? (
//                                     <Avatar
//                                         src={teacherData.image}
//                                         size={isMobile ? 80 : 120}
//                                         style={{
//                                             marginBottom: isMobile ? '12px' : '16px',
//                                             border: `4px solid ${currentTheme.borderColor}`
//                                         }}
//                                     />
//                                 ) : (
//                                     <Avatar
//                                         icon={<UserOutlined />}
//                                         size={isMobile ? 80 : 120}
//                                         style={{
//                                             marginBottom: isMobile ? '12px' : '16px',
//                                             backgroundColor: currentTheme.accentColor,
//                                             border: `4px solid ${currentTheme.borderColor}`
//                                         }}
//                                     />
//                                 )}
//                                 <h2 style={{
//                                     color: currentTheme.textColor,
//                                     marginBottom: '4px',
//                                     fontSize: isMobile ? '18px' : '24px'
//                                 }}>
//                                     {teacherData.first_name} {teacherData.last_name}
//                                 </h2>
//                                 <div style={{
//                                     display: 'inline-block',
//                                     padding: '4px 12px',
//                                     borderRadius: '20px',
//                                     fontSize: isMobile ? '12px' : '14px',
//                                     fontWeight: 500,
//                                     textTransform: 'capitalize',
//                                     color: fieldStyle.color,
//                                     backgroundColor: fieldStyle.bg,
//                                     border: `1px solid ${fieldStyle.color}`,
//                                     boxShadow: `0 0 8px ${fieldStyle.bg}`,
//                                     marginBottom: isMobile ? '12px' : '16px'
//                                 }}>
//                                     {teacherData.field}
//                                 </div>
//                                 <p style={{
//                                     display: 'flex',
//                                     alignItems: 'center',
//                                     color: currentTheme.textSecondary,
//                                     marginBottom: '8px',
//                                     fontSize: isMobile ? '13px' : '14px'
//                                 }}>
//                                     <MailOutlined style={{ marginRight: '8px' }} />
//                                     {teacherData.email}
//                                 </p>
//                                 <p style={{
//                                     display: 'flex',
//                                     alignItems: 'center',
//                                     color: currentTheme.textSecondary,
//                                     marginBottom: '8px',
//                                     fontSize: isMobile ? '13px' : '14px'
//                                 }}>
//                                     <PhoneOutlined style={{ marginRight: '8px' }} />
//                                     {teacherData.phone}
//                                 </p>
//                                 <Divider style={{
//                                     borderColor: currentTheme.borderColor,
//                                     margin: isMobile ? '12px 0' : '16px 0'
//                                 }} />
//                                 <div style={{
//                                     display: 'flex',
//                                     width: '100%',
//                                     justifyContent: 'space-around'
//                                 }}>
//                                     <div>
//                                         <div style={{
//                                             display: 'inline-flex',
//                                             alignItems: 'center',
//                                             justifyContent: 'center',
//                                             color: activeStatus.color,
//                                             backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)',
//                                             borderRadius: '50%',
//                                             width: isMobile ? '32px' : '40px',
//                                             height: isMobile ? '32px' : '40px',
//                                             marginBottom: '8px'
//                                         }}>
//                                             {activeStatus.icon}
//                                         </div>
//                                         <div style={{
//                                             color: currentTheme.textSecondary,
//                                             fontSize: isMobile ? '12px' : '14px'
//                                         }}>
//                                             {activeStatus.text}
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <div style={{
//                                             display: 'inline-flex',
//                                             alignItems: 'center',
//                                             justifyContent: 'center',
//                                             color: statusStyle.color,
//                                             backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)',
//                                             borderRadius: '50%',
//                                             width: isMobile ? '32px' : '40px',
//                                             height: isMobile ? '32px' : '40px',
//                                             marginBottom: '8px'
//                                         }}>
//                                             <ClockCircleOutlined />
//                                         </div>
//                                         <div style={{
//                                             color: currentTheme.textSecondary,
//                                             fontSize: isMobile ? '12px' : '14px'
//                                         }}>
//                                             {teacherData.status.toUpperCase()}
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <div style={{
//                                             display: 'inline-flex',
//                                             alignItems: 'center',
//                                             justifyContent: 'center',
//                                             color: currentTheme.accentColor,
//                                             backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)',
//                                             borderRadius: '50%',
//                                             width: isMobile ? '32px' : '40px',
//                                             height: isMobile ? '32px' : '40px',
//                                             marginBottom: '8px'
//                                         }}>
//                                             <TeamOutlined />
//                                         </div>
//                                         <div style={{
//                                             color: currentTheme.textSecondary,
//                                             fontSize: isMobile ? '12px' : '14px'
//                                         }}>
//                                             O'qituvchi
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </Card>
//                         <Card
//                             title="Ish tajribasi"
//                             style={{
//                                 backgroundColor: currentTheme.bgContainer,
//                                 boxShadow: currentTheme.cardShadow,
//                                 borderRadius: '8px',
//                                 border: `1px solid ${currentTheme.borderColor}`,
//                                 marginTop: isMobile ? '12px' : '16px'
//                             }}
//                             headStyle={{
//                                 borderBottom: `1px solid ${currentTheme.borderColor}`,
//                                 color: currentTheme.textSecondary,
//                                 fontWeight: 600,
//                                 fontSize: isMobile ? '14px' : 'inherit'
//                             }}
//                         >
//                             <Row gutter={[isMobile ? 8 : 16, isMobile ? 8 : 16]}>
//                                 <Col span={24}>
//                                     <Statistic
//                                         title="Ish tajribasi"
//                                         value={workDurationText}
//                                         valueStyle={{
//                                             color: currentTheme.accentColor,
//                                             fontSize: isMobile ? '16px' : '24px'
//                                         }}
//                                         prefix={<TrophyOutlined />}
//                                     />
//                                 </Col>
//                                 {teacherData.salary > 0 && (
//                                     <Col span={24}>
//                                         <Statistic
//                                             title="Oylik maosh"
//                                             value={teacherData.salary.toLocaleString()}
//                                             valueStyle={{
//                                                 color: '#52c41a',
//                                                 fontSize: isMobile ? '16px' : '24px'
//                                             }}
//                                             prefix={<DollarOutlined />}
//                                             suffix="UZS"
//                                         />
//                                     </Col>
//                                 )}
//                             </Row>
//                             <Divider style={{
//                                 borderColor: currentTheme.borderColor,
//                                 margin: isMobile ? '12px 0' : '16px 0'
//                             }} />
//                             <Timeline
//                                 items={[
//                                     {
//                                         color: currentTheme.accentColor,
//                                         children: (
//                                             <div>
//                                                 <p style={{
//                                                     margin: 0,
//                                                     fontWeight: 500,
//                                                     color: currentTheme.textColor,
//                                                     fontSize: isMobile ? '14px' : 'inherit'
//                                                 }}>
//                                                     Ishga qabul qilingan
//                                                 </p>
//                                                 <p style={{
//                                                     margin: 0,
//                                                     color: currentTheme.textTertiary,
//                                                     fontSize: isMobile ? '12px' : 'inherit'
//                                                 }}>
//                                                     {moment(teacherData.work_date).format('DD.MM.YYYY')}
//                                                 </p>
//                                             </div>
//                                         )
//                                     },
//                                     ...(teacherData.work_end ? [
//                                         {
//                                             color: isDarkMode ? '#f5222d' : '#cf1322',
//                                             children: (
//                                                 <div>
//                                                     <p style={{
//                                                         margin: 0,
//                                                         fontWeight: 500,
//                                                         color: currentTheme.textColor,
//                                                         fontSize: isMobile ? '14px' : 'inherit'
//                                                     }}>
//                                                         Ishdan ketgan
//                                                     </p>
//                                                     <p style={{
//                                                         margin: 0,
//                                                         color: currentTheme.textTertiary,
//                                                         fontSize: isMobile ? '12px' : 'inherit'
//                                                     }}>
//                                                         {moment(teacherData.work_end).format('DD.MM.YYYY')}
//                                                     </p>
//                                                 </div>
//                                             )
//                                         }
//                                     ] : [])
//                                 ]}
//                             />
//                         </Card>

//                         <Card
//                             title="Guruhlar statistikasi"
//                             style={{
//                                 backgroundColor: currentTheme.bgContainer,
//                                 boxShadow: currentTheme.cardShadow,
//                                 borderRadius: '8px',
//                                 border: `1px solid ${currentTheme.borderColor}`,
//                                 marginTop: isMobile ? '12px' : '16px'
//                             }}
//                             headStyle={{
//                                 borderBottom: `1px solid ${currentTheme.borderColor}`,
//                                 color: currentTheme.textSecondary,
//                                 fontWeight: 600,
//                                 fontSize: isMobile ? '14px' : 'inherit'
//                             }}
//                         >
//                             <Row gutter={[isMobile ? 8 : 16, isMobile ? 8 : 16]}>
//                                 <Col span={24}>
//                                     <Statistic
//                                         title="Jami guruhlar"
//                                         value={teacherData.groups ? teacherData.groups.length : 0}
//                                         valueStyle={{
//                                             color: currentTheme.accentColor,
//                                             fontSize: isMobile ? '16px' : '24px'
//                                         }}
//                                         prefix={<TeamOutlined />}
//                                     />
//                                 </Col>
//                                 <Col span={12}>
//                                     <Statistic
//                                         title="Faol guruhlar"
//                                         value={activeGroups}
//                                         valueStyle={{
//                                             color: isDarkMode ? '#52c41a' : '#389e0d',
//                                             fontSize: isMobile ? '16px' : '24px'
//                                         }}
//                                         prefix={<CheckCircleOutlined />}
//                                     />
//                                 </Col>
//                                 <Col span={12}>
//                                     <Statistic
//                                         title="Yopiq guruhlar"
//                                         value={inactiveGroups}
//                                         valueStyle={{
//                                             color: isDarkMode ? '#ff4d4f' : '#cf1322',
//                                             fontSize: isMobile ? '16px' : '24px'
//                                         }}
//                                         prefix={<CloseCircleOutlined />}
//                                     />
//                                 </Col>
//                                 <Col span={24}>
//                                     <Statistic
//                                         title="Jami o'quvchilar"
//                                         value={totalStudents}
//                                         valueStyle={{
//                                             color: isDarkMode ? '#faad14' : '#d48806',
//                                             fontSize: isMobile ? '16px' : '24px'
//                                         }}
//                                         prefix={<UserOutlined />}
//                                     />
//                                 </Col>
//                             </Row>
//                         </Card>
//                     </Col>
//                     <Col xs={24} md={16}>
//                         <Card
//                             title="O'qituvchi ma'lumotlari"
//                             style={{
//                                 backgroundColor: currentTheme.bgContainer,
//                                 boxShadow: currentTheme.cardShadow,
//                                 borderRadius: '8px',
//                                 border: `1px solid ${currentTheme.borderColor}`,
//                             }}
//                             headStyle={{
//                                 borderBottom: `1px solid ${currentTheme.borderColor}`,
//                                 color: currentTheme.textSecondary,
//                                 fontWeight: 600,
//                                 fontSize: isMobile ? '14px' : 'inherit'
//                             }}
//                         >
//                             <Descriptions
//                                 bordered
//                                 column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
//                                 size={isMobile ? 'small' : 'middle'}
//                                 labelStyle={{
//                                     color: currentTheme.textTertiary,
//                                     fontSize: isMobile ? '12px' : 'inherit'
//                                 }}
//                                 contentStyle={{
//                                     color: currentTheme.textColor,
//                                     fontSize: isMobile ? '13px' : 'inherit'
//                                 }}
//                                 style={{
//                                     backgroundColor: currentTheme.bgContainer,
//                                 }}
//                             >
//                                 <Descriptions.Item label="Ism">{teacherData.first_name}</Descriptions.Item>
//                                 <Descriptions.Item label="Familiya">{teacherData.last_name}</Descriptions.Item>
//                                 <Descriptions.Item label="Email">{teacherData.email}</Descriptions.Item>
//                                 <Descriptions.Item label="Telefon">{teacherData.phone}</Descriptions.Item>
//                                 <Descriptions.Item label="Status">
//                                     <span
//                                         style={{
//                                             display: 'inline-block',
//                                             padding: '4px 12px',
//                                             borderRadius: '20px',
//                                             fontSize: isMobile ? '11px' : '12px',
//                                             fontWeight: 500,
//                                             color: statusStyle.color,
//                                             backgroundColor: statusStyle.bg,
//                                             border: `1px solid ${statusStyle.color}`,
//                                             boxShadow: `0 0 8px ${statusStyle.bg}`,
//                                         }}
//                                     >
//                                         {teacherData.status.toUpperCase()}
//                                     </span>
//                                 </Descriptions.Item>
//                                 <Descriptions.Item label="Ta'lim yo'nalishi">
//                                     <span
//                                         style={{
//                                             display: 'inline-block',
//                                             padding: '4px 12px',
//                                             borderRadius: '20px',
//                                             fontSize: isMobile ? '11px' : '12px',
//                                             fontWeight: 500,
//                                             textTransform: 'capitalize',
//                                             color: fieldStyle.color,
//                                             backgroundColor: fieldStyle.bg,
//                                             border: `1px solid ${fieldStyle.color}`,
//                                             boxShadow: `0 0 8px ${fieldStyle.bg}`,
//                                         }}
//                                     >
//                                         {teacherData.field}
//                                     </span>
//                                 </Descriptions.Item>
//                                 <Descriptions.Item label="Faol holati">
//                                     <span
//                                         style={{
//                                             display: 'inline-block',
//                                             padding: '4px 12px',
//                                             borderRadius: '20px',
//                                             fontSize: isMobile ? '11px' : '12px',
//                                             fontWeight: 500,
//                                             color: activeStatus.color,
//                                             backgroundColor: `${activeStatus.color}20`,
//                                             border: `1px solid ${activeStatus.color}`,
//                                             boxShadow: `0 0 8px ${activeStatus.color}20`,
//                                         }}
//                                     >
//                                         {!teacherData.is_deleted ? "HA" : "YO'Q"}
//                                     </span>
//                                 </Descriptions.Item>
//                                 <Descriptions.Item label="Ishga kirgan sana">
//                                     {moment(teacherData.work_date).format('DD.MM.YYYY')}
//                                 </Descriptions.Item>
//                                 {teacherData.work_end && (
//                                     <Descriptions.Item label="Ishdan ketgan sana">
//                                         {moment(teacherData.work_end).format('DD.MM.YYYY')}
//                                     </Descriptions.Item>
//                                 )}
//                                 <Descriptions.Item label="Ro'yxatdan o'tgan sana">
//                                     {moment(teacherData.createdAt).format('DD.MM.YYYY')}
//                                 </Descriptions.Item>
//                                 <Descriptions.Item label="Oxirgi yangilanish">
//                                     {moment(teacherData.updatedAt).format('DD.MM.YYYY')}
//                                 </Descriptions.Item>
//                                 {teacherData.salary > 0 && (
//                                     <Descriptions.Item label="Oylik maosh">
//                                         {teacherData.salary.toLocaleString()} UZS
//                                     </Descriptions.Item>
//                                 )}
//                             </Descriptions>
//                         </Card>

//                         {teacherData.groups && teacherData.groups.length > 0 && (
//                             <Card
//                                 title="Guruhlar"
//                                 style={{
//                                     backgroundColor: currentTheme.bgContainer,
//                                     boxShadow: currentTheme.cardShadow,
//                                     borderRadius: '8px',
//                                     border: `1px solid ${currentTheme.borderColor}`,
//                                     marginTop: isMobile ? '12px' : '16px'
//                                 }}
//                                 headStyle={{
//                                     borderBottom: `1px solid ${currentTheme.borderColor}`,
//                                     color: currentTheme.textSecondary,
//                                     fontWeight: 600,
//                                     fontSize: isMobile ? '14px' : 'inherit'
//                                 }}
//                             >
//                                 <Row gutter={[isMobile ? 8 : 16, isMobile ? 8 : 16]}>
//                                     {teacherData.groups.map((group: GroupType, index: number) => ( // Specify GroupType
//                                         <Col xs={24} sm={12} lg={8} key={index}>
//                                             <Card
//                                                 size="small"
//                                                 title={group.name}
//                                                 style={{
//                                                     backgroundColor: isDarkMode ? currentTheme.headerBg : '#f8fafc',
//                                                     border: `1px solid ${currentTheme.borderColor}`,
//                                                     borderRadius: '8px',
//                                                     height: '100%'
//                                                 }}
//                                                 headStyle={{
//                                                     borderBottom: `1px solid ${currentTheme.borderColor}`,
//                                                     color: currentTheme.textSecondary,
//                                                     fontWeight: 500,
//                                                     fontSize: isMobile ? '13px' : 'inherit'
//                                                 }}
//                                                 extra={
//                                                     <Badge
//                                                         status={group.is_deleted ? "error" : "success"}
//                                                         text={group.is_deleted ? "Yopiq" : "Faol"}
//                                                         style={{
//                                                             color: group.is_deleted ?
//                                                                 (isDarkMode ? '#ff4d4f' : '#cf1322') :
//                                                                 (isDarkMode ? '#52c41a' : '#389e0d'),
//                                                             fontSize: isMobile ? '11px' : 'inherit'
//                                                         }}
//                                                     />
//                                                 }
//                                             >
//                                                 <div style={{
//                                                     color: currentTheme.textTertiary,
//                                                     fontSize: isMobile ? '12px' : 'inherit'
//                                                 }}>
//                                                     O'quvchilar soni:
//                                                 </div>
//                                                 <div style={{
//                                                     color: currentTheme.textColor,
//                                                     fontSize: isMobile ? '16px' : '18px',
//                                                     fontWeight: 500,
//                                                     marginBottom: '8px'
//                                                 }}>
//                                                     {group.students?.length || 0}
//                                                 </div>
//                                                 <div style={{
//                                                     color: currentTheme.textTertiary,
//                                                     fontSize: isMobile ? '12px' : 'inherit'
//                                                 }}>
//                                                     Boshlangan sana:
//                                                 </div>
//                                                 <div style={{
//                                                     color: currentTheme.textColor,
//                                                     marginBottom: '8px',
//                                                     fontSize: isMobile ? '13px' : 'inherit'
//                                                 }}>
//                                                     {moment(group.started_group).format('DD.MM.YYYY')}
//                                                 </div>
//                                                 {group.end_group && (
//                                                     <>
//                                                         <div style={{
//                                                             color: currentTheme.textTertiary,
//                                                             fontSize: isMobile ? '12px' : 'inherit'
//                                                         }}>
//                                                             Yakunlangan sana:
//                                                         </div>
//                                                         <div style={{
//                                                             color: currentTheme.textColor,
//                                                             fontSize: isMobile ? '13px' : 'inherit'
//                                                         }}>
//                                                             {moment(group.end_group).format('DD.MM.YYYY')}
//                                                         </div>
//                                                     </>
//                                                 )}
//                                             </Card>
//                                         </Col>
//                                     ))}
//                                 </Row>
//                             </Card>
//                         )}
//                     </Col>
//                 </Row>
//             </div>
//         </ConfigProvider>
//     );
// };

// export default TeacherInfoComponents;
// /*/