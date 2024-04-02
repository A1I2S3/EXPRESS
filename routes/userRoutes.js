const express = require('express');
const { verifyToken } = require('../middleware/verifytoken.js');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/create', userController.createUser);

router.post('/login', userController.loginUser);

router.delete('/:userId/delete', verifyToken, userController.deleteUser);

router.put('/:userId/update', verifyToken, userController.updateUser);

module.exports = router;