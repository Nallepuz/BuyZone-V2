const db = require('../config/db');

exports.getAll = async () => {
  try {
    return await db('products').select('*');
  } catch (error) {
    console.error('Error en product.service.getAll:', error);
    throw error; // Propaga el error para que el controller lo maneje
  }
};

exports.create = async ({ name, price, image }) => {
  if (!name || !image || price == null || price <= 0) {
    return {
      status: 400,
      body: { success: false, message: 'Todos los campos (imageUrl, name, price) son obligatorios y válidos.' }
    };
  }

  const exists = await db('products').where({ name }).first();
  if (exists) {
    return {
      status: 400,
      body: { success: false, message: 'El producto ya existe.' }
    };
  }

  await db('products').insert({ name, price, image });
  return {
    status: 201,
    body: { success: true, message: 'Producto agregado exitosamente.' }
  };
};

exports.update = async (id, data) => {
  try {
      // 1. Verificar si el producto existe
      const product = await db('products').where({ id }).first();
      if (!product) {
          return {
              status: 404,
              body: { success: false, message: 'Producto no encontrado.' }
          };
      }

      // 2. Validar datos (ej: precio positivo)
      if (data.price && data.price <= 0) {
          return {
              status: 400,
              body: { success: false, message: 'El precio debe ser positivo.' }
          };
      }

      // 3. Actualizar si todo es válido
      await db('products').where({ id }).update(data);
      return {
          status: 200,
          body: { success: true, message: 'Producto actualizado exitosamente.' }
      };

  } catch (error) {
      console.error('Error en product.service.update:', error);
      return {
          status: 500,
          body: { success: false, message: 'Error interno al actualizar el producto.' }
      };
  }
};

exports.deleteByName = async (name) => {
  const product = await db('products').where({ name }).first();
  if (!product) {
    return {
      status: 404,
      body: { success: false, message: 'Producto no encontrado.' }
    };
  }

  await db('products').where({ name }).del();
  return {
    status: 200,
    body: { success: true, message: 'Producto eliminado exitosamente.' }
  };
};
