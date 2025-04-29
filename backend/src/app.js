// Importamos las bibliotecas necesarias
const express = require('express');     // Framework para construir el servidor
const cors = require('cors');           // Middleware para procesar datos JSON del cuerpo de las solicitudes
const knex = require('knex');           // Biblioteca para gestionar conexiones con bases de datos usando SQL builders
const bcrypt = require('bcryptjs');     // Biblioteca para el hashing de contraseñas
const jwt = require('jsonwebtoken');    // Biblioteca para generar y verificar tokens JWT
const carts = {};                       // Objeto para guardar los carritos, clave = user_id
const db = require('./config/db');

// Inicializamos la aplicación de Express
const app = express();

// Configuramos Express para procesar datos JSON y habilitar CORS
app.use(cors({
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'], // <-- Añade Authorization
  exposedHeaders: ['Authorization'] // <-- Permite que el frontend lea el header
}));

app.use(express.json());

app.use((req, res, next) => {
  next();
});


// Rutas
const userRoutes = require('./routes/user.routes');
app.use('/', userRoutes);

const productRoutes = require('./routes/product.routes');
app.use('/products', productRoutes);

const cartRoutes = require('./routes/cart.routes');
app.use('/cart', cartRoutes);

// Exportar la app para usarla en los tests
module.exports = app;

// Inicializar el servidor solo si no estamos en un entorno de test
if (process.env.NODE_ENV !== 'test') {
  app.listen(8081, () => {
    console.log('El servidor ha iniciado en el puerto 8081');
  });
}
