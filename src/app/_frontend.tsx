import { createFileRoute, Outlet } from '@tanstack/react-router'
import { getHeaderData, getFooterData } from '@/functions/frontend.functions'
import { AdminBar } from '@/components/AdminBar'
import { Header } from '@/Header/Component'
import { Footer } from '@/Footer/Component'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { Providers } from '@/providers'
import React from 'react'
// Import the stylesheet as a URL so it can be emitted as a render-blocking
// `<link rel="stylesheet">` in the initial SSR HTML. A bare side-effect import
// (`import '@/globals.css'`) is only injected by client JS after hydration,
// leaving the first paint unstyled and causing a visible layout jump (FOUC).
// The CSS cascade is made order-independent by the `@layer` statement in
// `__root.tsx`, so it is safe to load this early.
import globalsCss from '@/globals.css?url'

export const Route = createFileRoute('/_frontend')({
  head: () => ({
    links: [{ rel: 'stylesheet', href: globalsCss }],
  }),
  loader: async () => {
    const [headerData, footerData] = await Promise.all([getHeaderData(), getFooterData()])
    return { headerData, footerData }
  },
  component: FrontendLayout,
})

function FrontendLayout() {
  const { headerData, footerData } = Route.useLoaderData()

  return (
    <div data-frontend="" className="font-sans">
      <InitTheme />
      <Providers>
        <AdminBar adminBarProps={{}} />
        <Header data={headerData} />
        <Outlet />
        <Footer data={footerData} />
      </Providers>
    </div>
  )
}
