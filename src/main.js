import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'
import { applyDevEndpoint } from './config/devEndpoint.js'

// 正式環境的 window.endpoint 由後端 Blade 外殼注入，本機沒有外殼，改用環境變數補上
applyDevEndpoint()

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')
