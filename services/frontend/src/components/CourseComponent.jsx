import React from 'react';

const CourseComponent = ({ course, onRegister }) => {
    return (
        <div className="card shadow-sm border-0 h-100">
            {/* Thanh tiêu đề màu xanh chứa Mã môn và Học kỳ */}
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-2">
                <span className="fw-bold small">{course.course_code}</span>
                <span className="badge bg-white text-primary small">{course.semester || 'HK1'}</span>
            </div>

            <div className="card-body d-flex flex-column">
                {/* Tên môn học */}
                <h5 className="card-title fw-bold mb-2 text-dark">
                    {course.course_name}
                </h5>
                
                {/* Thông tin giảng viên */}
                <p className="card-text mb-1 small text-muted">
                    <i className="bi bi-person-badge me-2"></i>
                    {course.lecturer_name}
                </p>

                {/* Thông tin lịch học */}
                <p className="card-text mb-3 small text-muted">
                    <i className="bi bi-calendar3 me-2"></i>
                    {course.day_of_week} ({course.start_time?.substring(0, 5)} - {course.end_time?.substring(0, 5)})
                </p>

                {/* Phần chân Card chứa Sĩ số và Nút đăng ký */}
                <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                    <div>
                        <span className="text-muted extra-small d-block" style={{fontSize: '0.7rem'}}>CAPACITY</span>
                        <span className="fw-bold text-primary">{course.capacity}</span>
                    </div>
                    <button 
                        className="btn btn-primary btn-sm px-4 fw-bold rounded-pill shadow-sm"
                        onClick={() => onRegister(course.id)}
                    >
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseComponent;