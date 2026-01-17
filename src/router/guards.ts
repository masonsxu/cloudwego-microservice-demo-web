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
      // 如果未登录，重置菜单 store
      menuStore.reset()
      next('/login')
      return
    }

    // 如果菜单路由未加载，则加载菜单
    // 检查 routesLoaded 标志和 loading 状态，避免重复加载和无限循环
    if (!menuStore.routesLoaded && !menuStore.loading) {
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
    } else if (menuStore.loading) {
      // 如果正在加载中，等待加载完成
      // 这里可以添加一个超时机制，但先简单处理：直接放行，让加载完成后的导航处理
      next()
    } else {
      next()
    }
  })

  router.afterEach((to) => {
    // 设置页面标题
    document.title = `${to.meta?.title || 'Cloudwego微服务管理平台'}`
  })
}
