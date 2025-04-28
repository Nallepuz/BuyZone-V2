const request = require('supertest');
const app = require('../../app');
const db = require('../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Silenciar console.error durante los tests
beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
});
afterAll(async () => {
    // Restaurar console.error
    console.error.mockRestore();

    // Cerrar conexión a la DB
    await db.destroy().catch(() => { });
});

// TEST SIGNUP Exitoso
describe('POST /users signup', () => {
    const testUser = {
        email: `test${Date.now()}@example.com`,
        password: 'TestPass123!'
    };

    beforeAll(async () => {
        await db.raw('SELECT 1'); // Test de conexión
    });

    afterAll(async () => {
        await db('users').where({ email: testUser.email }).del();
    });

    it('debería registrar al usuario correctamente', async () => {
        const response = await request(app)
            .post('/users/signup') // Ahora coincide con la ruta registrada
            .send(testUser)
            .expect(201);

        expect(response.body).toHaveProperty('success', true);
    });

});
// TEST SIGNUP Fallido
describe('POST /users signup', () => {
    it('debería fallar cuando el email ya está registrado', async () => {
        // 1. Primero creamos un usuario exitosamente
        const existingUser = {
            email: `existing_${Date.now()}@example.com`,
            password: 'ExistingPass123!'
        };

        await request(app)
            .post('/users/signup')
            .send(existingUser)
            .expect(201);

        // 2. Intentamos registrar el mismo usuario otra vez
        const response = await request(app)
            .post('/users/signup')
            .send(existingUser) // Mismos datos
            .expect(400); // Esperamos error 400

        // 3. Verificamos la respuesta de error
        expect(response.body).toEqual({
            success: false,
            message: 'El correo ya está en uso.'
        });

        // 4. Limpieza
        await db('users').where({ email: existingUser.email }).del();
    });
});


// TEST LOGIN Exitoso
describe('POST /users login', () => {
    // Usuario de prueba (los mismos datos que usaste en signup)
    const testUser = {
        email: `test_${Date.now()}@example.com`,
        password: 'SecurePass123!'
    };

    beforeAll(async () => {
        // 1. Registrar un usuario para poder hacer login después
        await request(app)
            .post('/users/signup')
            .send(testUser);
    });

    afterAll(async () => {
        // 3. Limpieza: eliminar el usuario de prueba
        await db('users').where({ email: testUser.email }).del();
    });

    it('debería iniciar sesión y devolver un token correctamente', async () => {
        const response = await request(app)
            .post('/login') // Cambiado a /login en lugar de /users/login
            .send({
                email: testUser.email,
                password: testUser.password
            })
            .expect(200);

        expect(response.body).toMatchObject({
            success: true,
            token: expect.any(String)
        });
    });
});
// TEST LOGIN Fallido
describe('POST /users login', () => {
    // Usuario de prueba (mismos datos que en el exitoso)
    const testUser = {
        email: `test_${Date.now()}@example.com`,
        password: 'SecurePass123!'
    };

    beforeAll(async () => {
        // 1. Registrar un usuario válido primero
        await request(app)
            .post('/users/signup')
            .send(testUser);
    });

    afterAll(async () => {
        // 3. Limpieza: eliminar el usuario de prueba
        await db('users').where({ email: testUser.email }).del();
    });

    it('debería fallar con credenciales incorrectas', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                email: testUser.email,
                password: 'PASSWORD_INCORRECTO' // Password equivocado
            })
            .expect(401); // Unauthorized

        expect(response.body).toEqual({
            success: false,
            message: 'Credenciales inválidas' // Ajusta según tu mensaje
        });
    });
});


// TEST UPDATE EMAIL Exitoso
describe('PUT /update email', () => {
    const testUser = {
        email: `test_${Date.now()}@example.com`,
        password: 'SecurePass123!'
    };
    const newEmail = `updated_${Date.now()}@example.com`;
    let userId;
    let authToken;

    beforeAll(async () => {
        // Registro y login en 2 pasos simples
        await request(app).post('/users/signup').send(testUser);
        const user = await db('users').where({ email: testUser.email }).first();
        userId = user.id;

        const loginRes = await request(app)
            .post('/login')
            .send({ email: testUser.email, password: testUser.password });
        authToken = loginRes.body.token;
    });

    it('actualiza email correctamente', async () => {
        await request(app)
            .put('/update-email')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                user_id: userId, // Exactamente como lo espera el controlador
                email: newEmail  // Campo llamado "email" (no newEmail)
            })
            .expect(200)
            .then(res => {
                expect(res.body).toEqual({
                    success: true,
                    message: "Email actualizado exitosamente."
                });
            });

        // Verificación directa en DB
        const updatedUser = await db('users').where({ id: userId }).first();
        expect(updatedUser.email).toBe(newEmail);
    });

    afterAll(async () => {
        await db('users').where({ id: userId }).del();
    });
});
// TEST UPDATE EMAIL Fallido
describe('PUT /update email', () => {
    const testUser = {
        email: `test_${Date.now()}@example.com`,
        password: 'SecurePass123!'
    };
    let userId;
    let authToken;

    beforeAll(async () => {
        // Setup común
        await request(app).post('/users/signup').send(testUser);
        const user = await db('users').where({ email: testUser.email }).first();
        userId = user.id;

        const loginRes = await request(app)
            .post('/login')
            .send({ email: testUser.email, password: testUser.password });
        authToken = loginRes.body.token;
    });
    it('falla con usuario inexistente', async () => {
        await request(app)
            .put('/update-email')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                user_id: 999999, // ID inexistente
                email: 'nuevo@email.com'
            })
            .expect(404)
            .then(res => {
                expect(res.body.message).toBe("Usuario no encontrado.");
            });
    });

    afterAll(async () => {
        await db('users').where({ id: userId }).del();
    });
});



// TEST UPDATE PASSWORD Exitoso
describe('PUT /update password', () => {
    const testUser = {
        email: `user_${Date.now()}@example.com`,
        password: 'oldPassword123!'
    };
    let userId;
    let authToken;

    beforeAll(async () => {
        // 1. Registrar usuario
        const signupRes = await request(app).post('/users/signup').send(testUser);

        // Obtener ID del usuario
        const user = await db('users').where({ email: testUser.email }).first();
        userId = user.id;

        // 2. Login para obtener token
        const loginRes = await request(app)
            .post('/login')
            .send({ email: testUser.email, password: testUser.password });
        authToken = loginRes.body.token;
    });

    it('debería actualizar la contraseña con éxito', async () => {
        const newPassword = 'newSecurePassword456!';

        // 1. Actualizar contraseña
        const updateRes = await request(app)
            .put('/update-password')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                user_id: userId,
                oldPassword: testUser.password,
                newPassword: newPassword
            })
            .expect(200);

        // 2. Verificar respuesta
        expect(updateRes.body).toEqual({
            success: true,
            message: expect.stringContaining('actualizada')
        });

        // 3. Verificación directa en la DB (sin depender del login)
        const updatedUser = await db('users').where({ id: userId }).first();
        const isPasswordUpdated = await bcrypt.compare(newPassword, updatedUser.password);
        expect(isPasswordUpdated).toBe(true);
    });

    afterAll(async () => {
        await db('users').where({ id: userId }).del();
    });
});
// TEST UPDATE PASSWORD Fallido
describe('PUT /update password', () => {
    const testUser = {
        email: `user_${Date.now()}@example.com`,
        password: 'correctPassword123!'
    };
    let userId;
    let authToken;

    beforeAll(async () => {
        // 1. Registrar usuario
        await request(app).post('/users/signup').send(testUser);
        const user = await db('users').where({ email: testUser.email }).first();
        userId = user.id;

        // 2. Obtener token
        const loginRes = await request(app)
            .post('/login')
            .send({ email: testUser.email, password: testUser.password });
        authToken = loginRes.body.token;
    });

    it('debería fallar al intentar actualizar con contraseña actual incorrecta', async () => {
        const response = await request(app)
            .put('/update-password')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                user_id: userId,
                oldPassword: 'oldPassword123!', // Contraseña incorrecta
                newPassword: 'newPassword456!'
            })
            .expect(401);  // Asegúrate de que se espera el código 401 en caso de error

        expect(response.body).toEqual({
            success: false,
            message: 'Contraseña actual incorrecta'  // Asegúrate de que este mensaje coincide con el esperado
        });
    });


    afterAll(async () => {
        await db('users').where({ id: userId }).del(); // Limpieza
    });
});



// TEST DELETE ACCOUNT Exitoso
describe('DELETE /delete account', () => {
    const testUser = {
        email: `user_${Date.now()}@example.com`,
        password: 'testPassword123!'
    };
    let userId;
    let authToken;

    beforeAll(async () => {
        // Registrar usuario de prueba
        const signupRes = await request(app)
            .post('/users/signup')
            .send(testUser);

        // Obtener ID y token
        const user = await db('users').where({ email: testUser.email }).first();
        userId = user.id;

        const loginRes = await request(app)
            .post('/login')
            .send({ email: testUser.email, password: testUser.password });
        authToken = loginRes.body.token;
    });

    it('debería eliminar la cuenta correctamente', async () => {
        const response = await request(app)
            .delete('/delete-account')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ user_id: userId })
            .expect(200);

        expect(response.body).toEqual({
            success: true,
            message: "Cuenta eliminada exitosamente."
        });

        // Verificar que el usuario ya no existe en la BD
        const deletedUser = await db('users').where({ id: userId }).first();
        expect(deletedUser).toBeUndefined();
    });
});
// TEST DELETE ACCOUNT Fallido
describe('DELETE /delete account', () => {
    it('debería fallar cuando el usuario no existe', async () => {
        const nonExistentUserId = 999999;
        const testToken = jwt.sign({ id: nonExistentUserId }, 'secretKey', { expiresIn: '1h' });

        const response = await request(app)
            .delete('/delete-account')
            .set('Authorization', `Bearer ${testToken}`)
            .send({ user_id: nonExistentUserId })
            .expect(404);

        // Versión ajustada (solo verifica el mensaje)
        expect(response.body).toEqual({
            message: "Usuario no encontrado."
        });
    });
});

afterAll(async () => {
    await db.destroy();
});
