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
import React, { useEffect, useRef, useState } from "react";
import { useStudentCreateMutation } from "@/hooks/mutation";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/hooks/useAxios/useAxios";

// Добавляем хук для debounce
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

interface CreateStudentProps {
  visible: boolean;
  onClose: () => void;
}

interface GroupType {
  _id: string;
  name: string;
}

const CreateStudent: React.FC<CreateStudentProps> = ({
  visible,
  onClose,
}) => {
  const { resolvedTheme } = useTheme();
  const [form] = Form.useForm();
  const { mutate, isPending } = useStudentCreateMutation();
  const phoneInputRef = useRef<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const isDarkMode = resolvedTheme === "dark";

  const { data: groups = [], isLoading: isGroupsLoading } = useQuery({
    queryKey: ["search-group", debouncedSearchTerm],
    queryFn: async () => {
      if (!debouncedSearchTerm) return [];
      const response = await axiosInstance.get("/student/search-group", {
        params: { name: debouncedSearchTerm },
      });
      return response.data.data;
    },
    enabled: !!debouncedSearchTerm,
  });

  const onFinish = (values: any) => {
    const formattedValues = {
      ...values,
      groups: [{ group: values.group }],
    };
    delete formattedValues.group;

    mutate(formattedValues, {
      onSuccess: () => {
        form.resetFields();
        onClose();
      },
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value.startsWith("+998")) {
      form.setFieldsValue({ phone: "+998" + value.replace(/[^0-9]/g, "") });
    } else if (value.length < 4) {
      form.setFieldsValue({ phone: "+998" });
    }
  };

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
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
    form.setFieldsValue({ phone: newValue.slice(0, 13) });
  };

  const handleSelectSearch = (value: string) => {
    setSearchTerm(value);
  };

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({ phone: "+998" });
      setSearchTerm("");
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
        title="Talaba qo'shish"
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
          <h2 className="text-lg font-semibold mb-4">Yangi talaba yaratish</h2>
          <Form
            layout="vertical"
            name="studentForm"
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
              rules={[{ required: true, message: "Iltimos, familiyasini kiriting" }]}
            >
              <Input placeholder="Familiya kiriting" />
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
              name="group"
              label={
                <span className={isDarkMode ? "text-gray-300" : ""}>
                  Guruh
                </span>
              }
              rules={[{ required: true, message: "Iltimos, guruhni tanlang" }]}
            >
              <Select 
                placeholder="Guruhni tanlang"
                showSearch
                loading={isGroupsLoading}
                onSearch={handleSelectSearch}
                filterOption={false}
                notFoundContent={
                  isGroupsLoading ? (
                    <Spin size="small" />
                  ) : debouncedSearchTerm ? (
                    "Guruh topilmadi"
                  ) : (
                    "Qidirish uchun guruh nomini yozing"
                  )
                }
              >
                {groups.map((group: GroupType) => (
                  <Select.Option key={group._id} value={group._id}>
                    {group.name}
                  </Select.Option>
                ))}
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

export default CreateStudent;