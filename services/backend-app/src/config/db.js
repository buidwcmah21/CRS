const { Pool } = require('pg');
require('dotenv').config();

// Tách nhỏ thông tin để tránh lỗi định dạng chuỗi của Supabase Pooler
const pool = new Pool({
    user: 'postgres.ambcdexcefuqroladgnp', // Tên đăng nhập đầy đủ
    host: 'aws-1-ap-south-1.pooler.supabase.com',
    database: 'postgres',
    password: 'Khongnoi2110',
    port: 6543,
    ssl: {
        rejectUnauthorized: false
    },
    // Các tham số tối ưu cho môi trường Cloud
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
});

pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ [DATABASE] Lỗi kết nối:', err.message);
    } else {
        console.log('🚀 [DATABASE] ĐÃ THÔNG SUỐT LÊN SUPABASE CLOUD!');
        release();
    }
});

module.exports = pool;