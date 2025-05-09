"use client";

import React from 'react';
import { Calendar, DollarSign } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/hooks/useAxios/useAxios';

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
        <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Hozircha kurslar mavjud emas
        </p>
      </div>
    );
  }

  return (
    <div className={`p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {courses.map((course: any) => (
          <div key={course._id || course.id} className="w-full p-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col">
              <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-4">
                <h2 className="text-lg font-bold text-white line-clamp-1">
                  {typeof course.name === 'object' ? course.name.name : course.name}
                </h2>
                <p className="text-purple-100 text-sm mt-1 line-clamp-2">
                  {course.description}
                </p>
              </div>

              <div className="p-4 flex-grow">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-purple-100 dark:bg-gray-700 p-1.5 rounded-full">
                      <Calendar className="text-purple-600 dark:text-purple-400 w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Davomiyligi</p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">{course.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="bg-purple-100 dark:bg-gray-700 p-1.5 rounded-full">
                      <DollarSign className="text-purple-600 dark:text-purple-400 w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Narxi</p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">
                        {course.price ? course.price.toLocaleString('uz-UZ') : '0'} so'm
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseCard;
