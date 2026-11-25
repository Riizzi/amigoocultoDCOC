import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Modo "mock": dados simulados no navegador. O build de preview gera um único HTML.
export default defineConfig(({ mode }) => ({
  plugins: [react(), ...(mode === 'mock' ? [viteSingleFile()] : [])],
  build: mode === 'mock' ? { outDir: 'dist-preview' } : {},
}))
