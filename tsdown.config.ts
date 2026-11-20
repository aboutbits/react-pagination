import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    index: 'src/engine/index.ts',
    'next-router/index': 'src/routers/nextRouter.ts',
    'next-router/zod': 'src/zod/routers/nextRouter.ts',
    'in-memory/index': 'src/routers/inMemory.ts',
    'in-memory/zod': 'src/zod/routers/inMemory.ts',
    'zod/index': 'src/zod/util.ts',
  },
  format: 'esm',
  platform: 'neutral',
  dts: true,
  exports: true,
  outputOptions: {
    // next has no "exports" map, so Node's ESM loader needs the real file name
    paths: { 'next/router': 'next/router.js' },
  },
})
