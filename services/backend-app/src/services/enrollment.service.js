// src/services/enrollment.service.js
const enrollmentRepository = require('../repositories/enrollment.repository');
const courseRepository = require('../repositories/course.repository');

const doSchedulesOverlap = (courseA, courseB) => {
  if (courseA.day_of_week !== courseB.day_of_week) return false;
  return courseA.start_time < courseB.end_time && courseA.end_time > courseB.start_time;
};

const enrollStudentInCourse = async (studentId, courseId) => {
  // 1. Kiểm tra môn học tồn tại
  const courseToEnroll = await courseRepository.findById(courseId);
  if (!courseToEnroll) throw new Error('Course not found.');

  // 2. Kiểm tra đã đăng ký chưa
  const existingEnrollment = await enrollmentRepository.findByStudentAndCourse(studentId, courseId);
  if (existingEnrollment) throw new Error('You are already registered for this course.');

  // 3. Kiểm tra trùng lịch (chỉ với môn SUCCESS)
  const studentEnrolledCourses = await enrollmentRepository.findCoursesByStudentId(studentId);
  const successCourses = studentEnrolledCourses.filter(c => c.status === 'SUCCESS');
  for (const enrolledCourse of successCourses) {
    if (doSchedulesOverlap(courseToEnroll, enrolledCourse)) {
      throw new Error(
        `Schedule conflict: This course conflicts with ${enrolledCourse.course_code} (${enrolledCourse.day_of_week} ${enrolledCourse.start_time}-${enrolledCourse.end_time}).`
      );
    }
  }

  // 4. Tạo enrollment (capacity check + waitlist xử lý trong transaction)
  return enrollmentRepository.create(studentId, courseId);
};

const getStudentEnrollments = async (studentId) => {
  return enrollmentRepository.findCoursesByStudentId(studentId);
};

const deleteEnrollment = async (studentId, courseId) => {
  // Waitlist tự động được xử lý trong repository
  return enrollmentRepository.deleteEnrollment(studentId, courseId);
};

module.exports = {
  enrollStudentInCourse,
  getStudentEnrollments,
  deleteEnrollment,
};