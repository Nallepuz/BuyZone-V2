const userController = require('../../controllers/user.controller');
const userService = require('../../services/user.service');

// Mock de los servicios de user
jest.mock('../../services/user.service', () => ({
    registerUser: jest.fn(),
    loginUser: jest.fn(),
    updateEmail: jest.fn(),
    updatePassword: jest.fn(),
    deleteAccount: jest.fn(),
}));



// Test para el controlador de usuarios
describe('User Controller Testeo Unitario', () => {

    //testeo de la función signup
    it('debería crear un nuevo usuario correctamente', async () => {
        const req = {
            body: { email: 'test@example.com', password: 'password123' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Simula que el servicio devuelve una respuesta exitosa
        userService.registerUser.mockResolvedValue({
            success: true,
            message: 'Usuario creado exitosamente.'
        });

        await userController.signup(req, res);

        // Verifica que el servicio de signup fue llamado correctamente
        expect(userService.registerUser).toHaveBeenCalledWith('test@example.com', 'password123'); // Compara con los valores de req.body
        expect(res.status).toHaveBeenCalledWith(201);  // Espera un código de estado 201
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Usuario creado exitosamente.'
        });
    });

    // Test para la función loginUser
    it('debería autenticar un usuario correctamente', async () => {
        const req = {
            body: { email: 'test@example.com', password: 'password123' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Mock del servicio loginUser
        userService.loginUser.mockResolvedValue({
            token: 'fake-jwt-token'
        });

        // Llamamos al controlador de login
        await userController.login(req, res);

        // Verificar que la función loginUser fue llamada con los parámetros correctos
        expect(userService.loginUser).toHaveBeenCalledWith('test@example.com', 'password123');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            token: 'fake-jwt-token'
        });
    });

    // Test para la función de updateEmail
    it('debería actualizar el email del usuario', async () => {
        const req = {
            body: { user_id: 1, email: 'new-email@example.com' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Simula que el servicio de updateEmail devuelve una respuesta exitosa
        userService.updateEmail.mockResolvedValue({
            success: true,
            message: 'Email actualizado exitosamente.'
        });

        await userController.updateEmail(req, res);

        // Verifica que el servicio de updateEmail fue llamado correctamente
        expect(userService.updateEmail).toHaveBeenCalledWith(1, 'new-email@example.com'); 
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Email actualizado exitosamente.'
        });
    });


    // Test para la función de updatePassword
    it('debería actualizar la contraseña del usuario', async () => {
        const req = {
            body: { user_id: 1, oldPassword: 'old-password123', newPassword: 'new-password123' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Simula que el servicio de updatePassword devuelve una respuesta exitosa
        userService.updatePassword.mockResolvedValue(true);

        await userController.updatePassword(req, res);

        // Verifica que el servicio de updatePassword fue llamado correctamente con los parámetros correctos
        expect(userService.updatePassword).toHaveBeenCalledWith(1, 'old-password123', 'new-password123');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Contraseña actualizada exitosamente.'
        });
    });

    // Test para la función de deleteAccount
    it('debería eliminar la cuenta del usuario', async () => {
        const req = {
            body: { user_id: 1 }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Mock del servicio deleteAccount
        userService.deleteAccount.mockResolvedValue({
            success: true,
            message: 'Cuenta eliminada exitosamente.'
        });

        // Llamamos al controlador de deleteAccount
        await userController.deleteAccount(req, res);

        // Verificamos que la función deleteAccount fue llamada con el user_id correcto
        expect(userService.deleteAccount).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Cuenta eliminada exitosamente.'
        });
    });

});
