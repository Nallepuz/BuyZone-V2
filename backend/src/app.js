const express = require('express');                                                                  // Importar express
const cors = require('cors');                                                                        // Importar cors
const knex = require('knex');                                                                        // Importar knex

const app = express();                                                                               
app.use(cors());                                                                                     
app.use(express.json());                                                                             


const db = knex({    
    client: 'sqlite3',                                                                                 
    connection: {                                                                                     
        filename : './products.db'
    },
    useNullAsDefault: true
});                                                                 



app.get('/products', async (req, res) => {    
    try {  
        const products = await db('products').select('*');
        res.json(products); 
    }  catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }                                                                            
});                     

app.post('/products', (req, res) => {           

});

app.put('/products/:name', (req, res) => {      
    
});

app.delete('/products/:name', (req, res) => {     

});

app.listen(8081, () => {                                                                            
    console.log('El servidor ha iniciado en el puerto 8081');
});