import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import crossOriginIsolation from 'vite-plugin-cross-origin-isolation'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    crossOriginIsolation(),
  ],
  // define current date and time as a global variable
  define: {
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
})
