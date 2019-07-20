import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入login组件
import Login from '@/views/login'
// 导入首页组件
import Home from '@/views/home'
import Welcome from '@/views/welcome'
import Error from '@/views/404'
import Article from '@/views/article'
import Image from '@/views/image'
import Publish from '@/views/publish'
import Comment from '@/views/comment'
Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    { name: 'login', path: '/login', component: Login },
    { path: '/',
      component: Home,
      children: [
        { name: 'welcome', path: '/', component: Welcome },
        { name: 'article', path: '/article', component: Article },
        { name: 'image', path: '/image', component: Image },
        { name: 'publish', path: '/publish', component: Publish },
        { name: 'comment', path: '/comment', component: Comment }
      ] },
    { name: '404', path: '*', component: Error }]
})

// 设置全局前置守卫
router.beforeEach((to, from, next) => {
  // to  router即将要进入的目标路径
  // to.path目标路径
  // 当路径地址为login时.直接放行
  if (to.path === '/login') return next()
  // 存储了用户信息的,放行
  const user = window.sessionStorage.getItem('mytoken')
  // 其余拦截回login
  if (user) return next()
  next('/login')
})
export default router
