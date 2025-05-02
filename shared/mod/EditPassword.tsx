import { UserType } from "@/@types";
import { useEditPasswordMutation } from "@/hooks/mutation";
import { Button, Input, Modal, Form } from "antd";
import React, { useState } from "react";

interface EditPasswordProps {
  visible: boolean;
  onClose: () => void;
  user: UserType;
}

const EditPassword: React.FC<EditPasswordProps> = ({ visible, onClose, user }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { mutate } = useEditPasswordMutation();

  const handleFinish = (values: any) => {
    setLoading(true);

    mutate(
      {
        user_id: user._id,
        current_password: values.current_password,
        new_password: values.new_password,
      },
      {
        onSuccess: () => {
          form.resetFields();
          onClose();
        },
        onSettled: () => {
          setLoading(false);
        },
      }
    );
  };

  return (
    <Modal
      title="Edit Password"
      open={visible}
      onCancel={onClose}
      footer={null}
      maskClosable={false}
      width={400}
      destroyOnClose
      className="dark:text-white"
    >
      <Form
        form={form}
        layout="vertical"
        preserve={false}
        onFinish={handleFinish}
      >
        <Form.Item
          name="current_password"
          label="Current Password"
          rules={[{ required: true, message: "Please enter your current password" }]}
        >
          <Input.Password placeholder="Enter current password" />
        </Form.Item>

        <Form.Item
          name="new_password"
          label="New Password"
          rules={[
            { required: true, message: "Please enter your new password" },
            { min: 8, message: "Password must be at least 8 characters" },
          ]}
        >
          <Input.Password placeholder="Enter new password" />
        </Form.Item>

        <div className="flex justify-end gap-3 mt-4">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update Password
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EditPassword;
