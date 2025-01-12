// server.js
// Importamos las dependencias necesarias
const express = require('express');     // Framework para construir el servidor
const cors = require('cors');           // Middleware para procesar datos JSON del cuerpo de las solicitudes                                                             
const knex = require('knex');           // Biblioteca para gestionar conexiones con bases de datos usando SQL builders                                                              
const bcrypt = require('bcryptjs');     // Biblioteca para el hashing de contraseñas
const jwt = require('jsonwebtoken');    // Biblioteca para generar y verificar tokens JWT



// Inicializamos la aplicación de Express
const app = express();
app.use(cors());
app.use(express.json());

// Configuramos la conexión con la base de datos SQLite utilizando Knex
const db = knex({
    client: 'sqlite3',
    connection: {
        filename: './products.db'
    },
    useNullAsDefault: true
});

// Endpoint para el registro de usuarios (Sign Up)
// Recibe email y password, y guarda el usuario en la base de datos después de hashear la contraseña
app.post('/signup', async (req, res) => {
    const { email, password } = req.body; // Extraemos email y password del cuerpo de la solicitud

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Hasheamos la contraseña utilizando bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashedPassword);

    // Insertamos el nuevo usuario en la base de datos
    try { 
        await db('users').insert({ email, password: hashedPassword });
        console.log('User inserted into database');
        res.json({ success: true, message: 'User registered successfully!' }); // Respuesta exitosa
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT') { // Error de clave única (email duplicado)
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }
        return res.status(500).json({ success: false, message: 'Database error' }); // Error general de base de datos
    }
});

// Endpoint para el inicio de sesión de usuarios (Login)
// Recibe email y password, verifica las credenciales, y genera un token JWT si son válidas
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        console.error('Missing email or password'); // Log del error
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    try {
        console.log('Looking for user with email:', email); // Log del email buscado

        // Busca al usuario en la base de datos
        const user = await db('users').where({ email }).first();
        if (!user) {
            console.error('User not found:', email); // Log si el usuario no existe
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        console.log('User found:', user); // Log del usuario encontrado

        // Verifica la contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.error('Invalid password for user:', email); // Log si la contraseña no coincide
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        console.log('Password matched for user:', email); // Log si la contraseña coincide

        // Genera un token JWT
        const token = jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });
        console.log('Token generated:', token); // Log del token generado

        // Envía el token y la información del usuario
        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email
            }
        });
    } catch (err) {
        console.error('Database error during login:', err); // Log del error
        res.status(500).json({ success: false, message: 'Database error' });
    }
});


app.get('/products', async (req, res) => {
    try {
        const products = await db('products').select('*');
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

app.post('/products', async (req, res) => {
    const { image, name, price } = req.body;

    // Validar los campos del producto
    if (!image || !name || price == null) {
        return res.status(400).json({ success: false, message: 'Todos los campos (imageUrl, name, price) son obligatorios.' });
    }

    if (typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ success: false, message: 'El precio debe ser un número positivo.' });
    }

    try {
        // Verificar si el producto ya existe
        const existingProduct = await db('products').where({ name }).first();
        if (existingProduct) {
            return res.status(400).json({ success: false, message: 'El producto ya existe.' });
        }

        // Insertar el producto en la base de datos
        await db('products').insert({ image, name, price });
        res.status(201).json({ success: true, message: 'Producto agregado exitosamente.' });
    } catch (error) {
        console.error('Error al agregar el producto:', error.message);
        res.status(500).json({ success: false, message: 'Error al agregar el producto.' });
    }
});

app.put('/products/:name', async (req, res) => {
    const originalName = req.params.name; // Nombre original del producto
    const { price } = req.body; // Solo se espera el precio como dato

    if (price == null || typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ success: false, message: 'El precio debe ser un número positivo.' });
    }

    try {
        // Verificar si el producto existe
        const product = await db('products').where({ name: originalName }).first();
        if (!product) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado.' });
        }

        // Actualizar solo el precio
        await db('products').where({ name: originalName }).update({ price });
        res.status(200).json({ success: true, message: 'Precio actualizado exitosamente.' });
    } catch (error) {
        console.error('Error al actualizar el precio:', error.message);
        res.status(500).json({ success: false, message: 'Error al actualizar el precio.' });
    }
});




app.delete('/products/:name', async (req, res) => {         // Endpoint para eliminar un producto por su nombre
    const { name } = req.params;

    try {
        // Verificar si el producto existe antes de intentar eliminarlo
        const product = await db('products').where({ name }).first();

        if (!product) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado.' });
        }

        // Eliminar el producto
        await db('products').where({ name }).del();
        res.status(200).json({ success: true, message: 'Producto eliminado exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar el producto:', error.message);
        res.status(500).json({ success: false, message: 'Error al eliminar el producto.' });
    }
});


app.listen(8081, () => {
    console.log('El servidor ha iniciado en el puerto 8081');
});