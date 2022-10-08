import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "./",
  open:true,
  server: {
    open:true,
    "/api": {
      target: "http://backend-api-02.newbee.ltd/manage-api/v1",
      changeOrigin: true,
      ws: true,
      rewrite:path=>path.replace(/^\/api/,'')
    },
  },
});
