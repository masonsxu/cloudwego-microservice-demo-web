import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import pinia from './stores'
import { useThemeStore } from './stores/theme'
import './assets/styles/main.css'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(i18n)

// 初始化主题
const themeStore = useThemeStore()
themeStore.initTheme()

app.mount('#app')