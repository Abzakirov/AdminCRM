"use client";

import {
  Button,
  Input,
  Drawer,
  Form,
  ConfigProvider,
  Spin,
  theme,
  InputNumber,
} from "antd";
import React, { useEffect } from "react";
import {
  useCreateCategoryCourseMutation,
  useCreateCourseMutation,
} from "@/hooks/mutation";
import { useTheme } from "next-themes";

interface CreateCourseProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface CreateCourseFormValues {
  categoryName: string;
  name: string;
  description: string;
  duration: string;
  price: number;
}

const CreateCourse: React.FC<CreateCourseProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const { resolvedTheme } = useTheme();
  const [form] = Form.useForm<CreateCourseFormValues>();

  const { mutate: createCourse, isPending: isCreatingCourse } = useCreateCourseMutation();
  const { mutate: createCategory, isPending: isCreatingCategory } = useCreateCategoryCourseMutation();

  const isDarkMode = resolvedTheme === "dark";
  const isPending = isCreatingCourse || isCreatingCategory;

  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible, form]);

  const darkThemeConfig = {
    algorithm: theme.darkAlgorithm,
    components: {
      Drawer: {
        colorBgElevated: "#111827",
        colorTextHeading: "#ffffff",
        colorText: "#ffffff",
        colorIcon: "#ffffff",
      },
      Button: {
        defaultBg: "#374151",
        defaultColor: "white",
        primaryColor: "white",
      },
      Input: {
        colorBgContainer: "#1f2937",
        colorBorder: "#374151",
        colorText: "white",
        hoverBorderColor: "#4f46e5",
        activeBorderColor: "#4f46e5",
      },
      InputNumber: {
        colorBgContainer: "#1f2937",
        colorBorder: "#374151",
        colorText: "white",
      },
      TextArea: {
        colorBgContainer: "#1f2937",
        colorText: "white",
        colorBorder: "#374151",
      },
    },
  };

  const handleFinish = (
    values: CreateCourseFormValues,
    onClose: () => void,
    onSuccess?: () => void
  ) => {
    handleCreateCategory(values.categoryName, () => {
      handleCreateCourse(values, onClose, onSuccess);
    });
  };
  
const handleCreateCategory = (categoryName: string, onSuccess: () => void) => {

  createCategory(
    { name: categoryName },
    {
      onSuccess,
    }
  );
};  

const handleCreateCourse = (
  values: CreateCourseFormValues,
  onClose: () => void,
  onSuccess?: () => void
) => {

  createCourse(
    {
      name: values.name,
      description: values.description,
      duration: values.duration,
      price: values.price,
    },
    {
      onSuccess: () => {
        onClose();
        onSuccess?.();
        console.log(values)
      },
    }
  );
};

  return (
    <ConfigProvider theme={isDarkMode ? darkThemeConfig : undefined}>
      <Drawer
        title="Kurs qo'shish"
        placement="right"
        onClose={onClose}
        open={visible}
        width={400}
        styles={{
          body: { background: isDarkMode ? "#111827" : "#ffffff" },
          header: {
            background: isDarkMode ? "#111827" : "#ffffff",
            borderBottom: isDarkMode ? "1px solid #374151" : "1px solid #f0f0f0",
          },
        }}
      >
        <div className={`p-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
          <Form
            layout="vertical"
            form={form}
            onFinish={(values) => handleFinish(values, onClose, onSuccess)}
          >
            <Form.Item
              name="categoryName"
              label="Kategoriya nomi"
              rules={[{ required: true, message: "Kategoriya nomini kiriting" }]}
            >
              <Input placeholder="Masalan: Dasturlash" />
            </Form.Item>

            <Form.Item
              name="name"
              label="Kurs nomi"
              rules={[{ required: true, message: "Kurs nomini kiriting" }]}
            >
              <Input placeholder="Backend dasturlash" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Tavsif"
              rules={[{ required: true, message: "Kurs tavsifini kiriting" }]}
            >
              <Input placeholder="Yangi kurs" />
            </Form.Item>

            <Form.Item
              name="duration"
              label="Davomiyligi"
              rules={[{ required: true, message: "Kurs davomiyligini kiriting" }]}
            >
              <Input placeholder="2 yil" />
            </Form.Item>

            <Form.Item
              name="price"
              label="Narxi"
              rules={[{ required: true, message: "Kurs narxini kiriting" }]}
            >
              <Input
                placeholder="1000000"
              />
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


export default CreateCourse;
