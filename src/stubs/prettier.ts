// Stub for `prettier`. Payload's main barrel re-exports `configToJSONSchema`,
// which pulls in `json-schema-to-typescript` → `prettier` (a CJS module). That
// chain is type-generation only (`payload generate:types`) and never executes
// in the browser, but rolldown still drags it into the client bundle through the
// barrel's re-export side effects, where prettier's `index.cjs` fails to parse
// as ESM. Aliasing `prettier` to this no-op keeps the client build green without
// affecting the SSR/RSC runtime (there `json-schema-to-typescript` stays external
// and resolves the real prettier from node_modules) or the `prettier` CLI.
export const format = (source: string): string => source

export default { format }
