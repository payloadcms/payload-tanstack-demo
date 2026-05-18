import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from '../../utilities/revalidation'

export const revalidateFooter: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating footer`)
    revalidateTag('footer')
  }

  return doc
}
