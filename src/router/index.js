import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'

const router = createRouter({
  // 正式環境由後端在 /vote/{id} 提供頁面外殼；
  // vite dev 是自己在 base 底下送 HTML，兩者路徑不同，否則 router 永遠匹配不到
  history: createWebHistory(import.meta.env.DEV ? import.meta.env.BASE_URL : '/vote/'),
  routes: [
    {
      path: '/:id?',
      name: 'home',
      component: HomeView,
    },
  ],
})

export default router
