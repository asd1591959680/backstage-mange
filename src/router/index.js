import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import('content/Login.vue')
const Home = () => import('views/home/Home.vue')
const Welcome = () => import('views/home/Welcome.vue')
const Users = () => import('views/users/Users.vue')
const Rights = () => import('views/power/Rights.vue')
const Roles = () => import('views/power/Roles.vue')
const Cate = () => import('views/goods/Cate.vue')
Vue.use(VueRouter)

const routes = [
  {
    path: '',
    redirect: '/login',
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome,
      },
      {
        path: '/users',
        component: Users,
      },
      {
        path: '/rights',
        component: Rights,
      },
      {
        path: '/roles',
        component: Roles,
      },
      {
        path: '/categories',
        component: Cate,
      },
    ],
  },
]

const router = new VueRouter({
  routes,
})
//路由导航守卫控制访问权限
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})
export default router
