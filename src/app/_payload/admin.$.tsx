import { payloadAdminSplatRoute } from '@payloadcms/tanstack-start/client'
import { createFileRoute } from '@tanstack/react-router'

import { loadAdminPageRSC } from '../../functions/server.functions.js'

export const Route = createFileRoute('/_payload/admin/$')(
  payloadAdminSplatRoute({ load: loadAdminPageRSC }),
)
