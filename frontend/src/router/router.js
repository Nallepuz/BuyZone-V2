import { createRouter, createWebHistory } from 'vue-router'
import App from '../App.vue'
import UserProducts from '../UserProducts.vue'
import AddProduct from '../AddProduct.vue'
import UserLogin from '../UserLogin.vue'
import SignUp from '../SignUp.vue'

const routes = [
  {
    path: '/',
    name: 'App',
    component: App
  },
  {
    path: '/products',
    name: 'UserProducts',
    component: UserProducts
  },
  {
    path: '/add',
    name: 'AddProduct',
    component: AddProduct
  },
  {
    path: '/login',
    name: 'UserLogin',
    component: UserLogin
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router