"use client";
import { Modal, ConfigProvider, theme } from "antd";
import { useTheme } from "next-themes";

interface LogOutModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const LogOutModal = ({ open, onConfirm, onCancel }: LogOutModalProps) => {
  const { theme: currentTheme } = useTheme();

  // Стили для dark темы
  const darkThemeStyles = {
    modal: {
      content: {
        backgroundColor: "#111827",
        color: "#F3F4F6",
        borderColor: "#1F2937",
      },
      header: {
        backgroundColor: "#111827",
        color: "#F3F4F6",
        borderBottom: "1px solid #1F2937",
      },
      footer: {
        backgroundColor: "#111827",
        borderTop: "1px solid #1F2937",
      },
      body: {
        color: "#F3F4F6",
      },
    },
    okButton: {
      backgroundColor: "#4338CA",
      borderColor: "#4338CA",
      color: "#FFFFFF",
      marginTop: 16,
    },
    cancelButton: {
      backgroundColor: "#1F2937",
      borderColor: "#1F2937",
      color: "#F3F4F6",
      marginTop: 16,
    }
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Modal
        open={open}
        onOk={onConfirm}
        onCancel={onCancel}
        okText="Ha"
        cancelText="Yoq"
        title={<span className={currentTheme === 'dark' ? 'text-white ' : ''}>Logout</span>}
        style={{ height: "300px" }}
        styles={currentTheme === 'dark' ? darkThemeStyles.modal : {}}
        okButtonProps={{
          style: currentTheme === 'dark' ? darkThemeStyles.okButton : {},
        }}
        cancelButtonProps={{
          style: currentTheme === 'dark' ? darkThemeStyles.cancelButton : {},
        }}
      >
        <p className={`text-lg mt-2 ${currentTheme === 'dark' ? 'text-gray-100' : ''}`}>
        Tizimdan chiqib ketishga rozimisiz?
        </p>
      </Modal>
    </ConfigProvider>
  );
};

export default LogOutModal;