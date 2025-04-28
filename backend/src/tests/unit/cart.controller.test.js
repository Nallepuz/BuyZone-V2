const cartController = require('../../controllers/cart.controller');
const cartService = require('../../services/cart.service');

// Mock del servicio de cart
jest.mock('../../services/cart.service');

describe('Cart Controller Testeos Unitarios', () => {
    
  // Test para obtener el carrito de un usuario
  it('debería devolver el carrito de un usuario', async () => {
    const req = { params: { user_id: 1 } };
    const res = { json: jest.fn() };

    // Simulamos que el servicio devuelve un carrito vacío
    cartService.getCart.mockResolvedValue({ items: [], total: 0 });

    await cartController.getCart(req, res);

    // Verificamos que la respuesta sea correcta
    expect(res.json).toHaveBeenCalledWith({ items: [], total: 0 });
  });

  // Test para agregar un producto al carrito
  it('debería agregar un producto al carrito', async () => {
    const req = { body: { user_id: 1, product_id: 2 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    // Simulamos que el servicio agrega el producto correctamente
    cartService.addToCart.mockResolvedValue({
      success: true,
      message: 'Producto agregado al carrito',
      cart: { items: [{ product_id: 2 }], total: 20 }
    });

    await cartController.addToCart(req, res);

    // Verificamos que la respuesta tenga el estado 200 y el mensaje correcto
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Producto agregado al carrito',
      cart: { items: [{ product_id: 2 }], total: 20 }
    });
  });

  // Test para eliminar un producto del carrito por item_id
  it('debería eliminar un producto del carrito por item_id', async () => {
    const req = { params: { user_id: 1, item_id: 1 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    // Simulamos que el producto se elimina correctamente
    cartService.deleteItem.mockResolvedValue({ success: true, message: 'Producto eliminado del carrito.' });

    await cartController.deleteCartItemByItemId(req, res);

    // Verificamos que la respuesta tenga el estado 200 y el mensaje correcto
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Producto eliminado del carrito.'
    });
  });

  // Test para eliminar un producto del carrito por product_id
  it('debería eliminar un producto del carrito por product_id', async () => {
    const req = { params: { user_id: 1, product_id: 1 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    // Simulamos que el producto se elimina correctamente
    cartService.deleteItemByProductId.mockResolvedValue({
      success: true,
      message: 'Producto eliminado del carrito.'
    });

    await cartController.deleteCartItemByProductId(req, res);

    // Verificamos que la respuesta tenga el estado 200 y el mensaje correcto
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Producto eliminado del carrito.'
    });
  });
});
