import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import toast from 'react-hot-toast';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchCourses = async (search = '') => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/courses?search=${search}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setCourses(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchCourses(searchTerm);
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleRegister = async (courseId) => {
        const tId = toast.loading('Đang xử lý đăng ký...');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_BASE_URL}/enrollments`, 
                { course_id: courseId },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            
            toast.dismiss(tId);
            if (res.data.data && res.data.data.status === 'SUCCESS') {
                toast.success(res.data.message);
            } else {
                toast(res.data.message, { 
                    icon: '⏳', 
                    style: { background: '#fff3cd', color: '#856404', border: '1px solid #ffeeba' } 
                });
            }
        } catch (err) {
            toast.dismiss(tId);
            toast.error(err.response?.data?.message || "Đăng ký thất bại");
        }
    };

    if (loading) return <div className="container mt-5 text-center"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="container mt-5">
            <div className="row mb-4 align-items-center">
                <div className="col-md-6">
                    <h2 className="fw-bold text-dark">Available Courses</h2>
                </div>
                <div className="col-md-6">
                    <input 
                        type="text" 
                        className="form-control w-75 ms-auto shadow-sm" 
                        placeholder="Tìm kiếm môn học..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="row">
                {courses.map(course => (
                    <div className="col-md-4 mb-4" key={course.id}>
                        <div className="card shadow-sm border-0 h-100">
                            <div className="card-header bg-primary text-white d-flex justify-content-between py-2">
                                <span className="fw-bold">{course.course_code}</span>
                                <span className="badge bg-white text-primary">{course.semester}</span>
                            </div>
                            <div className="card-body d-flex flex-column">
                                <h4 className="card-title fw-bold mb-1">{course.course_name}</h4>
                                <p className="text-muted mb-1 small">{course.lecturer_name}</p>
                                <p className="text-muted mb-3 small">{course.day_of_week} ({course.start_time.substring(0,5)} - {course.end_time.substring(0,5)})</p>
                                <div className="mt-auto d-flex justify-content-between align-items-center pt-3 border-top">
                                    <span className="fw-bold fs-5">Sĩ số: {course.capacity}</span>
                                    <button className="btn btn-primary px-4 fw-bold" onClick={() => handleRegister(course.id)}>Đăng ký</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Courses;