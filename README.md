# Cloudwego微服务管理平台 - 前端

基于 Vue 3 + TypeScript + Vite 构建的现代化微服务管理平台前端系统。

## 技术栈

- **框架**: Vue 3.4.0
- **语言**: TypeScript 5.3.0
- **构建工具**: Vite 5.0.0
- **状态管理**: Pinia 2.1.0
- **路由**: Vue Router 4.2.0
- **国际化**: vue-i18n 9.8.0
- **HTTP客户端**: Axios 1.6.0
- **样式**: Tailwind CSS 3.4.0
- **UI组件**: Headless UI 1.7.0 + Heroicons 2.1.0

## 功能特性

- ✅ 用户认证与授权（登录、登出、Token管理）
- ✅ 路由级权限控制
- ✅ 亮色/暗色主题切换
- ✅ 中英文国际化支持
- ✅ 响应式设计
- ✅ 组织管理
- ✅ 部门管理
- ✅ 用户管理
- ✅ 角色权限管理
- ✅ 菜单权限管理

## 开始使用

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖

```bash
npm install
```

### 开发

```bash
npm run dev
```

访问 http://localhost:3000

### 构建

```bash
npm run build
```

### 预览

```bash
npm run preview
```

## 环境变量

在项目根目录创建 `.env` 文件：

```bash
VITE_API_BASE_URL=http://localhost:8088/api
VITE_APP_TITLE=Cloudwego微服务管理平台
```

## 项目结构

```
src/
├── api/              # API接口模块
├── assets/styles/    # 样式文件
├── components/       # 组件目录
├── composables/      # 组合式函数
├── directives/       # 自定义指令
├── i18n/            # 国际化配置
├── layouts/         # 布局组件
├── router/          # 路由配置
├── stores/          # Pinia状态管理
├── types/           # TypeScript类型定义
├── utils/           # 工具函数
└── views/           # 页面组件
```

## 默认账号

- 用户名: `superadmin`
- 密码: `password123`

## 后端API

后端服务需要运行在 `http://localhost:8088`

## License

MIT