"use client";

import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber } from "antd";
import { useTheme } from "next-themes";
import { Calendar, Clock, DollarSign } from "lucide-react";
import { useEditCourseMutation } from "@/hooks/mutation";

interface EditCourseModalProps {
  course: {
    _id?: string;
    name: string | { name: string };
    description: string;
    duration: string;
    price?: number;
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const EditCourseModal = ({
  course,
  isOpen,
  onClose,
  onSuccess,
}: EditCourseModalProps) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [form] = Form.useForm();
  const { mutate: EditCourse } = useEditCourseMutation();

  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue({
        duration: course?.duration || "",
        price: course?.price || 0,
      });
    }
  }, [isOpen, course, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const courseData = {
        course_id: course._id, 
        duration: values.duration,
        price: values.price,
      };
      
      EditCourse(courseData, {
        onSuccess: () => {
          if (onSuccess) {
            onSuccess();
          }
          onClose();
        },
        onError: (error) => {
          console.error("Error editing course:", error);
        }
      });
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const inputStyles = {
    className: `rounded-md ${
      isDarkMode
        ? "!bg-gray-800 border-gray-600 !text-white placeholder-gray-400 hover:border-gray-500 focus:border-purple-500"
        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:border-gray-400 focus:border-purple-500"
    }`,
    style: {
      height: "40px",
      padding: "0 12px",
    },
  };

  const inputNumberStyles = {
    className: `!w-full rounded-md ${
      isDarkMode
        ? "!bg-gray-800 border-gray-600 !text-white hover:border-gray-500 focus:border-purple-500"
        : "bg-white border-gray-300 text-gray-900 hover:border-gray-400 focus:border-purple-500"
    }`,
    controls: false,
    style: {
      height: "40px",
      padding: "0 12px",
    },
  };

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2 py-1 bg-[#1f2937]">
          <Calendar
            size={20}
            className={isDarkMode ? "text-purple-400" : "text-purple-600"}
          />
          <span
            className={`text-lg font-medium ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Kursni tahrirlash
          </span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      okText="Saqlash"
      cancelText="Bekor qilish"
      okButtonProps={{
        className:
          "bg-purple-600 hover:bg-purple-700 border-purple-600 text-white shadow-sm",
      }}
      cancelButtonProps={{
        className: `hover:text-gray-700 hover:border-gray-400 ${
          isDarkMode
            ? "text-gray-300 border-gray-600"
            : "text-gray-500 border-gray-300"
        }`,
      }}
      className="rounded-lg overflow-hidden"
      styles={{
        header: {
          backgroundColor: isDarkMode
            ? "#1f2937 !important"
            : "#fff !important",
       
          color: isDarkMode ? "inherit !important" : "white !important",
          borderRadius: "0.5rem 0.5rem 0 0 !important",
        },
        content: {
          backgroundColor: isDarkMode ? "#1f2937" : "",
          borderRadius: "0.5rem",
          boxShadow: isDarkMode
            ? "0 10px 25px -5px rgba(0, 0, 0, 0.5)"
            : "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
        },
        mask: {
          backgroundColor: isDarkMode
            ? "rgba(0, 0, 0, 0.7)"
            : "rgba(0, 0, 0, 0.45)",
          backdropFilter: "blur(2px)",
        },
        footer: {
          borderTop: isDarkMode ? "1px solid #374151" : "1px solid #e5e7eb",
          padding: "16px 24px",
        },
      
        body: {
          padding: "24px",
        },
      }}
      onOk={handleSubmit}
    >
      <Form form={form} layout="vertical" className="mt-2">
        <div
          className={`p-4 mb-4 rounded-md ${
            isDarkMode ? "!bg-gray-800/50" : "bg-purple-50"
          }`}
        >
          <div
            className={`text-base font-medium mb-1 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            {typeof course?.name === "object" ? course.name.name : course?.name}
          </div>
          <div
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {course?.description}
          </div>
        </div>

        <Form.Item
          label={
            <div className="flex items-center space-x-2">
              <Clock
                size={16}
                className={isDarkMode ? "text-gray-400" : "text-gray-500"}
              />
              <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                Davomiyligi
              </span>
            </div>
          }
          name="duration"
          rules={[{ required: true, message: "Davomiylikni kiriting" }]}
        >
          <Input placeholder="Masalan: 6 oy, 1 yil..." {...inputStyles} />
        </Form.Item>

        <Form.Item
          label={
            <div className="flex items-center space-x-2">
              <DollarSign
                size={16}
                className={isDarkMode ? "text-gray-400" : "text-gray-500"}
              />
              <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                Narxi (so'm)
              </span>
            </div>
          }
          name="price"
          rules={[{ required: true, message: "Narxni kiriting" }]}
        >
          <InputNumber {...inputNumberStyles} placeholder="Kurs narxini kiriting" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCourseModal;