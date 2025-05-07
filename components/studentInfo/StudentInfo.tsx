"use client";

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { StudentType } from '@/@types';
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
  Avatar,
  Typography
} from 'antd';
import {
  MailOutlined,
  BookOutlined,
  UserOutlined,
  ClockCircleOutlined,
  SmileOutlined,
  FrownOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { axiosInstance } from '@/hooks/useAxios/useAxios';
import { useTheme } from "next-themes";

const { darkAlgorithm, defaultAlgorithm } = theme;
const { Title, Text } = Typography;

const StudentInfoComponent = ({ id, initialData = null }: { id: string; initialData?: StudentType | null }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { theme: nextTheme } = useTheme();

  useEffect(() => {
    setIsDarkMode(nextTheme === 'dark');
  }, [nextTheme]);

  const { data: studentData, isLoading, error } = useQuery({
    queryKey: ['students', id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/student/student/${id}`);
      if (res.data?.data) return res.data.data as StudentType;
      throw new Error("Ma'lumot topilmadi");
    },
    initialData: initialData || undefined,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
    refetchOnWindowFocus: true
  });

  const themeStyles = {
    dark: {
      bg: "#111827",
      container: "#1f2937",
      border: "#374151",
      text: "#ffffff",
      secondary: "#d1d5db",
      header: "#111827",
      primary: "#4f46e5"
    },
    light: {
      bg: "#f9fafb",
      container: "#ffffff",
      border: "#e5e7eb",
      text: "#111827",
      secondary: "#4b5563",
      header: "#f3f4f6",
      primary: "#4f46e5"
    }
  }[isDarkMode ? 'dark' : 'light'];

  const colorByStatus = (status: string) => {
    const base = {
      faol: '#52c41a',
      "TA'TILDA": '#faad14',
      YAKUNLADI: '#ff4d4f',
      default: '#8c8c8c'
    };
    return base[status?.toUpperCase() as keyof typeof base] || base.default;
  };

  if (isLoading) return <Spin fullscreen />;
  if (error || !studentData) {
    const typedError = error as Error;
    return <div style={{ color: colorByStatus('default') }}>{typedError.message || 'Xatolik yuz berdi'}</div>;
  }

  const start = moment(studentData.createdAt);
  const diff = moment().diff(start);
  const duration = moment.duration(diff);
  const studyTime = `${duration.years()} yil ${duration.months()} oy ${duration.days()} kun`;

  const leaveTimelineItems = (studentData.leave_history || []).map((leave, i) => {
    const color = leave.reason.toLowerCase().includes('tobi') ? '#ff4d4f' : '#faad14';
    const icon = leave.reason.toLowerCase().includes('tobi') ? <FrownOutlined /> : <ClockCircleOutlined />;

    return {
      color,
      dot: icon,
      children: (
        <div key={i}>
          <Text strong>{moment(leave.start_date).format('DD.MM.YYYY')}</Text>
          <br />
          <Text>{leave.reason}</Text>
        </div>
      )
    };
  });

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
        token: {
          colorBgContainer: themeStyles.container,
          colorText: themeStyles.text,
          colorTextSecondary: themeStyles.secondary,
          borderRadius: 8,
          colorPrimary: themeStyles.primary
        },
        components: {
          Card: { headerBg: themeStyles.header },
          Descriptions: { colorSplit: themeStyles.border },
          Timeline: { colorText: themeStyles.secondary }
        }
      }}
    >
      <Row gutter={16} style={{ background: themeStyles.bg, padding: 20 }}>
        <Col xs={24} md={8}>
          <Card style={{ background: themeStyles.container, textAlign: 'center' }}>
            <Avatar
              size={120}
              icon={<UserOutlined />}
              style={{ backgroundColor: themeStyles.primary, marginBottom: 16 }}
            >
              {studentData.first_name?.charAt(0).toUpperCase()}
            </Avatar>
            <h2>{studentData.first_name} {studentData.last_name}</h2>
            <p><MailOutlined /> {studentData.phone}</p>
            <p style={{ color: colorByStatus(studentData.status || '') }}>
              {studentData.status?.toUpperCase() || 'NOMAʼLUM'}
            </p>
          </Card>

          <Card title="O'quv davri" style={{ marginTop: 16, background: themeStyles.container }}>
            <Statistic
              title="O'qish davomiyligi"
              value={studyTime}
              prefix={<BookOutlined />}
              valueStyle={{ color: themeStyles.primary }}
            />
            <Divider />
            <Title level={5}>Ketgan vaqtlar:</Title>
            <Timeline items={[
              {
                color: themeStyles.primary,
                dot: <SmileOutlined />,
                children: <Text>O'qishni boshlagan: {moment(studentData.createdAt).format('DD.MM.YYYY')}</Text>
              },
              ...leaveTimelineItems
            ]} />
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card title="O'quvchi ma'lumotlari" style={{ background: themeStyles.container }}>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Ism">{studentData.first_name}</Descriptions.Item>
              <Descriptions.Item label="Familiya">{studentData.last_name}</Descriptions.Item>
              <Descriptions.Item label="Telefon">{studentData.phone}</Descriptions.Item>
              <Descriptions.Item label="Guruh">
                {studentData.groups?.[0]?.group?.name || 'Guruh nomi yoʻq'}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <span style={{ color: colorByStatus(studentData.status || '') }}>
                  {studentData.status?.toUpperCase() || 'NOMAʼLUM'}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="O'qish boshlangan sana">
                {moment(studentData.createdAt).format('DD.MM.YYYY')}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="O'quv natijalari" style={{ marginTop: 16, background: themeStyles.container }}>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="O'rtacha ball">Ma'lumot yo'q</Descriptions.Item>
              <Descriptions.Item label="To'plagan ballari">Ma'lumot yo'q</Descriptions.Item>
              <Descriptions.Item label="O'zlashtrish darajasi">Ma'lumot yo'q</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </ConfigProvider>
  );
};

export default StudentInfoComponent;
