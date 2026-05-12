import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router'

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
        <style>{`
          @layer payload-default, base, tailwind, payload;
          @layer base {
            html {
              font-family: 'Geist Sans', ui-sans-serif, system-ui, sans-serif;
              line-height: 1.5;
              -webkit-text-size-adjust: 100%;
            }
          }
        `}</style>
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}
