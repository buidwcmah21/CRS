const CourseRepository = require('../repositories/course.repository');
const redisClient = require('../config/redis');

// Hàm hỗ trợ xóa toàn bộ cache liên quan đến courses
const clearCourseCache = async () => {
    try {
        const keys = await redisClient.keys('courses:*');
        if (keys.length > 0) {
            await redisClient.del(keys);
            console.log('🧹 [REDIS] Cache cleared due to data change');
        }
    } catch (err) {
        console.error('❌ Redis Clear Cache Error:', err);
    }
};

exports.getAllCourses = async (req, res) => {
    try {
        const { search } = req.query;
        // Tạo key dựa trên từ khóa tìm kiếm để cache chính xác từng kết quả
        const cacheKey = search ? `courses:search:${search.toLowerCase()}` : 'courses:all';

        // 1. THỬ LẤY TỪ REDIS
        try {
            const cachedData = await redisClient.get(cacheKey);
            if (cachedData) {
                console.log('⚡ [CACHE HIT] Returning data from Redis');
                return res.json(JSON.parse(cachedData));
            }
        } catch (redisErr) {
            console.error('⚠️ Redis Get Error (Falling back to DB):', redisErr);
        }

        // 2. NẾU KHÔNG CÓ, LẤY TỪ POSTGRESQL
        console.log('🐢 [CACHE MISS] Fetching from PostgreSQL...');
        const courses = await CourseRepository.findAll(search);

        // 3. LƯU VÀO REDIS (Hết hạn sau 5 phút - 300 giây)
        try {
            await redisClient.setEx(cacheKey, 300, JSON.stringify(courses));
        } catch (redisErr) {
            console.error('⚠️ Redis Set Error:', redisErr);
        }

        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createCourse = async (req, res) => {
    try {
        const newCourse = await CourseRepository.create(req.body);
        await clearCourseCache(); // Xóa cache cũ vì đã có môn mới
        res.status(201).json(newCourse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const updated = await CourseRepository.update(req.params.id, req.body);
        await clearCourseCache(); // Xóa cache cũ vì dữ liệu đã đổi
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        await CourseRepository.delete(req.params.id);
        await clearCourseCache(); // Xóa cache cũ
        res.json({ message: 'Xóa môn học thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCourseById = async (req, res) => {
    try {
        const course = await CourseRepository.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};