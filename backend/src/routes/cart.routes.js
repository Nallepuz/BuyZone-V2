const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

// Obtener el carrito de un usuario
router.get('/:user_id', cartController.getCart);

// Agregar un producto al carrito
router.post('/', cartController.addToCart);

// Eliminar un producto del carrito por item_id
router.delete('/:user_id/item/:item_id', cartController.deleteCartItemByItemId);

// Eliminar un producto del carrito por product_id
router.delete('/:user_id/product/:product_id', cartController.deleteCartItemByProductId);

module.exports = router;
