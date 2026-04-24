# Payload + TanStack Start Demo

A demo of [Payload CMS](https://payloadcms.com) running on [TanStack Start](https://tanstack.com/start) instead of Next.js, based on the website template.

> **This is an experimental demo and is not intended for production use.**
> It exists to showcase the framework adapter pattern being developed in
> [payloadcms/payload#16139](https://github.com/payloadcms/payload/pull/16139).

## What is this?

This project demonstrates that Payload's admin panel can run on frameworks other than Next.js. It uses TanStack Start + TanStack Router with Vite as the build tool, replacing Next.js's RSC rendering with SSR + route loaders.

For details on the architecture, adapter contracts, and current test pass rates, see the PR:
**https://github.com/payloadcms/payload/pull/16139**

## Getting started

```bash
pnpm install
cp .env.example .env  # configure DATABASE_URI, PAYLOAD_SECRET, etc.
pnpm dev
```

The admin panel is available at `http://localhost:3000/admin` and the frontend at `http://localhost:3000`.
