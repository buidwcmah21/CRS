const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Đảm bảo authController.register và authController.login đã được định nghĩa ở file trên
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;