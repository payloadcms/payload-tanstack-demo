import { ProgressBar, RootProvider } from '@payloadcms/ui'
import { TanStackRouterAdapter } from '@payloadcms/tanstack-start/client'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import '@/payload-foundation.scss'
import '@payloadcms/ui/scss/app.scss'
import '@/payload-overrides.css'

import { getLayoutDataFn } from '../functions/layout.functions'
import { serverFunctionHandler } from '../functions/serverFunction.functions'
import { switchLanguageFn } from '../functions/switchLanguage.functions'

export const Route = createFileRoute('/_payload')({
  loader: () => getLayoutDataFn(),
  component: PayloadLayout,
  head: () => ({
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Roboto+Mono:wght@100..700&display=swap',
      },
    ],
  }),
})

function PayloadLayout() {
  const data = Route.useLoaderData()

  return (
    <>
      <RootProvider
        config={data.clientConfig}
        dateFNSKey={data.dateFNSKey}
        fallbackLang={data.fallbackLang}
        highContrastMode={false}
        isNavOpen={data.isNavOpen}
        languageCode={data.languageCode}
        languageOptions={data.languageOptions}
        locale={data.locale}
        permissions={data.user ? data.permissions : null}
        RouterAdapter={TanStackRouterAdapter}
        serverFunction={serverFunctionHandler}
        switchLanguageServerAction={async (lang: string) => {
          await switchLanguageFn({ data: lang })
        }}
        theme={data.theme}
        translations={data.translations}
        user={data.user}
      >
        <ProgressBar />
        <Outlet />
      </RootProvider>
      <div id="portal" />
    </>
  )
}
