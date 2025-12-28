import type { RouteRecordRaw } from 'vue-router'

// 常量路由（不需要权限）
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
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/error/NotFound.vue'),
    meta: { title: '页面不存在' }
  }
]

// 异步路由（需要权限）
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
    path: '/department',
    component: () => import('@/layouts/DefaultLayout.vue'),
    meta: { title: '部门管理', permission: 'department' },
    children: [
      {
        path: 'list',
        name: 'DepartmentList',
        component: () => import('@/views/department/DepartmentList.vue'),
        meta: { title: '部门列表' }
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
    path: '/menu',
    component: () => import('@/layouts/DefaultLayout.vue'),
    meta: { title: '菜单管理', permission: 'menu' },
    children: [
      {
        path: 'tree',
        name: 'MenuTree',
        component: () => import('@/views/menu/MenuTree.vue'),
        meta: { title: '菜单树' }
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