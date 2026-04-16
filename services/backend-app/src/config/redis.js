const redis = require('redis');
require('dotenv').config();

const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
    socket: {
        tls: true, // Kích hoạt bảo mật TLS cho Upstash
        reconnectStrategy: (retries) => Math.min(retries * 50, 2000)
    }
});

redisClient.on('error', (err) => console.error('❌ Redis Cloud Error:', err));
redisClient.on('connect', () => console.log('🚀 Connected to Upstash Cloud (Redis)!'));

(async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.error('❌ Could not connect to Redis Cloud:', err);
    }
})();

module.exports = redisClient;