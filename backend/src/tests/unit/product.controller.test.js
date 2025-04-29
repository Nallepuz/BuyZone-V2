const productController = require('../../controllers/product.controller');
const productService = require('../../services/product.service');

// Mock de las funciones de productService
jest.mock('../../services/product.service');

// Test para el controlador de productos
describe('Product Controller Testeo Unitario', () => {
  
  // Test para getAllProducts
  it('debería devolver un array de productos', async () => {
    // Simulamos que el servicio devuelve una lista de productos
    productService.getAll.mockResolvedValue([{ id: 1, name: 'Producto 1', price: 100, image: 'image1.jpg' }]);

    const req = {}; 
    const res = {
      json: jest.fn(),
    };

    await productController.getAllProducts(req, res);

    // Verificamos que se haya llamado al método json con los productos
    expect(res.json).toHaveBeenCalledWith([{ id: 1, name: 'Producto 1', price: 100, image: 'image1.jpg' }]);
  });

  // Test para createProduct
  it('debería crear un nuevo producto', async () => {
    const req = {
      body: { name: 'Nuevo Producto', price: 200, image: 'newproduct.jpg' }, // Producto a crear
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Simulamos que el servicio crea un producto exitosamente
    productService.create.mockResolvedValue({
      status: 201,
      body: { success: true, message: 'Producto agregado exitosamente.' },
    });

    await productController.createProduct(req, res);

    // Verificamos que el servicio fue llamado con los datos correctos
    expect(productService.create).toHaveBeenCalledWith({
      name: 'Nuevo Producto',
      price: 200,
      image: 'newproduct.jpg',
    });

    // Verificamos que la respuesta sea correcta
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Producto agregado exitosamente.',
    });
  });

  // Test para updateProduct
  it('debería actualizar un producto existente', async () => {
    const req = {
      params: { id: 1 }, // ID del producto a actualizar
      body: { name: 'Producto Actualizado', price: 150, image: 'updated.jpg' }, // Nuevos datos
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Simulamos que el servicio actualiza el producto exitosamente
    productService.update.mockResolvedValue({
      status: 200,
      body: { success: true, message: 'Producto actualizado exitosamente.' },
    });

    await productController.updateProduct(req, res);

    // Verificamos que el servicio fue llamado con los datos correctos
    expect(productService.update).toHaveBeenCalledWith(1, {
      name: 'Producto Actualizado',
      price: 150,
      image: 'updated.jpg',
    });

    // Verificamos que la respuesta sea correcta
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Producto actualizado exitosamente.',
    });
  });

  // Test para deleteProduct
  it('debería eliminar un producto existente', async () => {
    const req = {
      params: { name: 'Producto 1' }, // Nombre del producto a eliminar
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Simulamos que el servicio elimina el producto exitosamente
    productService.deleteByName.mockResolvedValue({
      status: 200,
      body: { success: true, message: 'Producto eliminado exitosamente.' },
    });

    await productController.deleteProduct(req, res);

    // Verificamos que el servicio fue llamado con el nombre correcto
    expect(productService.deleteByName).toHaveBeenCalledWith('Producto 1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Producto eliminado exitosamente.',
    });
  });
});