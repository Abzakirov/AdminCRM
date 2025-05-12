"use client";

import React, { useState } from "react";
import {
  Calendar,
  DollarSign,
  EditIcon,
  Trash2,
  AlertTriangle,
  Pause,
  Play,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/hooks/useAxios/useAxios";
import { Button, Modal, Spin, Tooltip } from "antd";
import EditCourseModal from "@/shared/mod/EditCourse";
import { useDeleteCourseMutation, useFreezeCourseMutation, useUnFreezeCourseMutation } from "@/hooks/mutation";

interface Course {
  _id?: string;
  name: string | { name: string };
  description: string;
  duration: string;
  price?: number;
}

const CourseCardItem = ({ course }: { course: Course }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenFreezeModal, setIsOpenFreezeModal] = useState(false);
  const [isOpenUnFreezeModal, setIsOpenUnFreezeModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const {mutate: freezeMutation, isPending: isFreezing}=useFreezeCourseMutation();
  const {mutate: UnfreezeMutation, isPending: isUnFreezing}=useUnFreezeCourseMutation();

  const { mutate: deleteMutation, isPending: isDeleting } =
    useDeleteCourseMutation();

  const handleDeleteConfirm = () => {
    deleteMutation({ course_id: course._id as string });
    setIsDeleteModalOpen(false);
  };
  const handleFreezeConfirm = () => {
    freezeMutation(course._id as string); 
    setIsOpenFreezeModal(false);
  };
  const handleUnFreezeConfirm = () => {
    UnfreezeMutation(course._id as string); 
    setIsOpenUnFreezeModal(false);
  };
  

  const getCourseName = () => {
    return typeof course.name === "object" ? course.name.name : course.name;
  };

  const colors = {
    background: isDarkMode ? "#1f2937" : "#ffffff",
    text: isDarkMode ? "#e5e7eb" : "#374151",
    border: isDarkMode ? "#374151" : "#e5e7eb",
    itemText: isDarkMode ? "#f87171" : "#ef4444",
  };

  return (
    <div className="w-full p-2">
      <div
        className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-4">
          <h2 className="text-lg font-bold text-white line-clamp-1">
            {getCourseName()}
          </h2>
          <p className="text-purple-100 text-sm mt-1 line-clamp-2">
            Kurs haqida: {course.description}
          </p>
          <p className="text-purple-100 text-sm mt-1 line-clamp-2">
            Dovomiyligi: {course.duration}
          </p>
        </div>

        <div className="p-4 flex-grow">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="bg-purple-100 dark:bg-gray-700 p-1.5 rounded-full">
                <Calendar className="text-purple-600 dark:text-purple-400 w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Davomiyligi
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {course.duration}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-purple-100 dark:bg-gray-700 p-1.5 rounded-full">
                <DollarSign className="text-purple-600 dark:text-purple-400 w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Narxi
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {course.price ? course.price.toLocaleString("uz-UZ") : "0"}{" "}
                  so'm
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`absolute bottom-0 left-0 right-0 flex justify-center gap-2 bg-white/80 dark:bg-gray-800/80 py-2 transform transition-all duration-300 ${
            isHovered
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0"
          }`}
        >
          <Tooltip title="Tahrirlash">
            <Button type="text" onClick={() => setIsModalOpen(true)}>
              <EditIcon className="dark:text-white text-gray-900" />
            </Button>
          </Tooltip>
          
          <Tooltip title="O'chirish">
            <Button
              type="text"
              onClick={() => setIsDeleteModalOpen(true)}
              loading={isDeleting}
            >
              <Trash2 className="dark:text-red-500 text-gray-900" />
            </Button>
          </Tooltip>
          
          <Tooltip title="To'xtatish">
            
            <Button type="text"
              onClick={() => setIsOpenFreezeModal(true)}
              loading={isFreezing }>
              
              <Pause className="dark:text-white text-gray-900" />
            </Button>
          </Tooltip>
          
          <Tooltip title="Davom etish"
          >
            <Button type="text"
              onClick={() => setIsOpenUnFreezeModal(true)}>
              <Play className="dark:text-white text-gray-900" />
            </Button>
          </Tooltip>
        </div>
      </div>

      <EditCourseModal
        course={course}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <Modal
        title={
          <div className="flex items-center gap-2 dark:bg-[#1f2937]">
            <AlertTriangle size={20} className="text-red-500" />
            <span className="text-lg font-bold text-red-500">
              O'chirishni tasdiqlang
            </span>
          </div>
        }
        open={isDeleteModalOpen}
        onOk={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="O'chirish"
        cancelText="Bekor qilish"
        okButtonProps={{
          danger: true,
          loading: isDeleting,
          className: "bg-red-500 hover:bg-red-600 border-red-500 mt-3",
        }}
        cancelButtonProps={{
          className: isDarkMode
            ? "border-gray-600 text-gray-300 hover:text-white hover:border-gray-500"
            : "border-gray-300 text-gray-700 hover:border-gray-400",
        }}
        className={isDarkMode ? "dark" : "light"}
        centered
        styles={{
          header: {
            borderBottom: `1px solid ${colors.border}`,
          },
          body: {
            background: colors.background,
            color: colors.text,
          },
          footer: {
            borderTop: `1px solid ${colors.border}`,
          },
          mask: {
            backgroundColor: isDarkMode
              ? "rgba(0, 0, 0, 0.6)"
              : "rgba(0, 0, 0, 0.45)",
          },
          content: {
            backgroundColor: isDarkMode ? "#1f2937" : "",
            borderRadius: "0.5rem",
            boxShadow: isDarkMode
              ? "0 10px 25px -5px rgba(0, 0, 0, 0.5)"
              : "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <p className={`text-${isDarkMode ? "gray-300" : "gray-700"} mb-4`}>
          Siz rostdan ham{" "}
          <span className="font-bold" style={{ color: colors.itemText }}>
            {getCourseName()}
          </span>{" "}
          ni o'chirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi.
        </p>

        {isDeleting && (
          <div className="flex justify-center mt-4">
            <Spin />
          </div>
        )}
      </Modal>
      <Modal
        title={
          <div className="flex items-center gap-2 dark:bg-[#1f2937]">
            <AlertTriangle size={20} className="text-red-500" />
            <span className="text-lg font-bold text-red-500">
             Davov etishni tasdiqlang
            </span>
          </div>
        }
        open={isOpenUnFreezeModal}
        onOk={handleUnFreezeConfirm}
        onCancel={() => setIsOpenUnFreezeModal(false)}
        okText="Davom etish"
        cancelText="Bekor qilish"
        okButtonProps={{
          danger: true,
          loading: isUnFreezing,
          className: "bg-red-500 hover:bg-red-600 border-red-500 mt-3",
        }}
        cancelButtonProps={{
          className: isDarkMode
            ? "border-gray-600 text-gray-300 hover:text-white hover:border-gray-500"
            : "border-gray-300 text-gray-700 hover:border-gray-400",
        }}
        className={isDarkMode ? "dark" : "light"}
        centered
        styles={{
          header: {
            borderBottom: `1px solid ${colors.border}`,
          },
          body: {
            background: colors.background,
            color: colors.text,
          },
          footer: {
            borderTop: `1px solid ${colors.border}`,
          },
          mask: {
            backgroundColor: isDarkMode
              ? "rgba(0, 0, 0, 0.6)"
              : "rgba(0, 0, 0, 0.45)",
          },
          content: {
            backgroundColor: isDarkMode ? "#1f2937" : "",
            borderRadius: "0.5rem",
            boxShadow: isDarkMode
              ? "0 10px 25px -5px rgba(0, 0, 0, 0.5)"
              : "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <p className={`text-${isDarkMode ? "gray-300" : "gray-700"} mb-4`}>
          Siz rostdan ham{" "}
          <span className="font-bold" style={{ color: colors.itemText }}>
            {getCourseName()}
          </span>{" "}
          gruhni davom ettirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi.
        </p>

        {isDeleting && (
          <div className="flex justify-center mt-4">
            <Spin />
          </div>
        )}
      </Modal>
      <Modal
        title={
          <div className="flex items-center gap-2 dark:bg-[#1f2937]">
            <AlertTriangle size={20} className="text-red-500" />
            <span className="text-lg font-bold text-red-500">
              To'xtatishni tasdiqlang
            </span>
          </div>
        }
        open={isOpenFreezeModal}
        onOk={handleFreezeConfirm}
        onCancel={() => setIsOpenFreezeModal(false)}
        okText="To'xtatish"
        cancelText="Bekor qilish"
        okButtonProps={{
          danger: true,
          loading: isDeleting,
          className: "bg-red-500 hover:bg-red-600 border-red-500 mt-3",
        }}
        cancelButtonProps={{
          className: isDarkMode
            ? "border-gray-600 text-gray-300 hover:text-white hover:border-gray-500"
            : "border-gray-300 text-gray-700 hover:border-gray-400",
        }}
        className={isDarkMode ? "dark" : "light"}
        centered
        styles={{
          header: {
            borderBottom: `1px solid ${colors.border}`,
          },
          body: {
            background: colors.background,
            color: colors.text,
          },
          footer: {
            borderTop: `1px solid ${colors.border}`,
          },
          mask: {
            backgroundColor: isDarkMode
              ? "rgba(0, 0, 0, 0.6)"
              : "rgba(0, 0, 0, 0.45)",
          },
          content: {
            backgroundColor: isDarkMode ? "#1f2937" : "",
            borderRadius: "0.5rem",
            boxShadow: isDarkMode
              ? "0 10px 25px -5px rgba(0, 0, 0, 0.5)"
              : "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <p className={`text-${isDarkMode ? "gray-300" : "gray-700"} mb-4`}>
          Siz rostdan ham{" "}
          <span className="font-bold" style={{ color: colors.itemText }}>
            {getCourseName()}
          </span>{" "}
          ni o'chirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi.
        </p>

        {isDeleting && (
          <div className="flex justify-center mt-4">
            <Spin />
          </div>
        )}
      </Modal>
    </div>
  );
};

const CourseCard = () => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  const { data: courses, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await axiosInstance.get("/course/get-courses");
      return res.data.data;
    },
  });
  console.log(courses)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p
          className={`text-lg ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Hozircha kurslar mavjud emas
        </p>
      </div>
    );
  }

  return (
    <div className={`p-4 ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {courses.map((course: Course) => (
          <CourseCardItem key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default CourseCard;