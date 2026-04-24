import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import { InitTheme } from '@/providers/Theme/InitTheme'

export const Route = createRootRoute({
  component: RootComponent,
  head: () => ({
    links: [
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
    ],
  }),
})

function RootComponent() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <InitTheme />
      </head>
      <body className="font-sans">
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}
