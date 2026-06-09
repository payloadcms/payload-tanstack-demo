import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router'

import { getInitialHtmlAttrsFn } from '../functions/theme.functions'

export const Route = createRootRoute({
  // Resolve admin theme / language / text-direction server-side so `<html>`
  // gets the right `data-theme`/`lang`/`dir` on first paint (mirrors Next).
  loader: () => getInitialHtmlAttrsFn(),
  component: RootComponent,
  head: () => ({
    links: [
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
    ],
  }),
})

function RootComponent() {
  const { dir, languageCode, theme } = Route.useLoaderData()

  return (
    <html data-theme={theme} dir={dir} lang={languageCode} suppressHydrationWarning>
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
