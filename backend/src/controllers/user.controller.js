const userService = require('../services/user.service');

// SIGNUP
const signup = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email y contraseña son obligatorios.' });
    }

    try {
        const result = await userService.registerUser(email, password);
        return res.status(201).json(result);
    } catch (err) {
        if (err.message === 'El correo ya está en uso.') {
            return res.status(400).json({ success: false, message: 'El correo ya está en uso.' });
        }
        return res.status(500).json({ success: false, message: err.message });
    }
};

// LOGIN
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email y contraseña son obligatorios.' });
    }

    try {
        const result = await userService.loginUser(email, password); // Esto llama a tu servicio de login

        if (!result) {
            console.error('Credenciales inválidas para el usuario:', email); // Log para ver que no se encuentra el usuario
            return res.status(401).json({ success: false, message: 'Credenciales inválidas' }); // Error de credenciales
        }

        res.status(200).json({
            success: true,
            token: result.token  // Asegúrate de que `result` tiene el token
        });  // Responde con status 200 en caso de éxito

    } catch (err) {
        console.error('Error en login:', err.message);
        res.status(401).json({ success: false, message: err.message });
    }
};

// ACTUALIZAR EMAIL
const updateEmail = async (req, res) => {
    const { user_id, email } = req.body;
    if (!user_id || !email) return res.status(400).json({ message: "Faltan datos obligatorios." });

    try {
        const result = await userService.updateEmail(user_id, email);
        if (!result) return res.status(404).json({ message: "Usuario no encontrado." });
        res.status(200).json({ success: true, message: "Email actualizado exitosamente." });
    } catch (err) {
        console.error("Error al actualizar email:", err.message);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};

// ACTUALIZAR CONTRASEÑA
const updatePassword = async (req, res) => {
    const { user_id, oldPassword, newPassword } = req.body;
    if (!user_id || !oldPassword || !newPassword) return res.status(400).json({ message: "Faltan datos obligatorios." });

    try {
        const result = await userService.updatePassword(user_id, oldPassword, newPassword);

        if (!result) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        return res.status(200).json({ success: true, message: "Contraseña actualizada exitosamente." });

    } catch (err) {
        if (err.message === 'Contraseña actual incorrecta') {
            return res.status(401).json({ success: false, message: 'Contraseña actual incorrecta' });
        }

        console.error("Error al actualizar contraseña:", err.message);
        return res.status(500).json({ success: false, message: err.message });
    }
};


// ELIMINAR CUENTA
const deleteAccount = async (req, res) => {
    const { user_id } = req.body;
    if (!user_id) return res.status(400).json({ message: "El user_id es obligatorio." });

    try {
        const result = await userService.deleteAccount(user_id);
        if (!result) return res.status(404).json({ message: "Usuario no encontrado." });
        res.status(200).json({ success: true, message: "Cuenta eliminada exitosamente." });  // Asegurarse de que el status es 200 aquí
    } catch (err) {
        console.error("Error al eliminar la cuenta:", err.message);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};


module.exports = {
    signup,
    login,
    updateEmail,
    updatePassword,
    deleteAccount,
    // y los anteriores: signup, login
};
