import { useState, useEffect } from "react";
import { Drawer, Button, Spin, ConfigProvider, theme } from "antd";
import { AdminUserType } from "@/@types";
import { useEditAdminMutation } from "@/hooks/mutation";
import { useTheme } from "next-themes";

interface RightSidebarProps {
  user?: AdminUserType | null;
  onClose: () => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ user, onClose }) => {
  const { resolvedTheme } = useTheme(); // Используем resolvedTheme вместо theme
  const { mutate, isPending } = useEditAdminMutation();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    status: "",
  });

  const isDarkMode = resolvedTheme === "dark";

  // Стили для инпутов
  const inputClasses = `p-2 rounded border ${
    isDarkMode 
      ? "bg-[#1f2937] text-white border-gray-600" 
      : "bg-[#f7f7f7] text-black border-gray-300"
  }`;

  // Стили для лейблов
  const labelClasses = `mb-1 ${
    isDarkMode ? "text-white" : "text-black"
  }`;

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name ?? "",
        last_name: user.last_name ?? "",
        email: user.email ?? "",
        status: user.status ?? "",
      });
    }
  }, [user]);

  const handleChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!user?._id) return;

    const dataToSend = {
      _id: user._id,
      ...formData,
    };

    mutate(dataToSend, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  // Конфиг для темной темы
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
      },
    },
  };

  return (
    <ConfigProvider theme={isDarkMode ? darkThemeConfig : undefined}>
      <Drawer
        title="Edit Admin"
        placement="right"
        onClose={onClose}
        open={!!user}
        width={600}
        className={isDarkMode ? "dark-drawer" : "light-drawer"}
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
        <form
          className="flex gap-5 p-5 rounded flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="flex-1 flex flex-col gap-5">
            <div className="flex flex-col">
              <label className={labelClasses}>First Name:</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={(e) => handleChange(e.target.value, "first_name")}
                className={inputClasses}
                placeholder="First Name"
              />
            </div>
            <div className="flex flex-col">
              <label className={labelClasses}>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => handleChange(e.target.value, "email")}
                className={inputClasses}
                placeholder="Email"
              />
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-5">
            <div className="flex flex-col">
              <label className={labelClasses}>Last Name:</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={(e) => handleChange(e.target.value, "last_name")}
                className={inputClasses}
                placeholder="Last Name"
              />
            </div>
          </div>
          <Button 
            loading={isPending} 
            type="primary" 
            htmlType="submit" 
            className="!h-[40px]"
          >
            {isPending ? <Spin size="small" /> : "Save"}
          </Button>
        </form>
      </Drawer>
    </ConfigProvider>
  );
};

export default RightSidebar;