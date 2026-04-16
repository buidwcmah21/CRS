import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import CourseComponent from '../components/CourseComponent';
import toast from 'react-hot-toast';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // Hàm lấy danh sách môn học từ Backend (Có hỗ trợ Search)
    const fetchCourses = async (search = '') => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/courses?search=${search}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setCourses(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Lỗi tải danh sách môn học:", err);
            toast.error("Không thể tải danh sách môn học");
            setLoading(false);
        }
    };

    // Kỹ thuật Debounce: Đợi người dùng ngừng gõ 300ms mới gọi API để tối ưu hiệu năng
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchCourses(searchTerm);
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    // Hàm xử lý đăng ký môn học
    const handleRegister = async (courseId) => {
        const tId = toast.loading('Đang xử lý đăng ký...');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_BASE_URL}/enrollments`, 
                { course_id: courseId },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            
            toast.dismiss(tId);

            // Kiểm tra trạng thái trả về từ Backend (SUCCESS hoặc PENDING)
            if (res.data.data && res.data.data.status === 'SUCCESS') {
                toast.success(res.data.message || "Đăng ký thành công!");
            } else {
                // Thông báo màu vàng nếu rơi vào hàng chờ (Waitlist)
                toast(res.data.message, { 
                    icon: '⏳', 
                    style: { background: '#fff3cd', color: '#856404', border: '1px solid #ffeeba' } 
                });
            }
        } catch (err) {
            toast.dismiss(tId);
            const errorMsg = err.response?.data?.message || "Đăng ký thất bại";
            toast.error(errorMsg);
        }
    };

    if (loading) return (
        <div className="container mt-5 text-center">
            <div className="spinner-border text-primary" role="status"></div>
            <h4 className="mt-3 text-muted">Đang tải danh sách môn học...</h4>
        </div>
    );

    return (
        <div className="container mt-5 mb-5">
            {/* Header: Tiêu đề và Ô tìm kiếm */}
            <div className="row mb-4 align-items-center">
                <div className="col-md-6">
                    <h2 className="fw-bold text-dark">
                        <i className="bi bi-journal-bookmark-fill me-2 text-primary"></i>
                        Available Courses
                    </h2>
                    <p className="text-muted mb-0">Chọn môn học và đăng ký cho học kỳ hiện tại</p>
                </div>
                <div className="col-md-6 mt-3 mt-md-0">
                    <div className="input-group shadow-sm rounded-pill overflow-hidden">
                        <span className="input-group-text bg-white border-end-0 ps-3">
                            <i className="bi bi-search text-muted"></i>
                        </span>
                        <input 
                            type="text" 
                            className="form-control border-start-0 ps-2 py-2" 
                            placeholder="Tìm theo tên, mã môn hoặc giảng viên..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Danh sách môn học sử dụng CourseComponent */}
            <div className="row">
                {courses.length > 0 ? (
                    courses.map(course => (
                        <div className="col-md-6 col-lg-4 mb-4" key={course.id}>
                            <CourseComponent 
                                course={course} 
                                onRegister={handleRegister} 
                            />
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center mt-5 py-5 bg-light rounded-4 border border-dashed">
                        <i className="bi bi-search display-1 text-muted opacity-25"></i>
                        <p className="fs-5 text-muted mt-3">Không tìm thấy môn học nào phù hợp với từ khóa của bạn.</p>
                        <button className="btn btn-link text-primary" onClick={() => setSearchTerm('')}>
                            Xóa tìm kiếm
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Courses;