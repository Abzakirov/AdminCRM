"use client";

import { Modal, Form, DatePicker, Input } from "antd";
import { useEffect } from "react";
import { VacationType } from "@/@types";
import { useVacationCreateMutation } from "@/hooks/mutation";

const { RangePicker } = DatePicker;

interface VacationModalProps {
  open: boolean;
  onClose: () => void;
  adminId: string | null;
}

const VacationModal = ({ open, onClose, adminId }: VacationModalProps) => {
  const [form] = Form.useForm();
  const mutation = useVacationCreateMutation();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (!adminId) return;

        const [startDate, endDate] = values.dates;
        const payload: VacationType = {
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          reason: values.reason,
          _id: adminId,
        };

        mutation.mutate(payload, {
          onSuccess: () => {
            form.resetFields();
            onClose();
            
            
          },
        });
      })
      .catch((info) => {
        console.log("Validation failed:", info);
      });
  };

  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open, form]);

  return (
    <Modal
      title="Request Vacation"
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      okText="Submit"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="dates"
          label="Vacation Period"
          rules={[{ required: true, message: "Please select a date range" }]}
        >
          <RangePicker />
        </Form.Item>
        <Form.Item
          name="reason"
          label="Reason"
          rules={[{ required: true, message: "Please enter a reason" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default VacationModal;
