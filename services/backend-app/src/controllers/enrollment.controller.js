const EnrollmentRepository = require('../repositories/enrollment.repository');
const redisClient = require('../config/redis'); // Đã sửa đường dẫn chuẩn

const invalidateCourseCache = async () => {
    try {
        const keys = await redisClient.keys('courses:*');
        if (keys.length > 0) {
            await redisClient.del(keys);
            console.log('🧹 [REDIS] Đã xóa cache môn học do có thay đổi đăng ký');
        }
    } catch (err) {
        console.error('⚠️ Redis Invalidation Error:', err);
    }
};

exports.createEnrollment = async (req, res) => {
    try {
        const { course_id } = req.body;
        const student_id = req.user.id;

        const enrollment = await EnrollmentRepository.create(student_id, course_id);
        await invalidateCourseCache();

        const message = enrollment.status === 'SUCCESS' 
            ? 'Đăng ký thành công!' 
            : 'Lớp đầy, bạn đã vào hàng chờ.';
            
        res.status(201).json({ message, data: enrollment });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteEnrollment = async (req, res) => {
    try {
        const { courseId } = req.params;
        const studentId = req.user.id;

        await EnrollmentRepository.delete(studentId, courseId);
        await invalidateCourseCache();

        res.json({ message: 'Đã hủy đăng ký và cập nhật hàng chờ.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyEnrollments = async (req, res) => {
    try {
        const enrollments = await EnrollmentRepository.findByStudentId(req.user.id);
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};