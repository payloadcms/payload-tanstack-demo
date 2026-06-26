// `@payloadcms/figma`'s client `DefaultLoginButton` imports `useSearchParams`
// from `next/navigation.js`, a Next-only API that doesn't resolve outside a
// Next app router. This app runs on TanStack Start, so we shim the one export
// figma uses with a non-reactive snapshot of the current URL's query string.
export function useSearchParams(): URLSearchParams {
  if (typeof window === 'undefined') return new URLSearchParams()
  return new URLSearchParams(window.location.search)
}
