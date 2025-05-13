"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminType, LeaveHistoryItem } from "@/@types";
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
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TeamOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { axiosInstance } from "@/hooks/useAxios/useAxios";
import { useTheme } from "next-themes";

const { darkAlgorithm, defaultAlgorithm } = theme;

const InfoAdmin = ({
  id,
  initialData = null,
}: {
  id: string;
  initialData?: AdminType | null;
}) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const { theme: nextTheme } = useTheme();

  useEffect(() => {
    if (nextTheme) {
      setIsDarkMode(nextTheme === "dark");
    }
  }, [nextTheme]);

  const {
    data: adminData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["adminData", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/staff/info/${id}`);
      if (response.data && response.data.data) {
        return response.data.data as AdminType;
      }
      throw new Error("Ma'lumot topilmadi");
    },
    initialData: initialData || undefined, // Use SSR data if available
    staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
    refetchOnWindowFocus: true, // Refetch when window is focused
  });

  const getStatusColor = (status: string) => {
    if (isDarkMode) {
      switch (status?.toLowerCase()) {
        case "faol":
          return { color: "#52c41a", bg: "rgba(82, 196, 26, 0.2)" };
        case "ta'tilda":
          return { color: "#faad14", bg: "rgba(250, 173, 20, 0.2)" };
        default:
          return { color: "#ff4d4f", bg: "rgba(255, 77, 79, 0.2)" };
      }
    } else {
      switch (status?.toLowerCase()) {
        case "faol":
          return { color: "#389e0d", bg: "rgba(82, 196, 26, 0.1)" };
        case "ta'tilda":
          return { color: "#d48806", bg: "rgba(250, 173, 20, 0.1)" };
        default:
          return { color: "#cf1322", bg: "rgba(255, 77, 79, 0.1)" };
      }
    }
  };

  const getActiveStatus = (active: boolean) => {
    if (isDarkMode) {
      return active
        ? { color: "#52c41a", text: "Faol", icon: <CheckCircleOutlined /> }
        : {
            color: "#ff4d4f",
            text: "Faol emas",
            icon: <CloseCircleOutlined />,
          };
    } else {
      return active
        ? { color: "#389e0d", text: "Faol", icon: <CheckCircleOutlined /> }
        : {
            color: "#cf1322",
            text: "Faol emas",
            icon: <CloseCircleOutlined />,
          };
    }
  };

  const getRoleColor = (role: string) => {
    if (isDarkMode) {
      switch (role?.toLowerCase()) {
        case "admin":
          return { color: "#1890ff", bg: "rgba(24, 144, 255, 0.2)" };
        case "manager":
          return { color: "#722ed1", bg: "rgba(114, 46, 209, 0.2)" };
        default:
          return { color: "#13c2c2", bg: "rgba(19, 194, 194, 0.2)" };
      }
    } else {
      switch (role?.toLowerCase()) {
        case "admin":
          return { color: "#096dd9", bg: "rgba(24, 144, 255, 0.1)" };
        case "manager":
          return { color: "#531dab", bg: "rgba(114, 46, 209, 0.1)" };
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
    },
  };

  const currentTheme = isDarkMode ? themeConfig.dark : themeConfig.light;

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          color: isDarkMode ? "#ff4d4f" : "#cf1322",
        }}
      >
        <h2>Xatolik</h2>
        <p>
          {(error as Error).message || "Ma'lumotni yuklashda xatolik yuz berdi"}
        </p>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          color: isDarkMode ? "#ff4d4f" : "#cf1322",
        }}
      >
        <h2>Ma&apos;lumot topilmadi</h2>
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

  const workDurationText = `${years > 0 ? `${years} yil ` : ""}${
    months > 0 ? `${months} oy ` : ""
  }${days > 0 ? `${days} kun` : ""}`;

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
      <div
        style={{
          padding: "20px",
          backgroundColor: currentTheme.bgPage,
          minHeight: "100vh",
          transition: "all 0.3s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "16px",
            alignItems: "center",
          }}
        ></div>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card
              style={{
                backgroundColor: currentTheme.bgContainer,
                boxShadow: currentTheme.cardShadow,
                borderRadius: "8px",
                border: `1px solid ${currentTheme.borderColor}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                {adminData.image ? (
                  <Avatar
                    src={adminData.image}
                    size={120}
                    style={{
                      marginBottom: "16px",
                      border: `4px solid ${currentTheme.borderColor}`,
                    }}
                  />
                ) : (
                  <Avatar
                    icon={<UserOutlined />}
                    size={120}
                    style={{
                      marginBottom: "16px",
                      backgroundColor: currentTheme.accentColor,
                      border: `4px solid ${currentTheme.borderColor}`,
                    }}
                  />
                )}
                <h2
                  style={{ color: currentTheme.textColor, marginBottom: "4px" }}
                >
                  {adminData.first_name} {adminData.last_name}
                </h2>
                <div
                  style={{
                    display: "inline-block",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "14px",
                    fontWeight: 500,
                    textTransform: "capitalize",
                    color: roleStyle.color,
                    backgroundColor: roleStyle.bg,
                    border: `1px solid ${roleStyle.color}`,
                    boxShadow: `0 0 8px ${roleStyle.bg}`,
                    marginBottom: "16px",
                  }}
                >
                  {adminData.role}
                </div>
                <p
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: currentTheme.textSecondary,
                    marginBottom: "8px",
                  }}
                >
                  <MailOutlined style={{ marginRight: "8px" }} />
                  {adminData.email}
                </p>
                <Divider
                  style={{
                    borderColor: currentTheme.borderColor,
                    margin: "16px 0",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-around",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: activeStatus.color,
                        backgroundColor: isDarkMode
                          ? "rgba(0, 0, 0, 0.2)"
                          : "rgba(0, 0, 0, 0.05)",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        marginBottom: "8px",
                      }}
                    >
                      {activeStatus.icon}
                    </div>
                    <div style={{ color: currentTheme.textSecondary }}>
                      {activeStatus.text}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: statusStyle.color,
                        backgroundColor: isDarkMode
                          ? "rgba(0, 0, 0, 0.2)"
                          : "rgba(0, 0, 0, 0.05)",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        marginBottom: "8px",
                      }}
                    >
                      <ClockCircleOutlined />
                    </div>
                    <div style={{ color: currentTheme.textSecondary }}>
                      {adminData.status.toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: currentTheme.accentColor,
                        backgroundColor: isDarkMode
                          ? "rgba(0, 0, 0, 0.2)"
                          : "rgba(0, 0, 0, 0.05)",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        marginBottom: "8px",
                      }}
                    >
                      <TeamOutlined />
                    </div>
                    <div style={{ color: currentTheme.textSecondary }}>
                      Admin
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
                borderRadius: "8px",
                border: `1px solid ${currentTheme.borderColor}`,
                marginTop: "16px",
              }}
              headStyle={{
                borderBottom: `1px solid ${currentTheme.borderColor}`,
                color: currentTheme.textSecondary,
                fontWeight: 600,
              }}
            >
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Statistic
                    title="Ish tajribasi"
                    value={workDurationText}
                    valueStyle={{ color: currentTheme.accentColor }}
                    prefix={<TrophyOutlined />}
                  />
                </Col>
              </Row>
              <Divider
                style={{
                  borderColor: currentTheme.borderColor,
                  margin: "16px 0",
                }}
              />
              <Timeline
                items={[
                  {
                    color: currentTheme.accentColor,
                    children: (
                      <div>
                        <p
                          style={{
                            margin: 0,
                            fontWeight: 500,
                            color: currentTheme.textColor,
                          }}
                        >
                          Ishga qabul qilingan
                        </p>
                        <p
                          style={{
                            margin: 0,
                            color: currentTheme.textTertiary,
                          }}
                        >
                          {moment(adminData.work_date).format("DD.MM.YYYY")}
                        </p>
                      </div>
                    ),
                  },
                  ...(adminData.work_end
                    ? [
                        {
                          color: isDarkMode ? "#f5222d" : "#cf1322",
                          children: (
                            <div>
                              <p
                                style={{
                                  margin: 0,
                                  fontWeight: 500,
                                  color: currentTheme.textColor,
                                }}
                              >
                                Ishdan ketgan
                              </p>
                              <p
                                style={{
                                  margin: 0,
                                  color: currentTheme.textTertiary,
                                }}
                              >
                                {moment(adminData.work_end).format(
                                  "DD.MM.YYYY"
                                )}
                              </p>
                            </div>
                          ),
                        },
                      ]
                    : []),
                  ...(adminData.leave_history &&
                  adminData.leave_history.length > 0
                    ? adminData.leave_history.map(
                        (leave: LeaveHistoryItem , index: number) => ({
                          color: isDarkMode ? "#faad14" : "#d48806",
                          children: (
                            <div key={index}>
                              <p
                                style={{
                                  margin: 0,
                                  fontWeight: 500,
                                  color: currentTheme.textColor,
                                }}
                              >
                                Ta&apos;tilga chiqqan
                              </p>
                              <p
                                style={{
                                  margin: 0,
                                  color: currentTheme.textTertiary,
                                }}
                              >
                                {moment(leave.start_date).format("DD.MM.YYYY")}{" "}
                                - {moment(leave.end_date).format("DD.MM.YYYY")}
                              </p>
                              {leave.reason && (
                                <p
                                  style={{
                                    margin: 0,
                                    color: currentTheme.textTertiary,
                                  }}
                                >
                                  Sabab: {leave.reason}
                                </p>
                              )}
                            </div>
                          ),
                        })
                      )
                    : []),
                ]}
              />
            </Card>
          </Col>
          <Col xs={24} md={16}>
            <Card
              title="Admin ma'lumotlari"
              style={{
                backgroundColor: currentTheme.bgContainer,
                boxShadow: currentTheme.cardShadow,
                borderRadius: "8px",
                border: `1px solid ${currentTheme.borderColor}`,
              }}
              headStyle={{
                borderBottom: `1px solid ${currentTheme.borderColor}`,
                color: currentTheme.textSecondary,
                fontWeight: 600,
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
                <Descriptions.Item label="Ism">
                  {adminData.first_name}
                </Descriptions.Item>
                <Descriptions.Item label="Familiya">
                  {adminData.last_name}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {adminData.email}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
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
                      display: "inline-block",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: 500,
                      textTransform: "capitalize",
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
                      display: "inline-block",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
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
                  {moment(adminData.work_date).format("DD.MM.YYYY")}
                </Descriptions.Item>
                {adminData.work_end && (
                  <Descriptions.Item label="Ishdan ketgan sana">
                    {moment(adminData.work_end).format("DD.MM.YYYY")}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Ro'yxatdan o'tgan sana">
                  {moment(adminData.createdAt).format("DD.MM.YYYY")}
                </Descriptions.Item>
                <Descriptions.Item label="Oxirgi yangilanish">
                  {moment(adminData.updatedAt).format("DD.MM.YYYY")}
                </Descriptions.Item>
              </Descriptions>
            </Card>
            {adminData.leave_history && adminData.leave_history.length > 0 && (
              <Card
                title="Ta'til tarixi"
                style={{
                  backgroundColor: currentTheme.bgContainer,
                  boxShadow: currentTheme.cardShadow,
                  borderRadius: "8px",
                  border: `1px solid ${currentTheme.borderColor}`,
                  marginTop: "16px",
                }}
                headStyle={{
                  borderBottom: `1px solid ${currentTheme.borderColor}`,
                  color: currentTheme.textSecondary,
                  fontWeight: 600,
                }}
              >
                
                {adminData.leave_history.map((leave: LeaveHistoryItem, index: number) => (
                  <div
                    key={index}
                    style={{
                      padding: "12px",
                      border: `1px solid ${currentTheme.borderColor}`,
                      borderRadius: "8px",
                      backgroundColor: isDarkMode
                        ? currentTheme.headerBg
                        : "#f8fafc",
                    }}
                  >
                    <Row gutter={[16, 16]}>
                      <Col xs={24} md={12}>
                        <div style={{ color: currentTheme.textTertiary }}>
                          Boshlanish sanasi:
                        </div>
                        <div
                          style={{
                            color: currentTheme.textColor,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <CalendarOutlined
                            style={{
                              marginRight: "8px",
                              color: isDarkMode ? "#faad14" : "#d48806",
                            }}
                          />
                          {moment(leave.start_date).format("DD.MM.YYYY")}
                        </div>
                      </Col>
                      <Col xs={24} md={12}>
                        <div style={{ color: currentTheme.textTertiary }}>
                          Tugash sanasi:
                        </div>
                        <div
                          style={{
                            color: currentTheme.textColor,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <CalendarOutlined
                            style={{
                              marginRight: "8px",
                              color: isDarkMode ? "#52c41a" : "#389e0d",
                            }}
                          />
                          {moment(leave.end_date).format("DD.MM.YYYY")}
                        </div>
                      </Col>
                    </Row>
                    {leave.reason && (
                      <>
                        <Divider
                          style={{
                            borderColor: currentTheme.borderColor,
                            margin: "12px 0",
                          }}
                        />
                        <div style={{ color: currentTheme.textTertiary }}>
                          Sabab:
                        </div>
                        <div style={{ color: currentTheme.textColor }}>
                          {leave.reason}
                        </div>
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
