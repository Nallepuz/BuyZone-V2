const express = require('express');                                                                  // Importar express
const cors = require('cors');                                                                        // Importar cors

const app = express();                                                                               
app.use(cors());                                                                                     
app.use(express.json());                                                                             


const products = [
    { 
        'name': 'Asus Zenbook',
        'description': 'Laptop Asus Zenbook 14',
        "price": 1119.00,
    },
    { 
        'name': 'HP Victus',
        'description': 'Laptop HP Victus 16',
        'price': 1149.00,
    },
    { 
        'name': 'Lenovo Legion',
        'description': 'Laptop Lenovo Legion 5',
        'price': 1099.00,
    }
];                                                                                                  // Objeto para almacenar los productos   



app.get('/products', (req, res) => {                                                                // Ruta para obtener todos los productos
    res.json(products);                                                                             
});                     

app.get('/products/:name', (req, res) => {                                                                // Ruta para obtener todos los productos
    res.json(products);                                                                             // Enviar el objeto products como respuesta
});    



app.listen(8080, () => {                                                                            // Iniciar el servidor en el puerto 8080
    console.log('El servidor ha iniciado en el puerto 8080');
});