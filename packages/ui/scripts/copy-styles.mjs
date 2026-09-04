import { cpSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const src = path.resolve(__dirname, '../src/styles')
const dest = path.resolve(__dirname, '../dist/styles')

mkdirSync(dest, { recursive: true })
cpSync(src, dest, { recursive: true })
console.log('[copy-styles] src/styles -> dist/styles')
