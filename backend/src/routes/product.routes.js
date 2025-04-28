const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// RUTAS CRUD de productos
router.get('/', productController.getAllProducts);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:name', productController.deleteProduct);

module.exports = router;
