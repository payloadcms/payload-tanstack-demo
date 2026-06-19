import { NotFoundClient } from '@payloadcms/ui'
import { createFileRoute, notFound, redirect } from '@tanstack/react-router'
import { Fragment, type ReactNode } from 'react'

import { loadAdminPageRSC } from '../../functions/adminPageRSC.functions.js'
import { getAdminMeta } from '@payloadcms/tanstack-start'

export const Route = createFileRoute('/_payload/admin/$')({
  notFoundComponent: AdminNotFound,
  validateSearch: (search: Record<string, unknown>) => search,
  loaderDeps: ({ search }) => ({
    searchKey: JSON.stringify(search),
  }),
  loader: async ({ params, location }) => {
    const data = (await loadAdminPageRSC({
      data: {
        _splat: params._splat ?? '',
        search: Object.fromEntries(new URLSearchParams(location.searchStr)) as Record<
          string,
          string | string[]
        >,
      },
    })) as any
    if (data?._redirect) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error -- TanStack Router requires throwing redirect objects
      throw redirect({ to: data._redirect })
    }
    if (data?._notFound) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error -- TanStack Router requires throwing notFound objects
      throw notFound({
        data: { routeKey: data.routeKey, rscPayload: data.rscPayload },
      })
    }
    return data
  },
  head: ({ loaderData }) => getAdminMeta((loaderData as any)?.metadata),
  component: AdminPage,
})

function AdminNotFound(props: { data?: { routeKey?: string; rscPayload?: ReactNode } }) {
  const rscPayload = props?.data?.rscPayload

  if (!rscPayload) {
    return <NotFoundClient />
  }

  return <Fragment key={props?.data?.routeKey}>{rscPayload}</Fragment>
}

function AdminPage() {
  const data = Route.useLoaderData() as any
  return <Fragment key={data?.routeKey}>{data?.rscPayload}</Fragment>
}
