const productService = require('../services/product.service');

// Obtener todos los productos
exports.getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

// Crear un nuevo producto
exports.createProduct = async (req, res) => {
  const { name, price, image } = req.body;
  try {
    const result = await productService.create({ name, price, image });
    res.status(result.status).json(result.body);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al agregar el producto.' });
  }
};

// Actualizar un producto
exports.updateProduct = async (req, res) => {
  try {
      const { id } = req.params;
      const result = await productService.update(id, req.body);
      res.status(result.status).json(result.body);
  } catch (error) {
      res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};

// Eliminar un producto
exports.deleteProduct = async (req, res) => {
  try {
      const { name } = req.params;
      const result = await productService.deleteByName(name);
      
      if (result.status === 404) {
          return res.status(404).json(result.body);
      }
      
      return res.status(result.status).json(result.body);
  } catch (error) {
      console.error('Error en deleteProduct:', error);
      return res.status(500).json({ 
          success: false, 
          message: 'Error interno del servidor' 
      });
  }
};
