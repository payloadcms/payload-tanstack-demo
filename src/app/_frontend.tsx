import { createFileRoute, Outlet } from '@tanstack/react-router'
import { getHeaderData, getFooterData } from '@/functions/frontend.functions'
import { AdminBar } from '@/components/AdminBar'
import { Header } from '@/Header/Component'
import { Footer } from '@/Footer/Component'
import { Providers } from '@/providers'
import React from 'react'
import '@/globals.css'

export const Route = createFileRoute('/_frontend')({
  loader: async () => {
    const [headerData, footerData] = await Promise.all([getHeaderData(), getFooterData()])
    return { headerData, footerData }
  },
  component: FrontendLayout,
})

function FrontendLayout() {
  const { headerData, footerData } = Route.useLoaderData()

  return (
    <Providers>
      <AdminBar adminBarProps={{}} />
      <Header data={headerData} />
      <Outlet />
      <Footer data={footerData} />
    </Providers>
  )
}
