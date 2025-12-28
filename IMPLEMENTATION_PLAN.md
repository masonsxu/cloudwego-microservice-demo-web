# Vue 3 + TypeScript + Vite 前端项目实现方案

## 项目概述
- **框架**: Vue 3 + TypeScript + Vite
- **UI组件库**: Headless UI + Tailwind CSS + Heroicons
- **状态管理**: Pinia
- **路由**: Vue Router
- **国际化**: vue-i18n (中英文)
- **主题**: 亮色/暗色主题切换
- **后端API**: http://localhost:8080

## 一、项目目录结构

```
/home/masonsxu/workspace/go/cloudwego-microservice-demo-web/
├── public/
│   └── favicon.ico
├── src/
│   ├── api/                         # API请求模块
│   │   ├── index.ts                 # Axios实例配置
│   │   ├── request.ts               # 请求/响应拦截器
│   │   ├── types.ts                 # API类型定义
│   │   ├── auth.ts                  # 认证相关API
│   │   ├── organization.ts          # 组织管理API
│   │   ├── department.ts            # 部门管理API
│   │   ├── user.ts                  # 用户管理API
│   │   ├── membership.ts            # 成员关系API
│   │   ├── role.ts                  # 角色权限API
│   │   └── menu.ts                  # 菜单权限API
│   ├── assets/
│   │   └── styles/
│   │       ├── main.css
│   │       └── tailwind.css
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.vue
│   │   │   ├── Input.vue
│   │   │   ├── Modal.vue
│   │   │   ├── Table.vue
│   │   │   └── Pagination.vue
│   │   ├── layout/
│   │   │   ├── AppHeader.vue
│   │   │   ├── AppSidebar.vue
│   │   │   └── AppLayout.vue
│   │   └── tree/
│   │       └── TreeView.vue
│   ├── composables/
│   │   ├── useAuth.ts
│   │   ├── usePermission.ts
│   │   ├── useTheme.ts
│   │   └── useTable.ts
│   ├── directives/
│   │   ├── permission.ts
│   │   └── loading.ts
│   ├── i18n/
│   │   ├── index.ts
│   │   └── locales/
│   │       ├── zh-CN.ts
│   │       └── en-US.ts
│   ├── layouts/
│   │   ├── DefaultLayout.vue
│   │   └── AuthLayout.vue
│   ├── router/
│   │   ├── index.ts
│   │   ├── guards.ts
│   │   └── routes.ts
│   ├── stores/
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   ├── menu.ts
│   │   ├── theme.ts
│   │   └── organization.ts
│   ├── types/
│   │   ├── api.d.ts
│   │   ├── auth.d.ts
│   │   ├── organization.d.ts
│   │   ├── department.d.ts
│   │   ├── user.d.ts
│   │   ├── role.d.ts
│   │   └── menu.d.ts
│   ├── utils/
│   │   ├── storage.ts
│   │   ├── validate.ts
│   │   ├── format.ts
│   │   └── constants.ts
│   ├── views/
│   │   ├── auth/
│   │   │   ├── Login.vue
│   │   │   └── ForceChangePassword.vue
│   │   ├── dashboard/
│   │   │   └── Dashboard.vue
│   │   ├── organization/
│   │   │   ├── OrganizationList.vue
│   │   │   ├── OrganizationTree.vue
│   │   │   └── OrganizationForm.vue
│   │   ├── department/
│   │   │   ├── DepartmentList.vue
│   │   │   └── DepartmentForm.vue
│   │   ├── user/
│   │   │   ├── UserList.vue
│   │   │   ├── UserForm.vue
│   │   │   └── UserDetail.vue
│   │   ├── role/
│   │   │   ├── RoleList.vue
│   │   │   ├── RoleForm.vue
│   │   │   └── RolePermission.vue
│   │   ├── menu/
│   │   │   ├── MenuTree.vue
│   │   │   └── MenuPermission.vue
│   │   └── profile/
│   │       ├── Profile.vue
│   │       └── ChangePassword.vue
│   ├── App.vue
│   └── main.ts
├── .env
├── .env.development
├── .env.production
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── IMPLEMENTATION_PLAN.md
```

## 二、核心配置文件

### 2.1 package.json 依赖
```json
{
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.2.0",
    "pinia": "^2.1.0",
    "vue-i18n": "^9.8.0",
    "axios": "^1.6.0",
    "@headlessui/vue": "^1.7.0",
    "@heroicons/vue": "^2.1.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "vite": "^5.0.0",
    "typescript": "^5.3.0",
    "vue-tsc": "^1.8.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "@types/node": "^20.10.0"
  }
}
```

### 2.2 vite.config.ts
```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
```

### 2.3 tailwind.config.js
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        }
      }
    }
  },
  plugins: []
}
```

### 2.4 tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## 三、API封装实现

### 3.1 Axios实例配置 (src/api/index.ts)
```typescript
import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default instance
```

### 3.2 请求拦截器 (src/api/request.ts)
```typescript
import instance from './index'
import { useAuthStore } from '@/stores/auth'

instance.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

instance.interceptors.response.use(
  (response) => {
    const { data } = response
    if (data.base_resp?.code === 0) {
      return data
    }
    return Promise.reject(data)
  },
  async (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      try {
        await authStore.refreshAccessToken()
        return instance.request(error.config)
      } catch {
        authStore.clearAuth()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default instance
```

### 3.3 认证API (src/api/auth.ts)
```typescript
import request from './request'
import type { LoginRequest, LoginResponse } from '@/types/auth'

export const loginApi = (data: LoginRequest) => 
  request.post<LoginResponse>('/v1/identity/auth/login', data)

export const logoutApi = (data: { refresh_token?: string }) => 
  request.post('/v1/identity/auth/logout', data)

export const changePasswordApi = (data: { old_password: string; new_password: string }) => 
  request.put('/v1/identity/auth/password', data)

export const resetPasswordApi = (userId: string, data: { new_password?: string; reset_reason: string }) => 
  request.post(`/v1/identity/auth/password/reset/${userId}`, data)

export const refreshTokenApi = (data: { refresh_token: string }) => 
  request.post('/v1/identity/auth/refresh', data)

export const forceChangePasswordApi = (data: { user_id: string; reason: string }) => 
  request.put('/v1/identity/auth/password/force-change', data)
```

## 四、状态管理 (Pinia)

### 4.1 认证Store (src/stores/auth.ts)
```typescript
import { defineStore } from 'pinia'
import { loginApi, logoutApi, refreshTokenApi } from '@/api/auth'
import type { UserProfile } from '@/types/user'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('access_token') || '',
    refreshToken: localStorage.getItem('refresh_token') || '',
    user: JSON.parse(localStorage.getItem('user') || 'null') as UserProfile | null,
    menuTree: JSON.parse(localStorage.getItem('menu_tree') || '[]')
  }),
  actions: {
    async login(credentials: { username: string; password: string }) {
      const res = await loginApi(credentials)
      this.token = res.token_info.access_token
      this.user = res.user_profile
      this.menuTree = res.menu_tree || []
      this.saveToStorage()
      this.startTokenRefresh()
    },
    async logout() {
      await logoutApi({ refresh_token: this.refreshToken })
      this.clearAuth()
    },
    async refreshAccessToken() {
      const res = await refreshTokenApi({ refresh_token: this.refreshToken })
      this.token = res.token_info.access_token
      localStorage.setItem('access_token', this.token)
    },
    saveToStorage() {
      localStorage.setItem('access_token', this.token)
      localStorage.setItem('user', JSON.stringify(this.user))
      localStorage.setItem('menu_tree', JSON.stringify(this.menuTree))
    },
    clearAuth() {
      this.token = ''
      this.refreshToken = ''
      this.user = null
      this.menuTree = []
      localStorage.clear()
    },
    startTokenRefresh() {
      const payload = JSON.parse(atob(this.token.split('.')[1]))
      const expiresIn = (payload.exp * 1000 - Date.now()) - 60000
      if (expiresIn > 0) {
        setTimeout(() => this.refreshAccessToken(), expiresIn)
      }
    }
  }
})
```

### 4.2 主题Store (src/stores/theme.ts)
```typescript
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: localStorage.getItem('theme') === 'dark'
  }),
  actions: {
    toggleTheme() {
      this.isDark = !this.isDark
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', this.isDark)
    },
    initTheme() {
      document.documentElement.classList.toggle('dark', this.isDark)
    }
  }
})
```

## 五、路由配置

### 5.1 路由守卫 (src/router/guards.ts)
```typescript
import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useMenuStore } from '@/stores/menu'

export function setupRouterGuards(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    const menuStore = useMenuStore()
    const whiteList = ['/login', '/force-change-password']
    
    if (whiteList.includes(to.path)) {
      next()
      return
    }
    
    if (!authStore.token) {
      next('/login')
      return
    }
    
    if (menuStore.routes.length === 0) {
      await menuStore.generateRoutes()
      next({ ...to, replace: true })
    } else {
      next()
    }
  })
}
```

### 5.2 路由定义 (src/router/routes.ts)
```typescript
import type { RouteRecordRaw } from 'vue-router'

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: { title: '登录', requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/Dashboard.vue'),
        meta: { title: '仪表盘' }
      }
    ]
  }
]

export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/organization',
    component: () => import('@/layouts/DefaultLayout.vue'),
    meta: { title: '组织管理', permission: 'organization' },
    children: [
      {
        path: 'list',
        name: 'OrganizationList',
        component: () => import('@/views/organization/OrganizationList.vue'),
        meta: { title: '组织列表' }
      },
      {
        path: 'tree',
        name: 'OrganizationTree',
        component: () => import('@/views/organization/OrganizationTree.vue'),
        meta: { title: '组织树' }
      }
    ]
  },
  {
    path: '/user',
    component: () => import('@/layouts/DefaultLayout.vue'),
    meta: { title: '用户管理', permission: 'user' },
    children: [
      {
        path: 'list',
        name: 'UserList',
        component: () => import('@/views/user/UserList.vue'),
        meta: { title: '用户列表' }
      }
    ]
  },
  {
    path: '/role',
    component: () => import('@/layouts/DefaultLayout.vue'),
    meta: { title: '角色管理', permission: 'role' },
    children: [
      {
        path: 'list',
        name: 'RoleList',
        component: () => import('@/views/role/RoleList.vue'),
        meta: { title: '角色列表' }
      }
    ]
  },
  {
    path: '/profile',
    component: () => import('@/layouts/DefaultLayout.vue'),
    meta: { title: '个人中心' },
    children: [
      {
        path: 'info',
        name: 'Profile',
        component: () => import('@/views/profile/Profile.vue'),
        meta: { title: '个人信息' }
      },
      {
        path: 'password',
        name: 'ChangePassword',
        component: () => import('@/views/profile/ChangePassword.vue'),
        meta: { title: '修改密码' }
      }
    ]
  }
]
```

## 六、类型定义

### 6.1 API响应类型 (src/types/api.d.ts)
```typescript
export interface BaseResponse {
  base_resp: {
    code: number
    message: string
  }
}

export interface PageResponse {
  page: {
    page: number
    limit: number
    total: number
    total_pages: number
    has_next: boolean
    has_prev: boolean
  }
}

export interface TokenInfo {
  access_token: string
  expires_in: number
  token_type: string
}
```

### 6.2 认证类型 (src/types/auth.d.ts)
```typescript
export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse extends BaseResponse {
  token_info: TokenInfo
  user_profile: UserProfile
  memberships: UserMembership[]
  menu_tree: MenuNode[]
  role_ids: string[]
}
```

### 6.3 用户类型 (src/types/user.d.ts)
```typescript
export interface UserProfile {
  id: string
  username: string
  real_name: string
  email: string
  phone: string
  status: number
  role_ids: string[]
  organization_id: string
  created_at: number
  updated_at: number
}

export interface CreateUserRequest {
  username: string
  password: string
  real_name: string
  email: string
  phone: string
  organization_id: string
  role_ids: string[]
}
```

### 6.4 组织类型 (src/types/organization.d.ts)
```typescript
export interface Organization {
  id: string
  name: string
  code: string
  parent_id: string
  facility_type: string
  accreditation_status: string
  province_city: string[]
  logo: string
  member_count: number
  children?: Organization[]
}
```

### 6.5 菜单类型 (src/types/menu.d.ts)
```typescript
export interface MenuNode {
  id: string
  name: string
  path: string
  component: string
  icon: string
  permission_level: 'read' | 'write' | 'full' | 'none'
  children?: MenuNode[]
}
```

## 七、开发步骤

### 步骤1: 项目初始化
```bash
# 1. 创建Vite项目
npm create vite@latest . -- --template vue-ts

# 2. 安装依赖
pnpm install vue@latest pinia vue-router vue-i18n axios @headlessui/vue @heroicons/vue
pnpm install -D tailwindcss postcss autoprefixer @types/node

# 3. 初始化Tailwind
npx tailwindcss init -p
```

### 步骤2: 基础配置
1. 配置 vite.config.ts
2. 配置 tsconfig.json
3. 配置 tailwind.config.js
4. 配置 postcss.config.js
5. 创建 .env 文件
6. 配置路由
7. 配置Pinia
8. 配置国际化

### 步骤3: 核心功能开发
1. 实现Axios封装和拦截器
2. 实现认证Store
3. 实现登录页面
4. 实现路由守卫
5. 实现权限指令
6. 实现主题切换
7. 实现语言切换

### 步骤4: 业务模块开发
1. 组织管理模块
2. 部门管理模块
3. 用户管理模块
4. 角色权限模块
5. 菜单权限模块
6. 个人中心模块

### 步骤5: 优化和测试
1. 添加表单验证
2. 添加加载状态
3. 添加错误处理
4. 优化用户体验

## 八、关键文件清单

### 配置文件
- /home/masonsxu/workspace/go/cloudwego-microservice-demo-web/vite.config.ts
- /home/masonsxu/workspace/go/cloudwego-microservice-demo-web/tsconfig.json
- /home/masonsxu/workspace/go/cloudwego-microservice-demo-web/tailwind.config.js
- /home/masonsxu/workspace/go/cloudwego-microservice-demo-web/.env
- /home/masonsxu/workspace/go/cloudwego-microservice-demo-web/package.json

### 核心文件
- /home/masonsxu/workspace/go/cloudwego-microservice-demo-web/src/main.ts
- /home/masonsxu/workspace/go/cloudwego-microservice-demo-web/src/App.vue
- /home/masonsxu/workspace/go/cloudwego-microservice-demo-web/src/api/index.ts
- /home/masonsxu/workspace/go/cloudwego-microservice-demo-web/src/api/request.ts
- /home/masonsxu/workspace/go/cloudwego-microservice-demo-web/src/stores/auth.ts
- /home/masonsxu/workspace/go/cloudwego-microservice-demo-web/src/router/index.ts
- /home/masonsxu/workspace/go/cloudwego-microservice-demo-web/src/router/guards.ts
- /home/masonsxu/workspace/go/cloudwego-microservice-demo-web/src/i18n/index.ts

### API模块
- /home/masonsxu/workspace/go/cloudwego-microservice-demo-web/src/api/auth.ts
- /home/masonsxu/workspace/go/cloudwego-microservice-demo-web/src/api/organization.ts
- /home/masonsxu/workspace/go/cloudwego-microservice-demo-web/src/api/department.ts
- /home/masonsxu/workspace/go/cloudwego-microservice-demo-web/src/api/user.ts
- /home/masonsxu/workspace/go/cloudwego-microservice-demo-web/src/api/role.ts
- /home/masonsxu/workspace/go/cloudwego-microservice-demo-web/src/api/menu.ts

### 类型定义
- /home/masonsxu/workspace/go/cloudwego-microservice-demo-web/src/types/api.d.ts
- /home/masonsxu/workspace/go/cloudwego-microservice-demo-web/src/types/auth.d.ts
- /home/masonsxu/workspace/go/cloudwego-microservice-demo-web/src/types/organization.d.ts
- /home/masonsxu/workspace/go/cloudwego-microservice-demo-web/src/types/user.d.ts
- /home/masonsxu/workspace/go/cloudwego-microservice-demo-web/src/types/role.d.ts
- /home/masonsxu/workspace/go/cloudwego-microservice-demo-web/src/types/menu.d.ts

## 九、环境变量配置

### .env
```bash
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_TITLE=Cloudwego微服务管理平台
```

### .env.development
```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

### .env.production
```bash
VITE_API_BASE_URL=/api
```

## 十、成功标准

1. 所有35个后端API成功对接
2. 登录认证流程完整（登录、登出、修改密码、刷新token）
3. 路由权限控制正常工作
4. 主题切换功能正常
5. 国际化切换功能正常
6. 所有CRUD操作正常
