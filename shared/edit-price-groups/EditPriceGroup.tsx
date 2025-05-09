import React, { useEffect, useState } from "react";
import { Drawer, Button, Spin, ConfigProvider, Input, theme } from "antd";
import { useTheme } from "next-themes";
import { useEditPriceGroupMutation } from "@/hooks/mutation"; 

interface EditPriceGroupProps {
  group?: {
    _id: string;
    price?: number;
  } | null;
  onClose: () => void;
}

const EditPriceGroup: React.FC<EditPriceGroupProps> = ({ group, onClose }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  const { mutate, isPending } = useEditPriceGroupMutation(); 

  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    if (group?.price) {
      setPrice(group.price);
    }
  }, [group]);

  const handleSave = () => {
    if (!group?._id || price === null) return;

    mutate(
      { group_id: group._id, price },
      {
        onSuccess: () => {
          onClose(); 
        },
      }
    );
  };

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
        title="Edit Group Price"
        placement="right"
        onClose={onClose}
        open={!!group}
        width={400}
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
          className="flex flex-col gap-5 p-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <label className={isDarkMode ? "text-white" : "text-black"}>
            Price:
          </label>
          <Input
            
            value={price!}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            className="w-full"
          />
          <Button
            type="primary"
            htmlType="submit"
            className="!h-[40px]"
            loading={isPending} 
          >
            {isPending ? <Spin size="small" /> : "Save"}
          </Button>
        </form>
      </Drawer>
    </ConfigProvider>
  );
};

export default EditPriceGroup;
