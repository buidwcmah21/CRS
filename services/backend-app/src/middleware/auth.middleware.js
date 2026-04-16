const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Lấy token từ header: "Authorization: Bearer <token>"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Truy cập bị từ chối. Vui lòng đăng nhập!' });
    }

    try {
        // Giải mã token bằng khóa bí mật trong file .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Gắn thông tin user (id, role, email) vào request để các hàm sau sử dụng
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
    }
};

module.exports = authMiddleware;