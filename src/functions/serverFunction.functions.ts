import type { ServerFunctionClient, ServerFunctionClientArgs } from 'payload'

export const serverFunctionHandler: ServerFunctionClient = async (
  args: ServerFunctionClientArgs,
) => {
  const res = await fetch('/api/server-function', {
    body: JSON.stringify(args),
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`Server function failed: ${errorText}`)
  }

  return res.json()
}
