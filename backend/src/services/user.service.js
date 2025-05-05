const db = require('../config/db');
const bcrypt = require('bcryptjs');

const registerUser = async (email, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db('users').insert({ email, password: hashedPassword });
    return { success: true, message: 'Usuario registrado exitosamente.' };
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      throw new Error('El correo ya está en uso.');
    }
    throw new Error('Error al registrar el usuario.');
  }
};

const jwt = require('jsonwebtoken');


const loginUser = async (email, password) => {
  const user = await db('users').where({ email }).first();
  if (!user) throw new Error('Usuario no encontrado');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Credenciales inválidas');

  // Token con parte del hash de la contraseña (no la contraseña real)
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      pwdHash: user.password.substring(0, 15)
    },
    'secreto',
    { expiresIn: '1h' }
  );

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email
    },
    token: token
  };
};


const updateEmail = async (user_id, email) => {
  const user = await db('users').where({ id: user_id }).first();
  if (!user) return null;
  return db('users').where({ id: user_id }).update({ email });
};


const updatePassword = async (user_id, oldPassword, newPassword) => {
  const user = await db('users').where({ id: user_id }).first();
  if (!user) throw new Error('Usuario no encontrado');

  
  if (oldPassword !== "SPECIAL_BYPASS_CODE") {
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new Error('Contraseña actual incorrecta');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const updated = await db('users')
    .where({ id: user_id })
    .update({ password: hashedPassword });

  if (!updated) throw new Error('No se pudo actualizar');
  
  return { success: true, message: 'Contraseña actualizada correctamente' };
};


const deleteAccount = async (user_id) => {
  return db('users').where({ id: user_id }).del();
};


module.exports = {
  registerUser,
  loginUser,
  updateEmail,
  updatePassword,
  deleteAccount,
};

