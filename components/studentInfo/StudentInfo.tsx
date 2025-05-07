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
  Statistic
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  BookOutlined,
  SmileOutlined,
  FrownOutlined
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
              }}
            >
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}>
                <Avatar
                  icon={<UserOutlined />}
                  size={120}
                  style={{
                    marginBottom: '16px',
                    backgroundColor: currentTheme.accentColor,
                    border: `4px solid ${currentTheme.borderColor}`
                  }}
                />
                <h2 style={{ color: currentTheme.textColor, marginBottom: '4px' }}>
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
                      marginBottom: '8px'
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
                      marginBottom: '8px'
                    }}>
                      <TeamOutlined />
                    </div>
                    <div style={{ color: currentTheme.textSecondary }}>
                      O'quvchi
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
                marginTop: '16px'
              }}
              headStyle={{
                borderBottom: `1px solid ${currentTheme.borderColor}`,
                color: currentTheme.textSecondary,
                fontWeight: 600
              }}
            >
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Statistic
                    title="O'qish davomiyligi"
                    value={studyDurationText}
                    valueStyle={{ color: currentTheme.accentColor }}
                    prefix={<BookOutlined />}
                  />
                </Col>
              </Row>
              <Divider style={{ borderColor: currentTheme.borderColor, margin: '16px 0' }} />
              <Timeline
                items={[
                  {
                    color: currentTheme.accentColor,
                    dot: <SmileOutlined />,
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
                        dot: isHealthReason ? <FrownOutlined /> : <ClockCircleOutlined />,
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
            <Card
              title="O'quvchi ma'lumotlari"
              style={{
                backgroundColor: currentTheme.bgContainer,
                boxShadow: currentTheme.cardShadow,
                borderRadius: '8px',
                border: `1px solid ${currentTheme.borderColor}`,
              }}
              headStyle={{
                borderBottom: `1px solid ${currentTheme.borderColor}`,
                color: currentTheme.textSecondary,
                fontWeight: 600
              }}
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
                  marginTop: '16px'
                }}
                headStyle={{
                  borderBottom: `1px solid ${currentTheme.borderColor}`,
                  color: currentTheme.textSecondary,
                  fontWeight: 600
                }}
              >
                {studentData.leave_history.map((leave: any, index: number) => (
                  <div key={index} style={{
                    padding: '12px',
                    border: `1px solid ${currentTheme.borderColor}`,
                    borderRadius: '8px',
                    backgroundColor: isDarkMode ? currentTheme.headerBg : '#f8fafc',
                    marginBottom: index < studentData.leave_history.length - 1 ? '12px' : '0px'
                  }}>
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
                        <div style={{ color: currentTheme.textTertiary }}>Sababs:</div>
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