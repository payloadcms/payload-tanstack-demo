import { getServerSideURL } from './getURL'

type OpenGraph = Record<string, unknown>

const defaultOpenGraph: OpenGraph = {
  type: 'website',
  description: 'An open-source website built with Payload and TanStack Start.',
  images: [
    {
      url: `${getServerSideURL()}/website-template-OG.webp`,
    },
  ],
  siteName: 'Payload Website Template',
  title: 'Payload Website Template',
}

export const mergeOpenGraph = (og?: OpenGraph): OpenGraph => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
