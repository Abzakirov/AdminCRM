import { Button, Input, Drawer, Form, Select, DatePicker, ConfigProvider, Spin, theme } from "antd";
import React from "react";
import {  useManagerCreateMutation } from "@/hooks/mutation";
import { useTheme } from "next-themes";

interface AddManagerDrawerProps {
  visible: boolean;
  onClose: () => void;
}

const AddManagerDrawer: React.FC<AddManagerDrawerProps> = ({ visible, onClose }) => {
  const { resolvedTheme } = useTheme();
  const [form] = Form.useForm();
  const { mutate, isPending } = useManagerCreateMutation();
  
  const isDarkMode = resolvedTheme === "dark";

  const onFinish = (values: any) => {
    mutate(values, {
      onSuccess: () => {
        form.resetFields();
        onClose();
      }
    });
  };

  // Конфиг для темной темы
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
      Select: {
        colorBgContainer: "#1f2937",
        colorBorder: "#374151",
        colorText: "white",
      },
      DatePicker: {
        colorBgContainer: "#1f2937",
        colorBorder: "#374151",
        colorText: "white",
      },
    },
  };

  return (
    <ConfigProvider theme={isDarkMode ? darkThemeConfig : undefined}>
      <Drawer
        title="Manager yaratish"
        placement="right"
        onClose={onClose}
        open={visible}
        width={400}
        styles={{
          body: {
            background: isDarkMode ? "#111827" : "#ffffff",
            color: isDarkMode ? "#ffffff" : "#000000",
          },
          header: {
            background: isDarkMode ? "#111827" : "#ffffff",
            borderBottom: isDarkMode ? "1px solid #374151" : "1px solid #f0f0f0",
          },
        }}
      >
        <div className={`p-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
          <h2 className="text-lg font-semibold mb-4">
            Manager yaratish
          </h2>
          <Form
            layout="vertical"
            name="adminForm"
            form={form}
            onFinish={onFinish}
          >
            <Form.Item
              name="first_name"
              label={<span className={isDarkMode ? "text-gray-300" : ""}>First Name</span>}
              rules={[{ required: true, message: "Please enter admin's first name" }]}
            >
              <Input placeholder="Enter admin's first name" />
            </Form.Item>

            <Form.Item
              name="last_name"
              label={<span className={isDarkMode ? "text-gray-300" : ""}>Last Name</span>}
              rules={[{ required: true, message: "Please enter admin's last name" }]}
            >
              <Input placeholder="Enter admin's last name" />
            </Form.Item>

            <Form.Item
              name="email"
              label={<span className={isDarkMode ? "text-gray-300" : ""}>Email</span>}
              rules={[
                { required: true, message: "Please enter admin's email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input placeholder="Enter admin's email" />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span className={isDarkMode ? "text-gray-300" : ""}>Password</span>}
              rules={[
                { required: true, message: "Please enter admin's password" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password placeholder="Enter admin's password" />
            </Form.Item>

            <Form.Item
              name="role"
              label={<span className={isDarkMode ? "text-gray-300" : ""}>Role</span>}
              rules={[{ required: true, message: "Please select admin's role" }]}
            >
              <Select placeholder="Select admin's role">
                <Select.Option value="admin">Admin</Select.Option>
                <Select.Option value="manager">Manager</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="work_date"
              label={<span className={isDarkMode ? "text-gray-300" : ""}>Work Date</span>}
              rules={[{ required: true, message: "Please select work date" }]}
            >
              <DatePicker className="w-full" />
            </Form.Item>

            <div className="flex justify-end gap-2 mt-6">
              <Button 
                type="default" 
                onClick={() => { form.resetFields(); onClose(); }}
                className={isDarkMode ? "bg-gray-700 text-white" : ""}
              >
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={isPending}
                className={isDarkMode ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                {isPending ? <Spin size="small" /> : "Submit"}
              </Button>
            </div>
          </Form>
        </div>
      </Drawer>
    </ConfigProvider>
  );
};

export default AddManagerDrawer;