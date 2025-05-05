const request = require('supertest');
const app = require('../../app');
const db = require('../../config/db');

beforeAll(async () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
  });

// Test GET
describe('GET /products', () => {
    it('debería devolver todos los productos correctamente', async () => {
        const response = await request(app)
            .get('/products')
            .expect(200);

        // Verificaciones genéricas
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0); // Hay productos en la DB
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0]).toHaveProperty('name');
        expect(response.body[0]).toHaveProperty('price');
        expect(response.body[0]).toHaveProperty('image');
    });
});
// Test POST Exitoso
describe('POST /products', () => {
    // Nombre único con timestamp + random
    const testProductName = `TEST_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // Limpieza SÍNCRONA 
    afterAll(async () => {
        await db('products').where({ name: testProductName }).del();
        await db.destroy(); // Cierra la conexión
    }, 10000); // Aumenta timeout si es necesario

    it('crea el producto correctamente', async () => {
        // Crear producto
        const res = await request(app)
            .post('/products')
            .send({
                name: testProductName,
                price: 99.99,
                image: 'https://test.com/img.jpg'
            })
            .expect(201);

        // 4. Verificación en DB
        const productInDb = await db('products')
            .where({ name: testProductName })
            .first();
    });
});
// Test POST Fallido
describe('POST /products', () => {
    const testProductName = `TEST_DUPLICATE_${Date.now()}`;
    const testProductPrice = 50.00;
    const testProductImage = 'https://test.com/duplicate.jpg';
    let dbConnection; // Guardaremos la conexión
    beforeAll(async () => {
        dbConnection = await db.initialize();
        // Crear un producto inicial para la prueba de duplicado
        await db('products').insert({
            name: testProductName,
            price: testProductPrice,
            image: testProductImage
        });
    });
    afterAll(async () => {
        // Limpiar la base de datos
        await db('products').where({ name: testProductName }).del();
        await db.destroy(); // Cerrar conexión
    });
    it('debería fallar al crear un producto sin nombre', async () => {
        const response = await request(app)
            .post('/products')
            .send({
                price: testProductPrice,
                image: testProductImage
            })
            .expect(400); 

        expect(response.body).toEqual({
            success: false,
            message: 'El nombre del producto es obligatorio.'
        });
    }
    );
});
// Test PUT Exitoso
describe('PUT /products', () => {
    let testProductId;
    let dbConnection; // Guardaremos la conexión

    beforeAll(async () => {
        dbConnection = await db.initialize();

        [testProductId] = await db('products').insert({
            name: 'Producto Original',
            price: 50.00,
            image: 'https://test.com/original.jpg'
        });
    });

    afterAll(async () => {
        await db('products').where({ id: testProductId }).del();
        await db.destroy();
    });

    it('debería actualizar un producto existente correctamente', async () => {
        const updatedData = {
            name: 'Producto Actualizado',
            price: 99.99,
            image: 'https://test.com/updated.jpg'
        };

        const response = await request(app)
            .put(`/products/${testProductId}`)
            .send(updatedData)
            .expect(200);

        expect(response.body).toEqual({
            success: true,
            message: 'Producto actualizado exitosamente.'
        });

        const product = await db('products')
            .where({ id: testProductId })
            .first();

        expect(product.name).toBe(updatedData.name);
    });
});
// Test PUT Fallido
describe('PUT /products', () => {
    let testProductId;
    let knexConnection; // Para manejar la conexión manualmente

    beforeAll(async () => {
        // 1. Inicializar conexión explícita
        knexConnection = await db.initialize();

        // 2. Crear producto de prueba
        [testProductId] = await db('products').insert({
            name: 'Producto Test',
            price: 100,
            image: 'https://test.com/img.jpg'
        });
    }, 10000); // Aumentar timeout si es necesario

    afterAll(async () => {
        // 3. Limpieza en orden correcto
        await db('products').where({ id: testProductId }).del();
        await db.destroy(); // Cerrar conexión
    }, 10000);

    it('debería fallar si el producto no existe', async () => {
        const nonExistentId = 999999;

        const response = await request(app)
            .put(`/products/${nonExistentId}`)
            .send({ name: 'Nombre Nuevo' })
            .expect(404);

        expect(response.body).toEqual({
            success: false,
            message: 'Producto no encontrado.'
        });
    });
});
// Test DELETE Exitoso
describe('DELETE /products', () => {
    let testProductName;

    beforeAll(async () => {
        await db.initialize(); 

        testProductName = `TEST_DELETE_${Date.now()}`;
        await db('products').insert({
            name: testProductName,
            price: 99.99,
            image: 'https://test.com/delete.jpg'
        });
    });

    afterAll(async () => {
        await db('products').where({ name: testProductName }).del();
    });

    it('debería eliminar el producto correctamente', async () => {
        const response = await request(app)
            .delete(`/products/${testProductName}`)
            .expect(200);
    });
});
// Test DELETE Fallido
describe('DELETE /products', () => {
    beforeAll(async () => {
        
        await db.initialize();
    });

    it('debería fallar al intentar eliminar producto inexistente', async () => {
        const nonExistentName = `PRODUCTO_INEXISTENTE_${Date.now()}`;

        const response = await request(app)
            .delete(`/products/${nonExistentName}`)
            .expect(404); 

        
        expect(response.body).toEqual({
            success: false,
            message: 'Producto no encontrado.' 
        });
    });
});

afterAll(async () => {
    await db.destroy();
});
