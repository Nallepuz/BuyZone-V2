const db = require('../config/db');
const carts = {}; // Almacenamiento temporal en memoria

// Obtener el carrito de un usuario
const getCart = async (user_id) => {
  const items = carts[user_id] || [];
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { items, total };
};


// Agregar un producto al carrito
const addToCart = async (user_id, product_id) => {
  if (!user_id || !product_id) throw new Error("Se requieren user_id y product_id");

  const product = await db('products').where({ id: product_id }).first();
  if (!product) throw new Error("Producto no encontrado");

  if (!carts[user_id]) carts[user_id] = [];

  const existingItem = carts[user_id].find(item => item.product_id === product_id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    carts[user_id].push({ 
      item_id: Date.now(),  // ID único para el ítem
      product_id: product.id,  // Referencia al producto
      ...product,
      quantity: 1
    });
  }

  return {
    success: true,
    message: "Producto agregado al carrito",
    cart: {
      items: carts[user_id],
      total: carts[user_id].reduce((sum, item) => sum + item.price * item.quantity, 0)
    }
  };
};
  
// Eliminar un producto del carrito por item_id
const deleteItem = async (user_id, item_id) => {
  if (!carts[user_id]) throw new Error('Carrito no encontrado');
  
  const itemIndex = carts[user_id].findIndex(item => item.item_id == item_id);
  if (itemIndex === -1) throw new Error('Producto no encontrado en el carrito');
  
  carts[user_id].splice(itemIndex, 1);
  return {
    success: true,
    message: 'Producto eliminado del carrito',
    cart: {
      items: carts[user_id],
      total: carts[user_id].reduce((sum, item) => sum + item.price * item.quantity, 0)
    }
  };
};

// Eliminar un producto del carrito por product_id
const deleteItemByProductId = async (user_id, product_id) => {
  if (!carts[user_id]) throw new Error('Carrito no encontrado');
  
  const initialLength = carts[user_id].length;
  carts[user_id] = carts[user_id].filter(item => item.product_id != product_id);
  
  if (carts[user_id].length === initialLength) {
    throw new Error('Producto no encontrado en el carrito');
  }

  return {
    success: true,
    message: 'Producto eliminado correctamente',
    cart: {
      items: carts[user_id],
      total: carts[user_id].reduce((sum, item) => sum + item.price * item.quantity, 0)
    }
  };
};

module.exports = {
    getCart,
    addToCart,
    deleteItem,
    deleteItemByProductId,
    carts
};