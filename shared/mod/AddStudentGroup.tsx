import React, { useState, useEffect } from "react";
import { Modal, Form, Select, DatePicker, Button, ConfigProvider, Spin, theme } from "antd";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/hooks/useAxios/useAxios";
import { useAddStudentGroupMutation } from "@/hooks/mutation";
import dayjs from "dayjs";
import { StudentUserType } from "@/@types";

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

interface GroupType {
  _id: string;
  name: string;
}

interface AddStudentToGroupModalProps {
  open: boolean;
  onClose: () => void;
  student: StudentUserType | null;
  isDarkMode?: boolean;
}

const AddStudentToGroupModal: React.FC<AddStudentToGroupModalProps> = ({
  open,
  onClose,
  student,
  isDarkMode = true,
}) => {
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { mutate: addStudentToGroup, isPending } = useAddStudentGroupMutation();
  const {  refetch } = useQuery({
    queryKey: ["students"],
    enabled: false,
  });

  const { data: groups = [], isLoading: isGroupsLoading } = useQuery({
    queryKey: ["search-group", debouncedSearchTerm],
    queryFn: async () => {
      if (!debouncedSearchTerm) return [];
      const response = await axiosInstance.get("/student/search-group", {
        params: { name: debouncedSearchTerm },
      });
      return response.data.data;
    },
    enabled: !!debouncedSearchTerm && open,
  });

  useEffect(() => {
    if (open) {
      form.resetFields();
      setSearchTerm("");
    }
  }, [open, form]);

  const handleSelectSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (student) {
        const payload = {
          student_id: student._id,
          group_id: values.group_id,
          joinedAt: values.joinedAt.format("YYYY-MM-DD"),
        };

        addStudentToGroup(payload, {
          onSuccess: () => {
            form.resetFields();
            onClose();
            refetch();
          },
        });
      }
    });
  };

  const darkThemeConfig = {
    algorithm: theme.darkAlgorithm,
    components: {
      Modal: {
        contentBg: "#1f2937",
        headerBg: "#1f2937",
        titleColor: "#ffffff",
      },
      Button: {
        defaultBg: "#374151",
        defaultColor: "white",
        primaryColor: "white",
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
        colorPrimary: "#4f46e5",
        colorTextPlaceholder: "#6b7280",
      },
      Form: {
        labelColor: "#d1d5db",
      }
    },
  };

  return (
    <ConfigProvider theme={isDarkMode ? darkThemeConfig : undefined}>
      <Modal
        title="Talabani guruhga qo'shish"
        open={open}
        onCancel={onClose}
        footer={null}
        destroyOnClose
      >
        <div className={`p-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
          {student && (
            <p className="mb-4">
              <strong>
                {student.first_name} {student.last_name}
              </strong>{" "}
              uchun guruh tanlang
            </p>
          )}

          <Form form={form} layout="vertical">
            <Form.Item
              name="group_id"
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

            <Form.Item
              name="joinedAt"
              label={
                <span className={isDarkMode ? "text-gray-300" : ""}>
                  Qo'shilgan sana
                </span>
              }
              initialValue={dayjs()}
              rules={[{ required: true, message: "Iltimos, sanani tanlang" }]}
            >
              <DatePicker 
                style={{ width: "100%" }} 
                format="YYYY-MM-DD" 
              />
            </Form.Item>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                type="default"
                onClick={onClose}
                className={isDarkMode ? "bg-gray-700 text-white" : ""}
              >
                Bekor qilish
              </Button>
              <Button
                type="primary"
                onClick={handleSubmit}
                loading={isPending}
                className={isDarkMode ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                {isPending ? <Spin size="small" /> : "Qo'shish"}
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default AddStudentToGroupModal;