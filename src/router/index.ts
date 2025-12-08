import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 定义路由配置 - 根据你的实际文件名称
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/webLogin'  // 根路径重定向到登录页
  },
  {
    path: '/webLogin',
    name: 'WebLogin',
    component: () => import('@/views/webLogin.vue')  // 注意文件名大小写
  },
  {
    path: '/homePage',
    name: 'HomePage',
    component: () => import('@/views/homePage.vue'),
    meta: { requiresAuth: true }  // 需要登录认证
  },
  // 捕获所有未定义的路由，重定向到登录页
  {
    path: '/:pathMatch(.*)*',
    redirect: '/webLogin'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,  // 这里传入定义好的路由配置
})

// 添加路由守卫
router.beforeEach((to, from, next) => {
  console.log('路由导航:', to.path)

  // 检查登录状态
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'

  // 如果目标路由需要认证且用户未登录，跳转到登录页
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/webLogin')
  } else {
    next()  // 正常放行
  }
})

export default router
