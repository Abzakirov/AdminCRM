import {
  Button,
  Input,
  Drawer,
  Form,
  Select,
  ConfigProvider,
  Spin,
  theme,
  DatePicker,
  InputNumber,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useGroupCreateMutation } from "@/hooks/mutation";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/hooks/useAxios/useAxios";
import dayjs from "dayjs";

// Debounce хук
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

interface CreateGroupProps {
  visible: boolean;
  onClose: () => void;
}

interface GroupType {
  _id: string;
  name: string;
}

const CreateGroup: React.FC<CreateGroupProps> = ({ visible, onClose }) => {
  const { resolvedTheme } = useTheme();
  const [form] = Form.useForm();
  const { mutate: createGroup, isPending } = useGroupCreateMutation();
  const phoneInputRef = useRef<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const isDarkMode = resolvedTheme === "dark";

  const { data: groups = [], isLoading: isGroupsLoading } = useQuery({
    queryKey: ["search-group", debouncedSearchTerm],
    queryFn: async () => {
      if (!debouncedSearchTerm) return [];
      const response = await axiosInstance.get("/group/search-teacher", {
        params: { name: debouncedSearchTerm },
      });
      return response.data.data;
    },
    enabled: !!debouncedSearchTerm,
  });

  const onFinish = (values: any) => {
    const payload = {
      ...values,
      groups: [{ group: values.group }],
      started_group: values.started_group?.format("YYYY-MM-DD"),
    };
    delete payload.group;

    createGroup(payload, {
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
    if ((e.key === "Backspace" || e.key === "Delete") && input.selectionStart !== null && input.selectionStart <= 4) {
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

  const handleSelectSearch = (value: string) => setSearchTerm(value);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({ phone: "+998" });
      setSearchTerm("");
      setTimeout(() => {
        if (phoneInputRef.current) phoneInputRef.current.focus({ cursor: "end" });
      }, 100);
    }
  }, [visible]);

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
        colorText: "white",
        colorBorder: "#374151",
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
          body: { background: isDarkMode ? "#111827" : "#ffffff" },
          header: {
            background: isDarkMode ? "#111827" : "#ffffff",
            borderBottom: isDarkMode ? "1px solid #374151" : "1px solid #f0f0f0",
          },
        }}
      >
        <div className={`p-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
          <Form layout="vertical" form={form} onFinish={onFinish}>
            <Form.Item
              name="first_name"
              label="Ismi"
              rules={[{ required: true, message: "Ismni kiriting" }]}
            >
              <Input placeholder="Ism kiriting" />
            </Form.Item>

            <Form.Item
              name="last_name"
              label="Familiyasi"
              rules={[{ required: true, message: "Familiyani kiriting" }]}
            >
              <Input placeholder="Familiya kiriting" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Telefon raqami"
              rules={[
                { required: true, message: "Telefon raqamini kiriting" },
                {
                  pattern: /^\+998\d{9}$/,
                  message: "Format: +998XXXXXXXXX",
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
              label="Ustoz"
              rules={[{ required: true, message: "Guruhni tanlang" }]}
            >
              <Select
                showSearch
                placeholder="Guruhni tanlang"
                loading={isGroupsLoading}
                onSearch={handleSelectSearch}
                filterOption={false}
                notFoundContent={
                  isGroupsLoading ? <Spin size="small" /> : debouncedSearchTerm ? "Topilmadi" : "Qidirish uchun yozing"
                }
              >
                {groups.map((group: GroupType) => (
                  <Select.Option key={group._id} value={group._id}>
                    {group.name}
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

            <Form.Item
              name="price"
              label="To'lov narxi"
              rules={[{ required: true, message: "Narxini kiriting" }]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                formatter={(val) => `${val} so'm`}
                placeholder="Masalan: 500000"
              />
            </Form.Item>

            <div className="flex justify-end gap-2 mt-6">
              <Button onClick={() => { form.resetFields(); onClose(); }} className={isDarkMode ? "bg-gray-700 text-white" : ""}>
                Bekor qilish
              </Button>
              <Button type="primary" htmlType="submit" loading={isPending} className={isDarkMode ? "bg-blue-600 hover:bg-blue-700" : ""}>
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
