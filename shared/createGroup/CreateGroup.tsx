"use client";

import {
  Button,
  Drawer,
  Form,
  Select,
  ConfigProvider,
  Spin,
  theme,
  DatePicker,
} from "antd";
import React, { useEffect, useState } from "react";
import { useGroupCreateMutation } from "@/hooks/mutation";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/hooks/useAxios/useAxios";

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

interface CreateGroupProps {
  visible: boolean;
  onClose: () => void;
}

const CreateGroup: React.FC<CreateGroupProps> = ({ visible, onClose }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [form] = Form.useForm();
  const { mutate: createGroup, isPending } = useGroupCreateMutation();

  const [teacherSearchTerm, setTeacherSearchTerm] = useState("");
  const debouncedTeacherSearchTerm = useDebounce(teacherSearchTerm, 500);

  const [courseSearchTerm, setCourseSearchTerm] = useState("");
  const debouncedCourseSearchTerm = useDebounce(courseSearchTerm, 500);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = resolvedTheme === "dark";

  const { data: teachers = [], isLoading: isTeachersLoading } = useQuery({
    queryKey: ["search-teacher", debouncedTeacherSearchTerm],
    queryFn: async () => {
      if (!debouncedTeacherSearchTerm) return [];
      const res = await axiosInstance.get("/group/search-teacher", {
        params: { name: debouncedTeacherSearchTerm },
      });
      console.log(res.data.data);
      return res.data.data || [];
    },
    enabled: !!debouncedTeacherSearchTerm,
  });

  const { data: coursesData = [], isLoading: isCoursesLoading } = useQuery({
    queryKey: ["search-course", debouncedCourseSearchTerm],
    queryFn: async () => {
      if (!debouncedCourseSearchTerm) return [];
      const res = await axiosInstance.get("/group/search-course", {
        params: { search: debouncedCourseSearchTerm },
      });

      return Array.isArray(res.data.data) ? res.data.data : [];
    },
    enabled: !!debouncedCourseSearchTerm,
  });

  const onFinish = (values: any) => {
    const payload = {
      course_id: values.course_id,
      teacher:
        typeof values.teacher === "object"
          ? values.teacher._id
          : values.teacher,
      started_group: values.started_group?.format("YYYY-MM-DD"),
    };
    createGroup(payload, {
      onSuccess: () => {
        form.resetFields();
        onClose();
      },
    });
  };

  const handleTeacherSearch = (value: string) => setTeacherSearchTerm(value);
  const handleCourseSearch = (value: string) => setCourseSearchTerm(value);

  useEffect(() => {
    if (visible) {
      form.resetFields();
      setTeacherSearchTerm("");
      setCourseSearchTerm("");
    }
  }, [visible, form]);

  const darkThemeConfig = {
    algorithm: theme.darkAlgorithm,
    components: {
      Drawer: { colorBgElevated: "#111827", colorText: "#fff" },
      Button: { defaultBg: "#374151", defaultColor: "white" },
      Input: {
        colorBgContainer: "#1f2937",
        colorBorder: "#374151",
        colorText: "white",
      },
      Select: {
        colorBgContainer: "#1f2937",
        colorBorder: "#374151",
        colorText: "white",
      },
      DatePicker: {
        colorBgContainer: "#1f2937",
        colorText: "white",
        colorBorder: "#374151",
      },
    },
  };

  if (!mounted) return null; // ничего не рендерим до полной инициализации темы

  return (
    <ConfigProvider theme={isDarkMode ? darkThemeConfig : undefined}>
      <Drawer
        title="Yangi guruh yaratish"
        placement="right"
        onClose={onClose}
        open={visible}
        width={400}
        styles={{
          body: {
            backgroundColor: isDarkMode ? "#111827" : "#ffffff",
          },
          header: {
            backgroundColor: isDarkMode ? "#111827" : "#ffffff",
            borderBottom: isDarkMode
              ? "1px solid #374151"
              : "1px solid #f0f0f0",
          },
        }}
      >
        <div className={`p-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
          <Form layout="vertical" form={form} onFinish={onFinish}>
            <Form.Item
              name="course_id"
              label="Kurs"
              rules={[{ required: true, message: "Kursni tanlang" }]}
            >
              <Select
                showSearch
                placeholder="Kursni tanlang"
                loading={isCoursesLoading}
                onSearch={handleCourseSearch}
                filterOption={false}
                notFoundContent={
                  isCoursesLoading ? (
                    <Spin size="small" />
                  ) : debouncedCourseSearchTerm ? (
                    "Topilmadi"
                  ) : (
                    "Qidirish uchun yozing"
                  )
                }
              >
                {coursesData.map((course: any) => (
                  <Select.Option key={course._id} value={course._id}>
                    {typeof course.name === "object"
                      ? course.name.name
                      : course.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="teacher"
              label="Ustoz"
              rules={[{ required: true, message: "Ustozni tanlang" }]}
            >
              <Select
                showSearch
                placeholder="Ustozni tanlang"
                loading={isTeachersLoading}
                onSearch={handleTeacherSearch}
                filterOption={false}
                notFoundContent={
                  isTeachersLoading ? (
                    <Spin size="small" />
                  ) : debouncedTeacherSearchTerm ? (
                    "Topilmadi"
                  ) : (
                    "Qidirish uchun yozing"
                  )
                }
              >
                {teachers.map((teacher: any) => (
                  <Select.Option key={teacher._id} value={teacher._id}>
                    {teacher.first_name} {teacher.last_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="started_group"
              label="Boshlanish sanasi"
              rules={[{ required: true, message: "Sanani tanlang" }]}
            >
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                onClick={() => {
                  form.resetFields();
                  onClose();
                }}
                className={isDarkMode ? "bg-gray-700 text-white" : ""}
              >
                Bekor qilish
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isPending}
                className={isDarkMode ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                {isPending ? <Spin size="small" /> : "Yuborish"}
              </Button>
            </div>
          </Form>
        </div>
      </Drawer>
    </ConfigProvider>
  );
};

export default CreateGroup;
