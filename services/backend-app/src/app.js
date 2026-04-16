require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const courseRoutes = require('./routes/course.routes');
const enrollmentRoutes = require('./routes/enrollment.routes');

const app = express();
// Sửa đoạn này trong app.js
app.use(cors({
    origin: '*', // Cho phép tất cả các nguồn truy cập vào API trên Cloud
    credentials: true
}));

// TĂNG GIỚI HẠN NHẬN DỮ LIỆU LÊN 5MB ĐỂ CHỨA ẢNH
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
});