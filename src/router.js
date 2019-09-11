import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const router = new Router({
    // mode: 'history',
    linkActiveClass: 'active',
    routes: [
        { path: '/home',     name: 'home',     component: () => import('./views/Home.vue')    }, // 首页
        { path: '/audit',    name: 'audit',    component: () => import('./views/Audit.vue')   }, // 信息审计
        { path: '/login',    name: 'login',    component: () => import('./views/Login.vue')   }, // 用户登录
        { path: '*',         redirect: { name: 'home' }                                      }
    ]
})

export default router