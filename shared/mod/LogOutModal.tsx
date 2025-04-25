"use client";
import { Modal } from "antd";

interface LogOutModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const LogOutModal = ({ open, onConfirm, onCancel }: LogOutModalProps) => {
  return (
    <Modal
      open={open}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Yes"
      cancelText="No"
      title="Logout"
      style={{ height: "300px"}} 
    >
      <p className="text-lg ">Are you sure you want to log out?</p>
    </Modal>
  );
};

export default LogOutModal;
