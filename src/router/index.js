import { createRouter, createWebHistory } from 'vue-router'

import ActivityPage from '../views/ActivityPage.vue'

const router = createRouter({
  // 正式環境由後端在 /vote/{id} 提供頁面外殼；
  // dev 與 preview 是由 vite 自己送 HTML，路徑跟著 base 走，否則 router 永遠匹配不到
  history: createWebHistory(
    import.meta.env.DEV || import.meta.env.VITE_PREVIEW === 'true'
      ? import.meta.env.BASE_URL
      : '/vote/',
  ),
  routes: [
    {
      path: '/:id?',
      name: 'home',
      component: ActivityPage,
    },
  ],
})

export default router
