import InfoAdmin from '@/components/InfoAdmin/InfoAdmin'
import React from 'react'

const InfoAdminPage = ({ params }: { params: { info_admin_id: string } }) => {
  return (
    <InfoAdmin id={params.info_admin_id} />
  )
}

export default InfoAdminPage