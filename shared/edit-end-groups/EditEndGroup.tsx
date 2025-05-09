"use client";

import React, { useEffect, useState } from "react";
import { Drawer, Button, Spin, ConfigProvider, DatePicker, theme } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useEditEndGroupMutation } from "@/hooks/mutation";
import { useTheme } from "next-themes";

interface EditEndGroupProps {
  group?: {
    _id: string;
    date?: string;
  } | null;
  onClose: () => void;
}

const EditEndGroup: React.FC<EditEndGroupProps> = ({ group, onClose }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  const { mutate, isPending } = useEditEndGroupMutation();

  const [date, setDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (group?.date) {
      setDate(dayjs(group.date));
    }
  }, [group]);

  const handleSave = () => {
    if (!group?._id || !date) return;

    mutate(
      {
        _id: group._id,
        date: date.toISOString(),
      },
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
      DatePicker: {
        colorBgContainer: "#1f2937",
        colorBorder: "#374151",
        colorText: "white",
      },
    },
  };

  return (
    <ConfigProvider theme={isDarkMode ? darkThemeConfig : undefined}>
      <Drawer
        title="Edit Group End Date"
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
            End Date:
          </label>
          <DatePicker
            value={date}
            onChange={(val) => setDate(val)}
            className="w-full"
            format="YYYY-MM-DD"
          />
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

export default EditEndGroup;
