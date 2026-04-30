require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const axios = require('axios');
const authRoutes = require('./routes/auth.routes');
const courseRoutes = require('./routes/course.routes');
const enrollmentRoutes = require('./routes/enrollment.routes');

const app = express();

// Nén dữ liệu để tăng tốc
app.use(compression());

app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);

// Trang chủ để kiểm tra server sống hay chết
app.get('/', (req, res) => res.send('NEXUS API IS ALIVE 🚀'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Backend đang chạy tại port ${PORT}`);
});

// Cơ chế tự đánh thức server Render (Keep-alive)
const RENDER_URL = `https://${process.env.RENDER_EXTERNAL_HOSTNAME || 'crs-backend-nexus.onrender.com'}/api/auth/user`;
setInterval(async () => {
    try {
        await axios.get(RENDER_URL);
        console.log('⚡ [Keep-alive] Ping thành công');
    } catch (err) {
        // Bỏ qua lỗi vì mục đích chỉ là để server không ngủ
    }
}, 14 * 60 * 1000);

module.exports = app;