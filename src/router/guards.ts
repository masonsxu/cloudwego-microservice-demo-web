import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useMenuStore } from '@/stores/menu'

export function setupRouterGuards(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    const menuStore = useMenuStore()

    // 白名单路由
    const whiteList = ['/login']

    if (whiteList.includes(to.path)) {
      // 如果已登录，访问登录页则重定向到首页
      if (authStore.isAuthenticated && to.path === '/login') {
        next('/')
        return
      }
      next()
      return
    }

    // 检查是否已登录
    if (!authStore.isAuthenticated) {
      next('/login')
      return
    }

    // 如果菜单路由未加载，则加载菜单
    if (menuStore.routes.length === 0) {
      try {
        await menuStore.generateRoutes()
        // 动态添加路由
        menuStore.routes.forEach(route => {
          router.addRoute(route)
        })
        // 重新导航
        next({ ...to, replace: true })
      } catch (error) {
        console.error('Failed to load menu routes:', error)
        next('/login')
      }
    } else {
      next()
    }
  })

  router.afterEach((to) => {
    // 设置页面标题
    document.title = `${to.meta?.title || 'Cloudwego微服务管理平台'}`
  })
}