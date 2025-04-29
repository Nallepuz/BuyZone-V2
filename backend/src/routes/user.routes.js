const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// RUTA PARA REGISTRO
router.post('/users/signup', userController.signup);
// RUTA PARA LOGIN
router.post('/login', userController.login);
router.post('/users/login', userController.login); 

router.put('/update-email', userController.updateEmail);
router.put('/update-password', userController.updatePassword);
router.delete('/delete-account', userController.deleteAccount);

module.exports = router;
