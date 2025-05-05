const cartService = require('../../services/cart.service');
const request = require('supertest');
const app = require('../../app'); 
const db = require('../../config/db');

beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
});

// Test Exitoso para obtener el carrito de un usuario
describe('GET /cart', () => {

    beforeAll(async () => {
        try {
            await db.raw('SELECT 1');
        } catch (error) {
            throw new Error('Base de datos no disponible. Test fallido forzado.');
        }
    });

    it('debería devolver el carrito de un usuario correctamente', async () => {
        const userId = 1; 

        const response = await request(app)
            .get(`/cart/${userId}`) 
            .send();

        expect(response.status).toBe(200); 
        expect(response.body.items).toBeDefined();
        expect(Array.isArray(response.body.items)).toBe(true);
        expect(response.body.total).toBeDefined();

    });
});
// Test Exitoso para agregar un producto al carrito Exitoso
describe('POST /cart', () => {
    it('debería agregar un producto al carrito correctamente', async () => {
        // Datos de prueba para el carrito en memoria
        const payload = {
            user_id: 1,
            product_id: 1,
            quantity: 1
        };

        const response = await request(app)
            .post('/cart')
            .send(payload);

        // Verificacion para carrito
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            message: 'Producto agregado al carrito',
            cart: expect.any(Object) // Asegura que se devuelve un carrito
        });
    });
});
// Test Fallido para agregar un producto al carrito Fallido
describe('POST /cart', () => {
    beforeAll(async () => {
        try {
            await db.raw('SELECT 1');
        } catch (error) {
            throw new Error('Base de datos no disponible. Test fallido forzado.');
        }
    });
    it('debería devolver un error si faltan los parámetros user_id o product_id', async () => {
        const response = await request(app)
            .post('/cart')
            .send({}); 

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Se requieren user_id y product_id'); 
    });
});
// Test para eliminar un producto del carrito por item_id Exitoso
describe('DELETE /cart/:user_id/item/:item_id', () => {
    const userId = 1;
    const itemId = 9999; // ID único para este test

    beforeAll(async () => {
        try {
            await db.raw('SELECT 1');
        } catch (error) {
            throw new Error('Base de datos no disponible. Test fallido forzado.');
        }
    });

    beforeEach(() => {
        if (!cartService.carts) cartService.carts = {};

        cartService.carts[userId] = [{
            item_id: itemId,
            product_id: 2,
            name: "Producto Test",
            price: 20,
            quantity: 1
        }];
    });

    afterEach(() => {
        
        cartService.carts[userId] = [];
    });

    it('debería eliminar un producto del carrito por item_id correctamente', async () => {
        const response = await request(app)
            .delete(`/cart/${userId}/item/${itemId}`)
            .send();

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

       
        const item = cartService.carts[userId].find(i => i.item_id === itemId);
        expect(item).toBeUndefined();
    });
});
// Test para eliminar un producto del carrito por item_id Fallido
describe('DELETE /cart/:user_id/item/:item_id (item inexistente)', () => {
    const userId = 1;
    const itemIdInexistente = 9999;

    beforeAll(async () => {
        try {
            await db.raw('SELECT 1');
        } catch (error) {
            throw new Error('Base de datos no disponible. Test fallido forzado.');
        }
    });

    beforeEach(() => {
        if (!cartService.carts) cartService.carts = {};
        cartService.carts[userId] = [
            {
                item_id: 1111,
                product_id: 3,
                name: "Otro producto",
                price: 15,
                quantity: 1
            }
        ];
    });

    afterEach(() => {
        cartService.carts[userId] = [];
    });

    it('debería devolver un error si el item_id no existe en el carrito', async () => {
        const response = await request(app)
            .delete(`/cart/${userId}/item/${itemIdInexistente}`)
            .send();

        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Producto no encontrado en el carrito');
    });
});
// Test para eliminar un producto del carrito por product_id Exitoso
describe('DELETE /cart/:user_id/product/:product_id', () => {
    const userId = 1;
    const productId = 2;

    beforeAll(async () => {
        try {
            await db.raw('SELECT 1');
        } catch (error) {
            throw new Error('Base de datos no disponible. Test fallido forzado.');
        }
    });

    beforeEach(() => {
        // Insertamos un producto en el carrito en memoria
        if (!cartService.carts) cartService.carts = {};

        cartService.carts[userId] = [{
            item_id: 1234,
            product_id: productId,
            name: "Producto Forzado",
            price: 20,
            quantity: 1
        }];
    });

    afterEach(() => {
        // Limpiamos el carrito tras el test
        cartService.carts[userId] = [];
    });

    it('debería eliminar un producto del carrito por product_id correctamente', async () => {
        const response = await request(app)
            .delete(`/cart/${userId}/product/${productId}`)
            .send();

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

        // Verificamos que el producto ya no está
        const producto = cartService.carts[userId].find(i => i.product_id === productId);
        expect(producto).toBeUndefined();
    });
});
// Test para eliminar un producto del carrito por product_id Fallido
describe('DELETE /cart (PRODUCT_ID)', () => {
    beforeAll(async () => {
        try {
            await db.raw('SELECT 1');
        } catch (error) {
            throw new Error('Base de datos no disponible. Test fallido forzado.');
        }
    });
    
    it('debería devolver error si el product_id no existe en el carrito', async () => {
        
        const testCart = {
            1: [{ 
                item_id: 1,
                product_id: 99, 
                name: "Producto Test",
                price: 20,
                quantity: 1
            }]
        };

        cartService.carts = testCart;

        const response = await request(app)
            .delete('/cart/1/product/999')
            .send();

       
        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toMatch(/no encontrado/); // Mensaje flexible
    });
});

afterAll(async () => {
    await db.destroy();
});








