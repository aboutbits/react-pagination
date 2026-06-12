import react from '@aboutbits/eslint-config/configs/react'
import ts from '@aboutbits/eslint-config/configs/ts'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  ts,
  react,
  {
    ignores: ['node_modules', 'dist', 'vite.config.mts'],
  },
])
