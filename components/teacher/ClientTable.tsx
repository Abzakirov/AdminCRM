'use client'
import TeacherDarkTable from '@/shared/table/TeacherDarkTable';
import TeachersTable from '@/shared/table/TeacherLightTable';
import { useTheme } from 'next-themes';
import React from 'react'

const ClientTable = () => {
      const { theme } = useTheme();
  return (
    <div>
         {theme === "dark" ? <TeacherDarkTable /> : <TeachersTable />}
         
    </div>
  )
}

export default ClientTable
