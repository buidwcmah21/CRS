const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Vẫn giữ cấu hình này để hỗ trợ môi trường Docker
    ssl: {
        rejectUnauthorized: false
    }
});

pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ [SUPABASE] Lỗi kết nối:', err.message);
    } else {
        console.log('🚀 [SUPABASE] ĐÃ THÔNG SUỐT LÊN VÙNG AP-SOUTH-1!');
        release();
    }
});

module.exports = pool;