import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// preview 模式是給 Vercel 之類的暫時預覽用，資源放在根目錄；
// 正式產物仍然要放進後端的 public/assets/vote_activities/
export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  base: mode === 'preview' ? '/' : '/assets/vote_activities/',
  build: {
    manifest: true,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name ?? ''
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(name)) {
            return 'images/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        },
      },
    },
  },
}))
