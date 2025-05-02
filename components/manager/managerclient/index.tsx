'use client'
import ManagerTable from '@/shared/table';
import ManagerLightTable from '@/shared/table/ManagerLightTable';
import { useTheme } from 'next-themes';
import React from 'react'

const ManagerClient = () => {
      const { theme } = useTheme();
  return (
    <div>
         {theme === "dark" ? <ManagerTable /> : <ManagerLightTable />}
         
    </div>
  )
}

export default ManagerClient
