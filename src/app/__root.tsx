import { withPayloadRoot } from '@payloadcms/tanstack-start/client'
import { createRootRoute, HeadContent, Scripts } from '@tanstack/react-router'

export const Route = createRootRoute({
  head: () => ({
    links: [
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Roboto+Mono:wght@100..700&display=swap',
      },
    ],
  }),
  // Single Payload integration touch point: `withPayloadRoot` renders the
  // Payload admin document shell on `/admin` routes and our own shell
  // everywhere else. No root loader, no manual theme/html threading.
  shellComponent: withPayloadRoot(MarketingHtml),
})

// Frontend `globals.css` is wrapped in `@layer tailwind` (see
// `postcss-wrap-layer.js`), and Payload's UI styles live in earlier layers
// such as `payload-default`. With cascade layers, the layer declared LAST
// wins, so `tailwind` must be ordered after Payload's layers for the
// frontend's typography/utilities (e.g. the `prose` hero heading) to apply.
// Previously this happened only by accident — `globals.css` was injected by
// client JS after hydration, so it loaded last (causing a FOUC). Now that the
// stylesheet is render-blocking, we pin the layer order explicitly so the
// cascade is deterministic regardless of stylesheet load order. This shell is
// frontend-only (Payload renders its own document on `/admin`), so it does not
// affect the admin UI.
const layerOrder = '@layer base, properties, utilities, payload, payload-default, tailwind;'

function MarketingHtml({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          A hoistable style (has `href` + `precedence`) so React manages it as a
          resource. It is rendered before `HeadContent`, so its precedence group
          is encountered first and React places it above every other stylesheet
          in <head> — guaranteeing the layer order is parsed before any CSS that
          declares those layers.
        */}
        <style href="frontend-layer-order" precedence="frontend-layer-order">
          {layerOrder}
        </style>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
