const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    // TỐI ƯU KẾT NỐI (Connection Pooling)
    max: 20, // Cho phép tối đa 20 kết nối đồng thời
    idleTimeoutMillis: 30000, // Giữ kết nối chờ trong 30s thay vì đóng ngay
    connectionTimeoutMillis: 5000, // Đợi tối đa 5s để kết nối, tránh treo web
});

pool.on('connect', () => {
    console.log('🐘 [PostgreSQL] Đã giữ chỗ kết nối sẵn sàng!');
});

module.exports = pool;