const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// 1. ĐĂNG KÝ TÀI KHOẢN
exports.register = async (req, res) => {
    const { email, password, full_name } = req.body;
    try {
        // Kiểm tra email tồn tại
        const userExists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'Email này đã được sử dụng' });
        }

        // Hash mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Lưu vào Database Cloud (Mặc định role là STUDENT)
        const newUser = await pool.query(
            `INSERT INTO users (email, password_hash, full_name, role) 
             VALUES ($1, $2, $3, $4) 
             RETURNING id, email, full_name, role, avatar_url`,
            [email, hashedPassword, full_name, 'STUDENT']
        );

        console.log(`✅ Người dùng mới đã đăng ký: ${email}`);
        res.status(201).json({ message: 'Đăng ký thành công', user: newUser.rows[0] });
    } catch (error) {
        console.error("🔥 LỖI ĐĂNG KÝ:", error.message);
        res.status(500).json({ message: 'Lỗi server: ' + error.message });
    }
};

// 2. ĐĂNG NHẬP
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Tài khoản không tồn tại' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Mật khẩu không chính xác' });
        }

        // Tạo JWT Token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'crs_secret_key_2024',
            { expiresIn: '24h' }
        );

        console.log(`🔑 Người dùng đã đăng nhập: ${email}`);
        res.json({
            token,
            user: { 
                id: user.id, 
                email: user.email, 
                full_name: user.full_name, 
                role: user.role,
                avatar_url: user.avatar_url 
            }
        });
    } catch (error) {
        console.error("🔥 LỖI ĐĂNG NHẬP:", error.message);
        res.status(500).json({ message: 'Lỗi server: ' + error.message });
    }
};

// 3. LẤY THÔNG TIN USER HIỆN TẠI (Dùng cho Dashboard)
exports.getCurrentUser = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, email, full_name, role, avatar_url FROM users WHERE id = $1', 
            [req.user.id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error("🔥 LỖI LẤY THÔNG TIN USER:", error.message);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// 4. CẬP NHẬT ẢNH ĐẠI DIỆN (AVATAR)
exports.updateAvatar = async (req, res) => {
    const { avatar_url } = req.body;
    try {
        // Cập nhật chuỗi Base64 vào cột avatar_url
        await pool.query(
            'UPDATE users SET avatar_url = $1 WHERE id = $2', 
            [avatar_url, req.user.id]
        );
        
        console.log(`📸 Đã cập nhật avatar cho User ID: ${req.user.id}`);
        res.json({ message: 'Cập nhật ảnh đại diện thành công!', avatar_url });
    } catch (error) {
        console.error("🔥 LỖI CẬP NHẬT AVATAR:", error.message);
        res.status(500).json({ message: 'Lỗi server khi tải ảnh' });
    }
};