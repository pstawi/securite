const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

router.post('/login', UserController.login);

router.post('/register', UserController.register);

router.get('/getAllUsers', UserController.getAllUsers);

router.delete('/deleteUser/:id', UserController.deleteUser);

module.exports = router;