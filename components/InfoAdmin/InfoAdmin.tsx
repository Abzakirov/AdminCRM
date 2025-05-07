  "use client";

  import { useEffect, useState } from 'react';
  import { useQuery } from '@tanstack/react-query';
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
    Statistic
  } from 'antd';
  import {
    UserOutlined,
    MailOutlined,
    TrophyOutlined
  } from '@ant-design/icons';
  import moment from 'moment';
  import { axiosInstance } from '@/hooks/useAxios/useAxios';
  import { useTheme } from "next-themes";

  const { darkAlgorithm, defaultAlgorithm } = theme;

  const InfoAdmin = ({ id, initialData = null }: { id: string; initialData?: AdminType | null }) => {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const { theme: nextTheme } = useTheme();

    useEffect(() => {
      setIsDarkMode(nextTheme === 'dark');
    }, [nextTheme]);

    const { data: adminData, isLoading, error } = useQuery({
      queryKey: ['adminData', id],
      queryFn: async () => {
        const res = await axiosInstance.get(`/staff/info/${id}`);
        if (res.data?.data) return res.data.data as AdminType;
        throw new Error("Ma&#39;lumot topilmadi");
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
        tertiary: "#9ca3af",
        header: "#111827",
        primary: "#4f46e5",
        shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)"
      },
      light: {
        bg: "#f9fafb",
        container: "#ffffff",
        border: "#e5e7eb",
        text: "#111827",
        secondary: "#4b5563",
        tertiary: "#6b7280",
        header: "#f3f4f6",
        primary: "#4f46e5",
        shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
      }
    }[isDarkMode ? 'dark' : 'light'];

    const colorByStatus = (status: string) => {
      const base = {
        faol: ['#52c41a', '#389e0d'],
        "ta'tilda": ['#faad14', '#d48806'],
        default: ['#ff4d4f', '#cf1322']
      };
      const [dark, light] = base[status.toLowerCase() as keyof typeof base] || base.default;
      return isDarkMode ? dark : light;
    };

    const colorByRole = (role: string) => {
      const base = {
        admin: ['#1890ff', '#096dd9'],
        manager: ['#722ed1', '#531dab'],
        default: ['#13c2c2', '#08979c']
      };
      const [dark, light] = base[role.toLowerCase() as keyof typeof base] || base.default;
      return isDarkMode ? dark : light;
    };

    if (isLoading) return <Spin fullscreen />;
    if (error || !adminData) {
      const typedError = error as Error;
      return <div style={{ color: colorByStatus('default') }}>{typedError.message || 'Xatolik yuz berdi'}</div>;
    }

    const start = moment(adminData.work_date);
    const diff = moment().diff(start);
    const duration = moment.duration(diff);
    const workTime = `${duration.years()} yil ${duration.months()} oy ${duration.days()} kun`;

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
            <Card style={{ background: themeStyles.container }}>
              <div style={{ textAlign: 'center' }}>
                <Avatar src={adminData.image} size={120} icon={<UserOutlined />} />
                <h2>{adminData.first_name} {adminData.last_name}</h2>
                <p><MailOutlined /> {adminData.email}</p>
                <p style={{ color: colorByStatus(adminData.status) }}>{adminData.status}</p>
                <p style={{ color: colorByRole(adminData.role) }}>{adminData.role}</p>
              </div>
            </Card>

            <Card title="Ish tajribasi" style={{ marginTop: 16, background: themeStyles.container }}>
              <Statistic
                title="Ish davomiyligi"
                value={workTime}
                prefix={<TrophyOutlined />}
                valueStyle={{ color: themeStyles.primary }}
              />
              <Divider />
              <Timeline
                items={[
                  {
                    color: themeStyles.primary,
                    children: <p>Ishga kirgan: {moment(adminData.work_date).format('DD.MM.YYYY')}</p>
                  },
                  ...(adminData.work_end ? [{
                    color: '#cf1322',
                    children: <p>Ishdan ketgan: {moment(adminData.work_end).format('DD.MM.YYYY')}</p>
                  }] : []),
                  ...(adminData.leave_history || []).map((l, i) => ({
                    color: '#d48806',
                    children: <p key={i}>Ta&#39;til: {moment(l.start_date).format('DD.MM.YYYY')} - {moment(l.end_date).format('DD.MM.YYYY')}</p>
                  }))
                ]}
              />
            </Card>
          </Col>

          <Col xs={24} md={16}>
            <Card title="Admin ma&#39;lumotlari" style={{ background: themeStyles.container }}>
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Ism">{adminData.first_name}</Descriptions.Item>
                <Descriptions.Item label="Familiya">{adminData.last_name}</Descriptions.Item>
                <Descriptions.Item label="Email">{adminData.email}</Descriptions.Item>
                <Descriptions.Item label="Lavozimi">{adminData.role}</Descriptions.Item>
                <Descriptions.Item label="Status">{adminData.status}</Descriptions.Item>
                <Descriptions.Item label="Faollik">{adminData.active ? 'Faol' : 'Faol emas'}</Descriptions.Item>
                <Descriptions.Item label="Ish boshlangan sana">{moment(adminData.work_date).format('DD.MM.YYYY')}</Descriptions.Item>
                {adminData.work_end && (
                  <Descriptions.Item label="Ish tugagan sana">{moment(adminData.work_end).format('DD.MM.YYYY')}</Descriptions.Item>
                )}
              </Descriptions>
            </Card>
          </Col>
        </Row>
      </ConfigProvider>
    );
  };

  export default InfoAdmin;
