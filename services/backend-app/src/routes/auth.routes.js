const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Các API Public (Không cần token)
router.post('/login', authController.login);
router.post('/register', authController.register);

// API Private (Bắt buộc phải có token mới được gọi)
router.get('/user', authMiddleware, authController.getCurrentUser);

module.exports = router;
router.put('/avatar', authMiddleware, authController.updateAvatar);