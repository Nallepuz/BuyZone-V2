// Importamos las dependencias necesarias
import { createApp } from 'vue'                     // Importamos la función createApp de Vue que utilizaremos para crear la instancia de Vue
import App from './App.vue'                         // Importamos el componente App.vue que utilizaremos como componente principal
import router from './router/router'                // Importamos el archivo de rutas, que utilizaremos para la navegación
import 'bootstrap/dist/css/bootstrap.min.css';      // Importamos el archivo CSS de Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Importamos el archivo JS de Bootstrap
import axios from 'axios';

// Creamos la instancia de Vue
const app = createApp(App);

// Configuramos la URL base de nuestra API
app.config.globalProperties.$axios = axios;

// Configuramos la URL base de nuestra API
app.use(router);


// Montamos la aplicación en el div con el id app
app.mount('#app');

