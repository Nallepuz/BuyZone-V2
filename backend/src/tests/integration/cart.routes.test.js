const cartService = require('../../services/cart.service');
const request = require('supertest');
const app = require('../../app');  // Asegúrate de que esté apuntando a tu app.js correctamente
const db = require('../../config/db');

// Test Exitoso para obtener el carrito de un usuario
describe('GET /cart', () => {
    it('debería devolver el carrito de un usuario correctamente', async () => {
        const userId = 1;  // Suponemos que este ID existe en la base de datos.

        const response = await request(app)
            .get(`/cart/${userId}`)  // La ruta debe ser la correcta según tu backend
            .send();

        expect(response.status).toBe(200);  // Verifica que la respuesta sea 200 OK
        expect(response.body.items).toBeDefined();
        expect(Array.isArray(response.body.items)).toBe(true);
        expect(response.body.total).toBeDefined();

    });
});

// Test Exitoso para agregar un producto al carrito
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

        // Verificaciones para carrito en memoria
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            message: 'Producto agregado al carrito',
            cart: expect.any(Object) // Asegura que se devuelve un carrito
        });
    });
});
// Test Fallido para agregar un producto al carrito
describe('POST /cart', () => {
    it('debería devolver un error si faltan los parámetros user_id o product_id', async () => {
        const response = await request(app)
            .post('/cart')
            .send({});  // No enviamos los parámetros

        expect(response.status).toBe(400);  // El status debe ser 400 Bad Request
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Se requieren user_id y product_id');  // El mensaje debe ser adecuado
    });
});

// Test para eliminar un producto del carrito por item_id (ÉXITO y FALLO)
describe('DELETE /cart (ITEM_ID)', () => {
    it('debería eliminar un producto del carrito por item_id correctamente', async () => {
        // 1. Mock del servicio
        const mockCart = {
            1: [{
                item_id: 123,  // Asegurar que existe
                product_id: 2,
                name: "Producto Test",
                price: 20,
                quantity: 1
            }]
        };
        require('../../services/cart.service').carts = mockCart;

        // 2. Mockear deleteItem para devolver éxito
        jest.spyOn(require('../../services/cart.service'), 'deleteItem')
            .mockResolvedValue({
                success: true,
                message: 'Producto eliminado del carrito',
                cart: { items: [], total: 0 }
            });

        // 3. Ejecutar
        const response = await request(app)
            .delete('/cart/1/item/123')
            .send();

        // 4. Verificar
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    it('debería devolver un error si el item_id no existe en el carrito', async () => {
        // 1. Configurar mock para simular error
        jest.spyOn(require('../../services/cart.service'), 'deleteItem')
            .mockRejectedValue(new Error('Producto no encontrado en el carrito'));

        // 2. Ejecutar DELETE con item_id inexistente
        const response = await request(app)
            .delete('/cart/1/item/999') // item_id que no existe
            .send();

        // 3. Verificar
        expect(response.status).toBe(500); // Debe ser 500 (error)
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Producto no encontrado en el carrito');
    });
});

// Test para eliminar un producto del carrito por product_id (ÉXITO y FALLO)
describe('DELETE /cart (PRODUCT_ID)', () => {
    // Test exitoso
    it('debería eliminar un producto del carrito por product_id correctamente', async () => {
        // 1. Configuración manual EXTRA-SEGURA
        const cartService = require('../../services/cart.service');
        cartService.carts = {
            1: [{
                item_id: 1,
                product_id: 2, // ID a eliminar
                name: "Producto Forzado",
                price: 20,
                quantity: 1
            }]
        };

        // 2. Mock completo del método
        const originalMethod = cartService.deleteItemByProductId;
        cartService.deleteItemByProductId = async (user_id, product_id) => ({
            success: true,
            message: 'Producto eliminado (mock forzado)',
            cart: { items: [], total: 0 }
        });

        // 3. Ejecutar
        const response = await request(app)
            .delete('/cart/1/product/2')
            .send();

        // 4. Restaurar método original
        cartService.deleteItemByProductId = originalMethod;

        // 5. Verificaciones
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    // Test fallido
    it('debería devolver error si el product_id no existe en el carrito', async () => {
        // 1. Configurar mock manual del carrito
        const testCart = {
            1: [{  // user_id: 1
                item_id: 1,
                product_id: 99, // ¡No es 999!
                name: "Producto Test",
                price: 20,
                quantity: 1
            }]
        };

        // 2. Inyectar datos directamente
        cartService.carts = testCart;

        // 3. Ejecutar DELETE con product_id inexistente (999)
        const response = await request(app)
            .delete('/cart/1/product/999')
            .send();

        // 4. Verificaciones
        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toMatch(/no encontrado/); // Mensaje flexible
    });
});

afterAll(async () => {
    await db.destroy();
});








