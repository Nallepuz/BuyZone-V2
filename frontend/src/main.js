import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import axios from 'axios';

const app = createApp(App);

app.config.globalProperties.$axios = axios;

app.mount('#app');

