import {
  Button,
  Input,
  Drawer,
  Form,
  Select,
  ConfigProvider,
  Spin,
  theme,
} from "antd";
import React, { useEffect, useRef } from "react";
import { useTeacherCreateMutation } from "@/hooks/mutation";
import { useTheme } from "next-themes";

interface AddTeacherDrawerProps {
  visible: boolean;
  onClose: () => void;
}

const AddTeacherDrawer: React.FC<AddTeacherDrawerProps> = ({
  visible,
  onClose,
}) => {
  const { resolvedTheme } = useTheme();
  const [form] = Form.useForm();
  const { mutate, isPending } = useTeacherCreateMutation();
  const phoneInputRef = useRef<any>(null);

  const isDarkMode = resolvedTheme === "dark";

  const onFinish = (values: any) => {
    mutate(values, {
      onSuccess: () => {
        form.resetFields();
        onClose();
      },
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Ensure +998 stays at the beginning
    if (!value.startsWith("+998")) {
      form.setFieldsValue({ phone: "+998" + value.replace(/[^0-9]/g, "") });
    } else if (value.length < 4) {
      form.setFieldsValue({ phone: "+998" });
    }
  };

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    // Prevent deletion of +998 prefix
    if (
      (e.key === "Backspace" || e.key === "Delete") &&
      input.selectionStart !== null &&
      input.selectionStart <= 4
    ) {
      e.preventDefault();
    }
  };

  const handlePhonePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text/plain");
    const numbersOnly = pastedText.replace(/[^0-9]/g, "");
    const currentValue = form.getFieldValue("phone") || "+998";
    const newValue = currentValue + numbersOnly;
    form.setFieldsValue({ phone: newValue.slice(0, 13) }); // +998 + 9 digits
  };

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({ phone: "+998" });
      setTimeout(() => {
        if (phoneInputRef.current) {
          phoneInputRef.current.focus({ cursor: "end" });
        }
      }, 100);
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
      Select: {
        colorBgContainer: "#1f2937",
        colorBorder: "#374151",
        colorText: "white",
      },
    },
  };

  return (
    <ConfigProvider theme={isDarkMode ? darkThemeConfig : undefined}>
      <Drawer
        title="O'qituvchi qo'shish"
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
          <h2 className="text-lg font-semibold mb-4">O'qituvchi yaratish</h2>
          <Form
            layout="vertical"
            name="teacherForm"
            form={form}
            onFinish={onFinish}
          >
            <Form.Item
              name="first_name"
              label={
                <span className={isDarkMode ? "text-gray-300" : ""}>Ismi</span>
              }
              rules={[{ required: true, message: "Iltimos, ismini kiriting" }]}
            >
              <Input placeholder="Ism kiriting" />
            </Form.Item>

            <Form.Item
              name="last_name"
              label={
                <span className={isDarkMode ? "text-gray-300" : ""}>
                  Familiyasi
                </span>
              }
              rules={[
                { required: true, message: "Iltimos, familiyasini kiriting" },
              ]}
            >
              <Input placeholder="Familiya kiriting" />
            </Form.Item>

            <Form.Item
              name="email"
              label={
                <span className={isDarkMode ? "text-gray-300" : ""}>Email</span>
              }
              rules={[
                { required: true, message: "Iltimos, emailni kiriting" },
                { type: "email", message: "Email noto'g'ri formatda" },
              ]}
            >
              <Input placeholder="Email kiriting" />
            </Form.Item>

            <Form.Item
              name="phone"
              label={
                <span className={isDarkMode ? "text-gray-300" : ""}>
                  Telefon raqami
                </span>
              }
              rules={[
                { required: true, message: "Iltimos, telefon raqamini kiriting" },
                {
                  pattern: /^\+998\d{9}$/,
                  message: "Telefon raqami +998 bilan boshlanishi va 13 ta belgidan iborat bo'lishi kerak",
                },
              ]}
            >
              <Input
                ref={phoneInputRef}
                placeholder="+998901234567"
                onChange={handlePhoneChange}
                onKeyDown={handlePhoneKeyDown}
                onPaste={handlePhonePaste}
                maxLength={13}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={
                <span className={isDarkMode ? "text-gray-300" : ""}>Parol</span>
              }
              rules={[
                { required: true, message: "Iltimos, parolni kiriting" },
                {
                  min: 6,
                  message:
                    "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
                },
              ]}
            >
              <Input.Password placeholder="Parol kiriting" />
            </Form.Item>

            <Form.Item
              name="field"
              label={
                <span className={isDarkMode ? "text-gray-300" : ""}>
                  Fan tili
                </span>
              }
              rules={[
                { required: true, message: "Iltimos, fan tilini tanlang" },
              ]}
            >
              <Select placeholder="Fan tilini tanlang">
                <Select.Option value="Frontend dasturlash">Frontend dasturlash</Select.Option>
                <Select.Option value="Backend dasturlash">Backend dasturlash</Select.Option>
                <Select.Option value="Rus tili">Rus tili</Select.Option>
                <Select.Option value="Ingliz tili">Ingliz tili</Select.Option>
              </Select>
            </Form.Item>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                type="default"
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

export default AddTeacherDrawer;