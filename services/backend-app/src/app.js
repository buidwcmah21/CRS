require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression'); // Thư viện nén dữ liệu
const axios = require('axios'); // Dùng để tự ping
const authRoutes = require('./routes/auth.routes');
const courseRoutes = require('./routes/course.routes');
const enrollmentRoutes = require('./routes/enrollment.routes');

const app = express();

// 1. Bật nén Gzip: Giúp dữ liệu truyền đi nhanh hơn gấp 3-5 lần
app.use(compression());

app.use(cors({
    origin: '*',
    credentials: true
}));

// Tăng giới hạn để nhận ảnh avatar mượt mà
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Backend xịn xò đang chạy tại port ${PORT}`);
});

// 2. Cơ chế "Keep-alive": Cứ 14 phút tự gọi chính mình 1 lần để Render không tắt server (Cold Start)
const RENDER_URL = 'https://crs-backend-nexus.onrender.com/api/courses'; // Thay bằng link thật của bạn
setInterval(async () => {
    try {
        await axios.get(RENDER_URL);
        console.log('⚡ [Keep-alive] Đã đánh thức server thành công!');
    } catch (err) {
        console.log('⚡ [Keep-alive] Server vẫn đang thức.');
    }
}, 14 * 60 * 1000); 

module.exports = app;