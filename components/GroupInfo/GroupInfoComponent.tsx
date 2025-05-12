"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import {
  Card,
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
  Progress,
  Table,
} from "antd";
import {
  TeamOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  BookOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons";
import { axiosInstance } from "@/hooks/useAxios/useAxios";

// Theme configuration
const { darkAlgorithm, defaultAlgorithm } = theme;

// Type definitions
interface StudentType {
  _id: string;
  first_name: string;
  last_name: string;
  phone: string;
  status: string;
  active: boolean;
  payments?: {
    amount: number;
    date: string;
    status: string;
  }[];
  attendance?: {
    date: string;
    status: string;
  }[];
}

interface TeacherType {
  _id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  email?: string;
  experience?: string;
}

export interface GroupType {
  _id: string;
  name: string;
  subject: string;
  type: string;
  status: string;
  start_date: string;
  end_date?: string;
  days: string[];
  time: string;
  room?: string;
  teacher: TeacherType;
  students: StudentType[];
  max_students?: number;
  price: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface GroupInfoComponentProps {
  id?: string;
  initialData?: GroupType;
}

// Theme configurations
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

const GroupInfoComponent = ({ id, initialData }: GroupInfoComponentProps) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { theme: nextTheme } = useTheme();
  const currentTheme = isDarkMode ? themeConfig.dark : themeConfig.light;

  useEffect(() => {
    setIsDarkMode(nextTheme === "dark");
  }, [nextTheme]);

  const { data: groupData, isLoading, error } = useQuery({
    queryKey: ['groupData', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/group/one-group/${id}`);
      console.log(response.data?.data);
      if (response.data?.data) {
        return response.data.data as GroupType;
      }
      
      throw new Error("Ma'lumot topilmadi");
    },
    initialData: initialData || undefined,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true,
    enabled: !!id, // Only run if id exists
  });

  // Helper functions
  const getStatusColor = (status: string) => {
    const statusMap = {
      dark: {
        active: { color: "#52c41a", bg: "rgba(82, 196, 26, 0.2)" },
        paused: { color: "#faad14", bg: "rgba(250, 173, 20, 0.2)" },
        closed: { color: "#ff4d4f", bg: "rgba(255, 77, 79, 0.2)" },
        default: { color: "#1890ff", bg: "rgba(24, 144, 255, 0.2)" }
      },
      light: {
        active: { color: "#389e0d", bg: "rgba(82, 196, 26, 0.1)" },
        paused: { color: "#d48806", bg: "rgba(250, 173, 20, 0.1)" },
        closed: { color: "#cf1322", bg: "rgba(255, 77, 79, 0.1)" },
        default: { color: "#096dd9", bg: "rgba(24, 144, 255, 0.1)" }
      }
    };

    const themeKey = isDarkMode ? "dark" : "light";
    const statusKey = status?.toLowerCase();

    if (statusKey === "faol" || statusKey === "active") return statusMap[themeKey].active;
    if (statusKey === "to'xtatilgan" || statusKey === "paused") return statusMap[themeKey].paused;
    if (statusKey === "yopilgan" || statusKey === "closed") return statusMap[themeKey].closed;
    
    return statusMap[themeKey].default;
  };

  const getActiveStatus = (active: boolean) => {
    return active
      ? {
          color: isDarkMode ? "#52c41a" : "#389e0d",
          text: "Faol",
          icon: <CheckCircleOutlined />
        }
      : {
          color: isDarkMode ? "#ff4d4f" : "#cf1322",
          text: "Faol emas",
          icon: <CloseCircleOutlined />
        };
  };

  const formatDaysList = (days: string[] = []) => {
    const dayTranslations: Record<string, string> = {
      monday: "Dushanba",
      tuesday: "Seshanba",
      wednesday: "Chorshanba",
      thursday: "Payshanba",
      friday: "Juma",
      saturday: "Shanba",
      sunday: "Yakshanba",
    };

    return days
      .map(day => dayTranslations[day.toLowerCase()] || day)
      .join(", ");
  };

  const getTypeIcon = (type: string) => {
    return type?.toLowerCase() === "online" ? (
      <TeamOutlined style={{ color: isDarkMode ? "#1890ff" : "#096dd9" }} />
    ) : (
      <EnvironmentOutlined style={{ color: isDarkMode ? "#722ed1" : "#531dab" }} />
    );
  };

  const calculateGroupCompletion = () => {
    if (!groupData?.start_date) return 0;

    const startDate = moment(groupData.start_date);
    const endDate = groupData.end_date ? moment(groupData.end_date) : moment().add(3, "months");
    const currentDate = moment();

    if (currentDate.isBefore(startDate)) return 0;
    if (currentDate.isAfter(endDate)) return 100;

    const totalDuration = endDate.diff(startDate);
    const elapsedDuration = currentDate.diff(startDate);

    return Math.round((elapsedDuration / totalDuration) * 100);
  };

  // Table columns configuration
  const columns = [
    {
      title: "Ism Familiya",
      dataIndex: "name",
      key: "name",
      render: (_: unknown, record: StudentType) => `${record.first_name} ${record.last_name}`,
    },
    {
      title: "Telefon",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusStyle = getStatusColor(status);
        return (
          <Tag
            style={{
              color: statusStyle.color,
              backgroundColor: statusStyle.bg,
              border: `1px solid ${statusStyle.color}`,
              borderRadius: "12px",
              padding: "2px 8px",
            }}
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Faollik",
      dataIndex: "active",
      key: "active",
      render: (active: boolean) => {
        const activeStatus = getActiveStatus(active);
        return (
          <Tag
            icon={activeStatus.icon}
            style={{
              color: activeStatus.color,
              backgroundColor: isDarkMode ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.05)",
              border: `1px solid ${activeStatus.color}`,
              borderRadius: "12px",
              padding: "2px 8px",
            }}
          >
            {activeStatus.text}
          </Tag>
        );
      },
    },
  ];

  // Loading and error states
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-500">
        <h2>Xatolik</h2>
        <p>{(error as Error).message || "Ma'lumotni yuklashda xatolik yuz berdi"}</p>
      </div>
    );
  }

  if (!groupData) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-500">
        <h2>Ma'lumot topilmadi</h2>
      </div>
    );
  }

  // Calculated values
  const statusStyle = getStatusColor(groupData.status);
  const groupCompletion = calculateGroupCompletion();
  const studentFillRate = groupData.max_students
    ? Math.round((groupData.students.length / groupData.max_students) * 100)
    : 100;

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
          Table: {
            colorBgContainer: currentTheme.bgContainer,
            colorBorderSecondary: currentTheme.borderColor,
          },
        },
      }}
    >
      <div 
        className="p-5 min-h-screen transition-all duration-300"
        style={{ backgroundColor: currentTheme.bgPage }}
      >
        <Row gutter={[16, 16]}>
          {/* Left Column - Group Summary & Stats */}
          <Col xs={24} md={8}>
            {/* Group Summary Card */}
            <Card
              className="rounded-lg border"
              style={{
                backgroundColor: currentTheme.bgContainer,
                boxShadow: currentTheme.cardShadow,
                borderColor: currentTheme.borderColor,
              }}
            >
              <div className="flex flex-col items-center text-center">
                {/* Group Icon */}
                <div
                  className="w-30 h-30 rounded-full flex items-center justify-center mb-4 border-4"
                  style={{
                    backgroundColor: currentTheme.accentColor,
                    color: "#fff",
                    fontSize: "40px",
                    fontWeight: "bold",
                    borderColor: currentTheme.borderColor,
                  }}
                >
                  {groupData.name.substring(0, 2)}
                </div>
                
                {/* Group Name & Status */}
                <h2 className="mb-1" style={{ color: currentTheme.textColor }}>
                  {groupData.name}
                </h2>
                <div
                  className="inline-block px-3 py-1 rounded-full text-sm font-medium capitalize mb-4"
                  style={{
                    color: statusStyle.color,
                    backgroundColor: statusStyle.bg,
                    border: `1px solid ${statusStyle.color}`,
                    boxShadow: `0 0 8px ${statusStyle.bg}`,
                  }}
                >
                  {groupData.status}
                </div>
                
                {/* Subject */}
                <p className="flex items-center mb-2" style={{ color: currentTheme.textSecondary }}>
                  <BookOutlined className="mr-2" />
                  {groupData.subject}
                </p>
                
                <Divider className="my-4" style={{ borderColor: currentTheme.borderColor }} />
                
                {/* Quick Stats */}
                <div className="flex w-full justify-around">
                  {[
                    {
                      icon: getTypeIcon(groupData.type),
                      label: groupData.type,
                    },
                    {
                      icon: <ClockCircleOutlined />,
                      label: groupData.status,
                    },
                    {
                      icon: <TeamOutlined style={{ color: isDarkMode ? "#1890ff" : "#096dd9" }} />,
                      label: `${groupData.students.length} Talaba`,
                    },
                  ].map((item, index) => (
                    <div key={index} className="text-center">
                      <div
                        className="inline-flex items-center justify-center rounded-full w-10 h-10 mb-2"
                        style={{
                          color: index === 0 ? currentTheme.accentColor : 
                                index === 1 ? statusStyle.color : 
                                isDarkMode ? "#1890ff" : "#096dd9",
                          backgroundColor: isDarkMode ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.05)",
                        }}
                      >
                        {item.icon}
                      </div>
                      <div style={{ color: currentTheme.textSecondary }}>{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
            
            <Card
              title="Guruh statistikasi"
              className="rounded-lg border !mt-4"
              style={{
                backgroundColor: currentTheme.bgContainer,
                boxShadow: currentTheme.cardShadow,
                borderColor: currentTheme.borderColor,
              }}
            
            >
              {/* Course Progress */}
              <div className="mb-5">
                <div className="flex justify-between mb-2">
                  <span style={{ color: currentTheme.textSecondary }}>Kurs jarayoni</span>
                  <span style={{ color: currentTheme.accentColor, fontWeight: 500 }}>
                    {groupCompletion}%
                  </span>
                </div>
                <Progress
                  percent={groupCompletion}
                  showInfo={false}
                  strokeColor={currentTheme.accentColor}
                  trailColor={isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}
                />
              </div>

              {/* Student Capacity */}
              <div className="mb-5">
                <div className="flex justify-between mb-2">
                  <span style={{ color: currentTheme.textSecondary }}>O'quvchilar sig'imi</span>
                  <span
                    style={{
                      color:
                        studentFillRate > 80
                          ? isDarkMode ? "#ff4d4f" : "#cf1322"
                          : studentFillRate > 50
                          ? isDarkMode ? "#faad14" : "#d48806"
                          : isDarkMode ? "#52c41a" : "#389e0d",
                      fontWeight: 500,
                    }}
                  >
                    {studentFillRate}%
                  </span>
                </div>
                <Progress
                  percent={studentFillRate}
                  showInfo={false}
                  strokeColor={
                    studentFillRate > 80
                      ? isDarkMode ? "#ff4d4f" : "#cf1322"
                      : studentFillRate > 50
                      ? isDarkMode ? "#faad14" : "#d48806"
                      : isDarkMode ? "#52c41a" : "#389e0d"
                  }
                  trailColor={isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}
                />
              </div>

              {/* Price & Time Statistics */}
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic
                    title="Narxi"
                    value={groupData.price.toLocaleString()}
                    valueStyle={{ color: isDarkMode ? "#52c41a" : "#389e0d" }}
                    prefix={<DollarOutlined />}
                    suffix="so'm"
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Dars vaqti"
                    value={groupData.time}
                    valueStyle={{ color: isDarkMode ? "#1890ff" : "#096dd9" }}
                    prefix={<FieldTimeOutlined />}
                  />
                </Col>
              </Row>
              
              <Divider className="my-4" style={{ borderColor: currentTheme.borderColor }} />
              
              <Timeline
                items={[
                  {
                    color: currentTheme.accentColor,
                    children: (
                      <div>
                        <p className="m-0 font-medium" style={{ color: currentTheme.textColor }}>
                          Guruh boshlangan
                        </p>
                        <p className="m-0" style={{ color: currentTheme.textTertiary }}>
                          {moment(groupData.start_date).format("DD.MM.YYYY")}
                        </p>
                      </div>
                    ),
                  },
                  ...(groupData.end_date
                    ? [{
                        color: isDarkMode ? "#f5222d" : "#cf1322",
                        children: (
                          <div>
                            <p className="m-0 font-medium" style={{ color: currentTheme.textColor }}>
                              Guruh tugaydi
                            </p>
                            <p className="m-0" style={{ color: currentTheme.textTertiary }}>
                              {moment(groupData.end_date).format("DD.MM.YYYY")}
                            </p>
                          </div>
                        ),
                      }]
                    : []),
                ]}
              />
            </Card>
          </Col>
          
          {/* Right Column - Detailed Information */}
          <Col xs={24} md={16}>
            {/* Group Details Card */}
            <Card
              title="Guruh ma'lumotlari"
              className="rounded-lg border"
              style={{
                backgroundColor: currentTheme.bgContainer,
                boxShadow: currentTheme.cardShadow,
                borderColor: currentTheme.borderColor,
              }}
           
            >
              <Descriptions
                bordered
                column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                size="middle"
                labelStyle={{ color: currentTheme.textTertiary }}
                contentStyle={{ color: currentTheme.textColor }}
                style={{ backgroundColor: currentTheme.bgContainer }}
              >
                <Descriptions.Item label="Guruh nomi">{groupData.name}</Descriptions.Item>
                <Descriptions.Item label="Fan">{groupData.subject}</Descriptions.Item>
                <Descriptions.Item label="Guruh turi">{groupData.type}</Descriptions.Item>
                <Descriptions.Item label="Status">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      color: statusStyle.color,
                      backgroundColor: statusStyle.bg,
                      border: `1px solid ${statusStyle.color}`,
                      boxShadow: `0 0 8px ${statusStyle.bg}`,
                    }}
                  >
                    {groupData.status}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Boshlanish sanasi">
                  {moment(groupData.start_date).format("DD.MM.YYYY")}
                </Descriptions.Item>
                {groupData.end_date && (
                  <Descriptions.Item label="Tugash sanasi">
                    {moment(groupData.end_date).format("DD.MM.YYYY")}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Dars kunlari">
                  {formatDaysList(groupData.days)}
                </Descriptions.Item>
                <Descriptions.Item label="Dars vaqti">{groupData.time}</Descriptions.Item>
                {groupData.room && <Descriptions.Item label="Xona">{groupData.room}</Descriptions.Item>}
                <Descriptions.Item label="O'qituvchi">
                  {groupData.teacher.first_name} {groupData.teacher.last_name}
                </Descriptions.Item>
                <Descriptions.Item label="O'quvchilar soni">
                  {groupData.students.length} {groupData.max_students ? `/ ${groupData.max_students}` : ""}
                </Descriptions.Item>
                <Descriptions.Item label="Guruh narxi">
                  {groupData.price.toLocaleString()} so'm
                </Descriptions.Item>
                <Descriptions.Item label="Yaratilgan sana">
                  {moment(groupData.created_at).format("DD.MM.YYYY")}
                </Descriptions.Item>
                <Descriptions.Item label="Oxirgi yangilanish">
                  {moment(groupData.updated_at).format("DD.MM.YYYY")}
                </Descriptions.Item>
              </Descriptions>

              {groupData.description && (
                <div className="mt-4">
                  <div className="font-semibold mb-2" style={{ color: currentTheme.textSecondary }}>
                    Tavsif:
                  </div>
                  <div
                    className="p-3 rounded-lg border"
                    style={{
                      color: currentTheme.textColor,
                      backgroundColor: isDarkMode ? "rgba(0, 0, 0, 0.1)" : "rgba(0, 0, 0, 0.02)",
                      borderColor: currentTheme.borderColor,
                    }}
                  >
                    {groupData.description}
                  </div>
                </div>
              )}
            </Card>

            <Card
              title="O'qituvchi haqida ma'lumot"
              className="rounded-lg border !mt-4"
              style={{
                backgroundColor: currentTheme.bgContainer,
                boxShadow: currentTheme.cardShadow,
                borderColor: currentTheme.borderColor,
              }}
           
            >
              <div
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor: isDarkMode ? "rgba(0, 0, 0, 0.1)" : "rgba(0, 0, 0, 0.02)",
                  borderColor: currentTheme.borderColor,
                }}
              >
                <div className="flex items-center mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold mr-4"
                    style={{ backgroundColor: currentTheme.accentColor }}
                  >
                    {`${groupData.teacher.first_name.charAt(0)}${groupData.teacher.last_name.charAt(0)}`}
                  </div>
                  <div>
                    <h3
                      className="m-0 text-base font-semibold"
                      style={{ color: currentTheme.textColor }}
                    >
                      {groupData.teacher.first_name} {groupData.teacher.last_name}
                    </h3>
                    <p
                      className="m-0 text-sm"
                      style={{ color: currentTheme.textSecondary }}
                    >
                      {groupData.subject} o'qituvchisi
                    </p>
                  </div>
                </div>

                <Divider className="my-3" style={{ borderColor: currentTheme.borderColor }} />

                <Row gutter={[16, 16]}>
              <div className="!max-[410px]:!flex-wrap !max-[410px]:!flex gap-2 ">
              {groupData.teacher.phone && (
                    <Col span={12}>
                      <div style={{ color: currentTheme.textTertiary }}>Telefon:</div>
                      <div style={{ color: currentTheme.textColor }}>{groupData.teacher.phone}</div>
                    </Col>
                  )}
                  {groupData.teacher.email && (
                    <Col span={12}>
                      <div style={{ color: currentTheme.textTertiary }}>Email:</div>
                      <div style={{ color: currentTheme.textColor }}>{groupData.teacher.email}</div>
                    </Col>
                  )}
                  {groupData.teacher.experience && (
                    <Col span={24}>
                      <div style={{ color: currentTheme.textTertiary }}>Tajriba:</div>
                      <div style={{ color: currentTheme.textColor }}>{groupData.teacher.experience}</div>
                    </Col>
                  )}
              </div>
                </Row>
              </div>
            </Card>

            <Card
              title="O'quvchilar ro'yxati"
              className="rounded-lg border !mt-4"
              style={{
                backgroundColor: currentTheme.bgContainer,
                boxShadow: currentTheme.cardShadow,
                borderColor: currentTheme.borderColor,
              }}
          
            >
              <Table
                dataSource={groupData.students}
                columns={columns}
                rowKey="_id"
                pagination={{ pageSize: 5, hideOnSinglePage: true, size: "small" }}
                size="middle"
                scroll={{ x: "max-content" }}
                style={{
                  backgroundColor: currentTheme.bgContainer,
                  borderColor: currentTheme.borderColor,
                }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </ConfigProvider>
  );
};

export default GroupInfoComponent;