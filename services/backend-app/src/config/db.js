const { Pool } = require('pg');
require('dotenv').config();

// Cấu hình Pool kết nối
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Bắt buộc để chạy trên Render/Supabase
    },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
});

// Logic kiểm tra kết nối và in log rõ ràng
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ [DATABASE] Lỗi kết nối Supabase:', err.message);
    } else {
        console.log('🚀 [DATABASE] Kết nối Cloud thành công - Hệ thống sẵn sàng!');
        release();
    }
});

module.exports = pool;