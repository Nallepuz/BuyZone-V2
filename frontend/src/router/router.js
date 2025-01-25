// Importamos las dependencias
import { createRouter, createWebHistory } from 'vue-router'      //Librería para poder manejar la navegación entre diferentes páginas de la aplicación

// Importamos los componentes de las deistintas páginas que vamos a utilizar
import UserProducts from '../UserProducts.vue'
import UrList from '../UrList.vue'
import AddProduct from '../AddProduct.vue'
import UserLogin from '../UserLogin.vue'
import SignUp from '../SignUp.vue'
import UserConfig from '../UserConfig.vue'


const routes = [

  //Definimos la página principal de la aplicación
  {
    path: '/',
    redirect: '/products', // Redirige automáticamente a /products
  },

  //Definimos las rutas de las distintas páginas de la aplicación
  {
    path: '/products',
    name: 'UserProducts',
    component: UserProducts
  },
  {
    path: '/urlist',
    name: 'UrList',
    component: UrList
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
  },
  {
    path: '/userconfig',
    name: 'UserConfig',
    component: UserConfig
  },
]

// Creamos el router que nos permitirá navegar entre las distintas páginas de la aplicación
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router