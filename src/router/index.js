import { createRouter, createWebHistory } from 'vue-router'

import ActivityPage from '../views/ActivityPage.vue'
import { createActivityRoutes } from './routes.js'

const router = createRouter({
  // 後端會以 /vote/{id} 或 /liff/vote/{id} 提供同一份頁面外殼，
  // 活動 ID 由 window.endpoint 注入，因此 router 只負責掛載頁面。
  history: createWebHistory('/'),
  routes: createActivityRoutes(ActivityPage),
})

export default router
