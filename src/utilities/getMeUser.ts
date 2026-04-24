import type { User } from '../payload-types'
import { getClientSideURL } from './getURL'

export const getMeUser = async (args?: {
  nullUserRedirect?: string
  validUserRedirect?: string
}): Promise<{
  token: string
  user: User
}> => {
  const { nullUserRedirect, validUserRedirect } = args || {}

  const meUserReq = await fetch(`${getClientSideURL()}/api/users/me`, {
    credentials: 'include',
  })

  const {
    user,
  }: {
    user: User
  } = await meUserReq.json()

  if (validUserRedirect && meUserReq.ok && user) {
    if (typeof window !== 'undefined') {
      window.location.href = validUserRedirect
    }
  }

  if (nullUserRedirect && (!meUserReq.ok || !user)) {
    if (typeof window !== 'undefined') {
      window.location.href = nullUserRedirect
    }
  }

  return {
    token: '',
    user,
  }
}
