import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from '../../utilities/revalidation'

export const revalidateHeader: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating header`)
    revalidateTag('header')
  }

  return doc
}
