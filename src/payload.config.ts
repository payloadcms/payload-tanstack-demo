import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest, createLocalReq } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { seed } from './endpoints/seed'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      beforeLogin: ['@/components/BeforeLogin'],
      beforeDashboard: ['@/components/BeforeDashboard'],
      // afterDashboard: ['@/components/AfterDashboard'],
      afterNavLinks: ['@/components/AfterNavLinks'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
      // TanStack Start keeps its import map at `src/importMap.js` (there's no
      // Next.js `app/(payload)/admin` folder for the CLI to discover), so point
      // `payload generate:importmap` at it explicitly.
      importMapFile: path.resolve(dirname, 'importMap.js'),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
    },
  }),
  collections: [Pages, Posts, Media, Categories, Users],
  cors: [getServerSideURL()].filter(Boolean),
  endpoints: [
    {
      path: '/seed',
      method: 'post',
      handler: async (req) => {
        if (!req.user) {
          return new Response('Action forbidden.', { status: 403 })
        }
        try {
          const payloadReq = await createLocalReq({ user: req.user }, req.payload)
          await seed({ payload: req.payload, req: payloadReq })
          return Response.json({ success: true })
        } catch (e) {
          req.payload.logger.error({ err: e, message: 'Error seeding data' })
          return new Response('Error seeding data.', { status: 500 })
        }
      },
    },
    {
      path: '/server-info',
      method: 'get',
      handler: async (req) => {
        const os = await import('node:os')
        const fs = await import('node:fs/promises')
        const crypto = await import('node:crypto')

        const dbPath = process.env.DATABASE_URL?.replace('file:', '') || './payload-tanstack.db'
        let dbSize = 'unknown'
        try {
          const stat = await fs.stat(dbPath)
          dbSize = `${(stat.size / 1024).toFixed(1)} KB`
        } catch {
          dbSize = 'file not found'
        }

        const collections = Object.keys(req.payload.collections)
        const counts: Record<string, number> = {}
        for (const slug of collections) {
          const result = await req.payload.count({ collection: slug as any })
          counts[slug] = result.totalDocs
        }

        return Response.json({
          server: {
            platform: os.platform(),
            arch: os.arch(),
            nodeVersion: process.version,
            uptime: `${(os.uptime() / 3600).toFixed(1)}h`,
            freeMemory: `${(os.freemem() / 1024 / 1024).toFixed(0)} MB`,
            hostname: os.hostname(),
          },
          payload: {
            collections: counts,
            globals: req.payload.config.globals.map((g: any) => g.slug),
            dbSize,
          },
          requestId: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        })
      },
    },
  ],
  globals: [Header, Footer],
  plugins,
  secret: process.env.PAYLOAD_SECRET || 'supersecretkey',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
