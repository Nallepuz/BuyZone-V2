// Importamos las bibliotecas necesarias
const express = require('express');     // Framework para construir el servidor
const cors = require('cors');           // Middleware para procesar datos JSON del cuerpo de las solicitudes                                                             
const knex = require('knex');           // Biblioteca para gestionar conexiones con bases de datos usando SQL builders                                                              
const bcrypt = require('bcryptjs');     // Biblioteca para el hashing de contraseñas
const jwt = require('jsonwebtoken');    // Biblioteca para generar y verificar tokens JWT
const carts = {};                       // Objeto para guardar los carritos, clave = user_id


// Inicializamos la aplicación de Express
const app = express();

// Configuramos Express para procesar datos JSON y habilitar CORS
app.use(cors());
app.use(express.json());

// Configuramos la conexión con la base de datos SQLite utilizando Knex
const db = knex({
    client: 'sqlite3',                  // Tipo de base de datos
    connection: {
        filename: './products.db'       // Ruta del archivo de la base de datos
    },
    useNullAsDefault: true
});




// Endpoint para el registro de usuarios (Sign Up)
// Recibe email y password, y guarda el usuario en la base de datos después de hashear la contraseña
app.post('/signup', async (req, res) => {
    console.log('Datos recibidos:', req.body);  // Muestra los datos enviados desde el frontend
    const { email, password } = req.body;       // Extrae email y password del cuerpo de la solicitud


    // Validar que se hayan enviado email y password
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email y contraseña son obligatorios.' });   
    }


    // Validar que el email tenga un formato válido
    try {
        const hashedPassword = await bcrypt.hash(password, 10);                                         // Hashea la contraseña
        await db('users').insert({ email, password: hashedPassword });                                  // Inserta el usuario en la base de datos
        console.log('Usuario registrado exitosamente.');
        res.json({ success: true, message: 'Usuario registrado exitosamente.' });
    } catch (err) {
        console.error('Error al registrar el usuario:', err.message);                   
        if (err.code === 'SQLITE_CONSTRAINT') {                                                         // Verifica si el error es por un email duplicado
            return res.status(400).json({ success: false, message: 'El correo ya está en uso.' });
        }
        res.status(500).json({ success: false, message: 'Error en la base de datos.' });
    }
});


// Endpoint para el inicio de sesión de usuarios (Login)
// Recibe email y password, verifica las credenciales, y genera un token JWT si son válidas
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validar que se hayan enviado email y password
    if (!email || !password) {
        console.error('Missing email or password');
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    try {
        console.log('Looking for user with email:', email);                                 // Log del email buscado

        // Busca al usuario en la base de datos
        const user = await db('users').where({ email }).first();
        if (!user) {
            console.error('User not found:', email);                                        // Log si el usuario no existe
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        console.log('User found:', user);                                                   // Log del usuario encontrado

        // Verifica la contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.error('Invalid password for user:', email); // Log si la contraseña no coincide
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        console.log('Password matched for user:', email); // Log si la contraseña coincide


        // Genera un token JWT para poder autenticar al usuario
        const token = jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });   // Firma el token con una clave secreta
        console.log('Token generated:', token); // Log del token generado

        // Envía el token y la información del usuario para ser almacenados en el frontend
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







// Endpoint para obtener productos
// Devuelve todos los productos de la base de datos
app.get('/products', async (req, res) => {

    // Consultar la base de datos para obtener todos los productos
    try {
        const products = await db('products').select('*');
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});


// Endpoint para agregar un producto
// Recibe imagen, nombre y precio del producto, y lo inserta en la base de datos
app.post('/products', async (req, res) => {
    const { image, name, price } = req.body;

    // Validar los campos del producto, si alguno falta o es inválido, devuelve un error
    if (!image || !name || price == null) {
        return res.status(400).json({ success: false, message: 'Todos los campos (imageUrl, name, price) son obligatorios.' });
    }
    // Validar que el precio sea un número positivo
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

// Endpoint para actualizar el precio de un producto
// Recibe el nombre del producto y el nuevo precio, y actualiza el precio en la base de datos
app.put('/products/:name', async (req, res) => {
    const originalName = req.params.name;   // Nombre original del producto
    const { price } = req.body;             // Solo se espera el precio como dato

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

// Endpoint para eliminar un producto
// Recibe el nombre del producto y lo elimina de la base de datos
app.delete('/products/:name', async (req, res) => {
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







// Endpoint para obtener el carrito de un usuario
// Devuelve los productos y el total del carrito para un usuario
app.get('/cart/:user_id', (req, res) => {
    const { user_id } = req.params;
    console.log('Consultando carrito para user_id:', user_id);

    // Verificar si el usuario tiene un carrito
    const items = carts[user_id] || [];
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    console.log('Contenido del carrito devuelto:', { items, total });
    res.json({ items, total });
});


// Endpoint para obtener el carrito de un usuario
// Devuelve los productos y el total del carrito para un usuario
app.post('/cart', async (req, res) => {
    const { user_id, product_id } = req.body;

    console.log('Datos recibidos en /cart:', req.body); // Log para confirmar los datos

    // Validar que se hayan enviado user_id y product_id
    if (!user_id || !product_id) {
        console.error('Datos inválidos:', req.body);
        return res.status(400).json({ success: false, message: 'Se requieren user_id y product_id.' });
    }

    try {
        // Verificar si el producto existe
        const product = await db('products').where({ id: product_id }).first();
        if (!product) {
            console.error('Producto no encontrado:', product_id);
            return res.status(404).json({ success: false, message: 'Producto no encontrado.' });
        }

        // Inicializar carrito si no existe
        if (!carts[user_id]) {
            carts[user_id] = [];
        }

        console.log('Carrito antes de añadir:', carts[user_id]); // Log para ver el estado inicial del carrito

        // Verificar si el producto ya está en el carrito y aumentar la cantidad en caso afirmativo
        const cartItem = carts[user_id].find((item) => item.id === product_id);
        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            carts[user_id].push({ ...product, quantity: 1 });
        }

        console.log('Carrito después de añadir:', carts[user_id]); // Log para confirmar que se añadió el producto
        res.status(200).json({ success: true, message: 'Producto añadido al carrito.' });
    } catch (error) {
        console.error('Error al añadir al carrito:', error.message);
        res.status(500).json({ success: false, message: 'Error al añadir al carrito.' });
    }
});

// Endpoint para eliminar un producto del carrito
// Recibe user_id y product_id, y elimina el producto del carrito
app.delete('/cart/:user_id/item/:item_id', (req, res) => {
    const { user_id, item_id } = req.params;                        // Extraer user_id y item_id de los parámetros
  
    // Verificar si el usuario tiene un carrito
    if (!carts[user_id]) {
      return res.status(404).json({ success: false, message: 'Carrito no encontrado.' });
    }
  
    // Filtrar el carrito para eliminar el producto
    carts[user_id] = carts[user_id].filter(item => item.id != item_id);
  
    res.status(200).json({ success: true, message: 'Producto eliminado del carrito.' });
  });
  

// Endpoint para eliminar un producto del carrito
// Recibe user_id y product_id, y elimina el producto del carrito
app.delete('/cart/:user_id/:product_id', (req, res) => {
    const { user_id, product_id } = req.params;                     // Extraer user_id y product_id de los parámetros

    if (!carts[user_id]) {
        return res.status(404).json({ success: false, message: 'Carrito no encontrado.' });
    }

    carts[user_id] = carts[user_id].filter((item) => item.id != product_id);
    res.status(200).json({ success: true, message: 'Producto eliminado del carrito.' });
});



// Inicializar el servidor
app.listen(8081, () => {
    console.log('El servidor ha iniciado en el puerto 8081');
});
