'use client';
import { Form, Input } from "antd";
import './profileForm.css'; 

const ProfileForm = () => {
  const user = {
    first_name: "Davron",
    last_name: "Raimjonov",
    email: "davron_raimjonov4446@mail.ru",
    role: "manager"
  };

  return (
    <Form className="dark" layout="vertical" style={{ display: "flex", gap: "20px", width: "1000px" }}>
      <div style={{ flex: 1 }}>
      <Form.Item label="First Name :" className="dark:!text-white">
          <Input value={user.first_name} readOnly className="custom-input" />
        </Form.Item>
      <Form.Item label="Email :" className="dark:!text-white">
          <Input value={user.email} readOnly className="custom-input" />
        </Form.Item>
      </div>
      <div style={{ flex: 1 }}>
      <Form.Item label="Last Name :" className="dark:!text-white">
          <Input value={user.last_name} readOnly className="custom-input" />
        </Form.Item>
      <Form.Item label="Role :" className="dark:!text-white">
          <Input value={user.role} readOnly className="custom-input" />
        </Form.Item>
      </div>
    </Form>
  );
};

export default ProfileForm;
