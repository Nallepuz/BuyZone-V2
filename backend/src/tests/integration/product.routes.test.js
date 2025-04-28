const request = require('supertest');
const app = require('../../app');
const db = require('../../config/db');


// Test GET /products
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


// Test POST /products Exitoso
describe('POST /products', () => {
    // 1. Nombre único con timestamp + random
    const testProductName = `TEST_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // 2. Limpieza SÍNCRONA 
    afterAll(async () => {
        await db('products').where({ name: testProductName }).del();
        await db.destroy(); // Cierra la conexión
    }, 10000); // Aumenta timeout si es necesario

    it('crea el producto correctamente', async () => {
        // 3. Crear producto
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
// Test POST /products Fallido
describe('POST /products', () => {
    it('debería fallar si faltan campos obligatorios', async () => {
        // Enviar un producto SIN "price" (campo obligatorio)
        const response = await request(app)
            .post('/products')
            .send({
                name: 'Producto Test',
                image: 'https://test.com/img.jpg'
                // Falta "price"
            })
            .expect(400); // Status de error

        // Verificar el mensaje de error
        expect(response.body).toEqual({
            success: false,
            message: 'Todos los campos (imageUrl, name, price) son obligatorios y válidos.'
        });
    });
});

// Test PUT /products Exitoso
describe('PUT /products', () => {
    let testProductId;
    let dbConnection; // Guardaremos la conexión

    beforeAll(async () => {
        // 1. Crear conexión persistente
        dbConnection = await db.initialize();

        // 2. Insertar producto de prueba
        [testProductId] = await db('products').insert({
            name: 'Producto Original',
            price: 50.00,
            image: 'https://test.com/original.jpg'
        });
    });

    afterAll(async () => {
        // 3. Limpieza y cierre en orden
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

        // Verificación en DB
        const product = await db('products')
            .where({ id: testProductId })
            .first();

        expect(product.name).toBe(updatedData.name);
    });
});
// Test PUT /products Fallido
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



// Test DELETE /products Exitoso
describe('DELETE /products', () => {
    let testProductName;

    beforeAll(async () => {
        // 1. Asegurar conexión activa
        await db.initialize(); // ← Esta línea es clave

        // 2. Crear producto de prueba
        testProductName = `TEST_DELETE_${Date.now()}`;
        await db('products').insert({
            name: testProductName,
            price: 99.99,
            image: 'https://test.com/delete.jpg'
        });
    });

    afterAll(async () => {
        // 3. Limpieza (no cerrar conexión aquí)
        await db('products').where({ name: testProductName }).del();
    });

    it('debería eliminar el producto correctamente', async () => {
        const response = await request(app)
            .delete(`/products/${testProductName}`)
            .expect(200);
    });
});
// Test DELETE /products Fallido
describe('DELETE /products', () => {
    beforeAll(async () => {
        // Asegurar conexión (igual que en el exitoso)
        await db.initialize();
    });

    it('debería fallar al intentar eliminar producto inexistente', async () => {
        const nonExistentName = `PRODUCTO_INEXISTENTE_${Date.now()}`;

        const response = await request(app)
            .delete(`/products/${nonExistentName}`)
            .expect(404); // ← Esperamos código 404 (No encontrado)

        // Verificar el mensaje de error
        expect(response.body).toEqual({
            success: false,
            message: 'Producto no encontrado.' // ← Asegúrate que coincide con tu servicio
        });
    });
});

afterAll(async () => {
    await db.destroy();
});
