import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import basicSSL from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [solidPlugin(), basicSSL()],
  base: '/osp-webapp/',
  server: {
    port: 3000,
    https: true,
  },
  build: {
    target: 'esnext',
  },
})
