import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import toast from 'react-hot-toast';

const Enrollments = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyEnrollments = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/enrollments/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setEnrollments(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyEnrollments();
        const interval = setInterval(fetchMyEnrollments, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleCancel = async (courseId) => {
        if (!window.confirm("Bạn có chắc chắn muốn hủy môn học này?")) return;
        
        const tId = toast.loading('Đang xử lý hủy môn...');
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/enrollments/${courseId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            toast.dismiss(tId);
            toast.success("Đã hủy đăng ký thành công!");
            fetchMyEnrollments();
        } catch (err) {
            toast.dismiss(tId);
            toast.error("Lỗi khi hủy môn học");
        }
    };

    if (loading) return <div className="text-center mt-5"><h3>Đang tải...</h3></div>;

    return (
        <div className="container mt-4">
            <div className="card shadow-sm border-0 rounded-3">
                <div className="card-header bg-white py-3">
                    <h3 className="mb-0 fw-bold text-primary">Kết quả đăng ký học phần</h3>
                </div>
                <div className="card-body p-0">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">Môn học</th>
                                <th>Học kỳ</th>
                                <th>Trạng thái</th>
                                <th className="text-center pe-4">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enrollments.map(item => (
                                <tr key={item.id}>
                                    <td className="ps-4">
                                        <div className="fw-bold">{item.course_name}</div>
                                        <div className="small text-muted">{item.course_code} • Nhóm {item.group_code}</div>
                                    </td>
                                    <td>{item.semester}</td>
                                    <td>
                                        {item.status === 'SUCCESS' ? (
                                            <span className="badge rounded-pill bg-success px-3 py-2">THÀNH CÔNG</span>
                                        ) : (
                                            <span className="badge rounded-pill bg-warning text-dark px-3 py-2">ĐANG CHỜ</span>
                                        )}
                                    </td>
                                    <td className="text-center pe-4">
                                        <button className="btn btn-outline-danger btn-sm rounded-pill px-3" onClick={() => handleCancel(item.course_id)}>Hủy môn</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Enrollments;