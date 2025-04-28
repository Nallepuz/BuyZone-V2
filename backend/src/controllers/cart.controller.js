const cartService = require('../services/cart.service');

// Obtener el carrito de un usuario
const getCart = async (req, res) => {
  const { user_id } = req.params;
  try {
    const cart = await cartService.getCart(user_id); // Aseguramos que es asincrónico
    res.json(cart); // ✅ DEVUELVE SOLO EL CARRITO
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Agregar un producto al carrito
const addToCart = async (req, res) => {
  const { user_id, product_id } = req.body;

  try {
    // Verificación de los parámetros
    if (!user_id || !product_id) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren user_id y product_id',
      });
    }

    // Llamada al servicio para agregar el producto al carrito
    const result = await cartService.addToCart(user_id, product_id);

    // Respuesta con carrito actualizado
    return res.status(200).json({
      success: true,
      message: 'Producto agregado al carrito',
      cart: result.cart, // Aquí estamos enviando el carrito actualizado
    });
  } catch (error) {
    console.error('Error en addToCart:', error.message);  // Log del error
    return res.status(500).json({
      success: false,
      message: error.message,  // Enviar el mensaje de error
    });
  }
};

// Eliminar un producto del carrito por item_id
const deleteCartItemByItemId = async (req, res) => {
  const { user_id, item_id } = req.params;
  try {
    const result = await cartService.deleteItem(user_id, item_id);
    res.status(200).json({
      success: true,
      message: 'Producto eliminado del carrito.',
      cart: result.cart, // Asegúrate de enviar el carrito actualizado en la respuesta
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Eliminar un producto del carrito por product_id
const deleteCartItemByProductId = async (req, res) => {
  const { user_id, product_id } = req.params;
  try {
    const result = await cartService.deleteItemByProductId(user_id, product_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  deleteCartItemByItemId,
  deleteCartItemByProductId,
};
