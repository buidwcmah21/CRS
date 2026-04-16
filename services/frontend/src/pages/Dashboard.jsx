import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { user, logout, updateUser } = useAuth();
    const navigate = useNavigate();
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef(null);

    // 1. Lấy dữ liệu từ Server
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                if (user?.role === 'STUDENT') {
                    const res = await axios.get(`${API_BASE_URL}/enrollments/me`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    setEnrollments(res.data);
                }
            } catch (err) {
                console.error("Lỗi tải dữ liệu:", err);
                if (err.response?.status === 401) logout();
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchData();
    }, [user, navigate, logout]);

    // 2. Xử lý Upload Avatar từ máy tính/điện thoại
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Kiểm tra dung lượng (Max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB.");
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const base64Image = reader.result;
            const tId = toast.loading("Đang cập nhật ảnh đại diện...");
            
            try {
                const token = localStorage.getItem('token');
                await axios.put(`${API_BASE_URL}/auth/avatar`, 
                    { avatar_url: base64Image }, 
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                
                // Cập nhật vào AuthContext để hiển thị ngay lập tức
                updateUser({ avatar_url: base64Image });
                
                toast.dismiss(tId);
                toast.success("Cập nhật ảnh thành công!");
            } catch (err) {
                toast.dismiss(tId);
                toast.error("Không thể tải ảnh lên server.");
            }
        };
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-primary" role="status"></div>
        </div>
    );

    // ==========================================
    // GIAO DIỆN DÀNH CHO ADMIN
    // ==========================================
    if (user?.role !== 'STUDENT') {
        const adminTools = [
            { title: 'Quản lý Học phần', icon: 'bi-journal-text', color: '#4e73df', link: '/courses', desc: 'Cấu hình danh mục môn học' },
            { title: 'Danh sách Sinh viên', icon: 'bi-people', color: '#1cc88a', link: '#', desc: 'Quản lý thông tin người dùng' },
            { title: 'Báo cáo Đăng ký', icon: 'bi-graph-up', color: '#36b9cc', link: '/enrollments', desc: 'Thống kê tỉ lệ lấp đầy lớp' },
            { title: 'Cài đặt Hệ thống', icon: 'bi-sliders', color: '#f6c23e', link: '#', desc: 'Mở/Khóa cổng đăng ký' }
        ];

        return (
            <div className="container py-5">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h2 className="fw-bold">NEXUS MANAGEMENT HUB</h2>
                        <p className="text-muted">Quản trị viên: <strong>{user?.full_name}</strong></p>
                    </div>
                    <button className="btn btn-danger rounded-pill px-4 shadow-sm" onClick={logout}>Đăng xuất</button>
                </div>

                <div className="row g-4">
                    {adminTools.map((tool, i) => (
                        <div className="col-md-3" key={i}>
                            <Link to={tool.link} className="text-decoration-none">
                                <div className="card h-100 border-0 shadow-sm hover-lift text-center p-4 bg-card">
                                    <div className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle" 
                                         style={{width: '70px', height: '70px', backgroundColor: tool.color + '20', color: tool.color}}>
                                        <i className={`bi ${tool.icon} fs-2`}></i>
                                    </div>
                                    <h5 className="fw-bold text-body">{tool.title}</h5>
                                    <p className="small text-muted mb-0">{tool.desc}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
                <style dangerouslySetInnerHTML={{__html: `.hover-lift { transition: all 0.2s; } .hover-lift:hover { transform: translateY(-10px); box-shadow: 0 1rem 2rem rgba(0,0,0,0.1)!important; }` }} />
            </div>
        );
    }

    // ==========================================
    // GIAO DIỆN DÀNH CHO SINH VIÊN
    // ==========================================
    const successCredits = enrollments.filter(e => e.status === 'SUCCESS').length * 3;
    const chartData = [
        { name: 'Hoàn thành', value: successCredits, color: '#0d6efd' },
        { name: 'Còn lại', value: Math.max(0, 120 - successCredits), color: '#e9ecef' }
    ];

    return (
        <div className="container py-4">
            {/* Profile Card */}
            <div className="card border-0 shadow-sm rounded-4 mb-4 p-4 bg-card">
                <div className="row align-items-center">
                    <div className="col-md-auto text-center position-relative">
                        <img 
                            src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.full_name}&background=random`} 
                            alt="Avatar" 
                            className="rounded-circle shadow-sm border border-3 border-white" 
                            style={{ width: '110px', height: '110px', objectFit: 'cover' }} 
                        />
                        <button onClick={() => fileInputRef.current.click()} className="btn btn-primary rounded-circle position-absolute bottom-0 end-0 shadow-sm" style={{width:'32px', height:'32px', padding:0}}>
                            <i className="bi bi-camera-fill" style={{fontSize:'14px'}}></i>
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{display: 'none'}} />
                    </div>
                    <div className="col-md ms-md-3 mt-3 mt-md-0">
                        <h2 className="fw-bold mb-1">Course Registration System</h2>
                        <p className="text-muted mb-0">Sinh viên: <strong>{user?.full_name}</strong> | MSSV: 2300{user?.id}</p>
                        <span className="badge bg-primary-subtle text-primary mt-2 px-3 py-2 rounded-pill">Chuyên ngành IT</span>
                    </div>
                    <div className="col-md-auto ms-auto mt-3 mt-md-0">
                        <button className="btn btn-outline-danger rounded-pill px-4" onClick={logout}>Đăng xuất</button>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* Biểu đồ tiến độ */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 h-100 p-4 text-center bg-card">
                        <h6 className="fw-bold text-start mb-4 text-uppercase text-muted small">Tiến độ tích lũy</h6>
                        <div style={{ width: '100%', height: '200px' }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={chartData} innerRadius={65} outerRadius={85} paddingAngle={5} dataKey="value" stroke="none">
                                        {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <h3 className="fw-bold mt-3">{successCredits} / 120</h3>
                        <p className="text-muted small mb-0">Tín chỉ hệ thống</p>
                    </div>
                </div>

                {/* Quick Links & Table */}
                <div className="col-lg-8">
                    <div className="row g-3 mb-4">
                        {[
                            { t: 'Lịch học', p: '/timetable', i: 'bi-calendar3', c: 'bg-info-subtle text-info' },
                            { t: 'Đăng ký', p: '/courses', i: 'bi-plus-circle', c: 'bg-success-subtle text-success' },
                            { t: 'Kết quả', p: '/enrollments', i: 'bi-check2-circle', c: 'bg-warning-subtle text-warning' }
                        ].map((item, i) => (
                            <div className="col-4" key={i}>
                                <Link to={item.p} className="text-decoration-none">
                                    <div className={`card border-0 shadow-sm rounded-4 p-3 text-center hover-lift ${item.c}`}>
                                        <i className={`bi ${item.i} fs-2 mb-1`}></i>
                                        <div className="fw-bold small text-dark">{item.t}</div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>

                    <div className="card border-0 shadow-sm rounded-4 p-4 bg-card">
                        <h6 className="fw-bold mb-3 text-uppercase text-muted small">Môn học mới đăng ký</h6>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <tbody>
                                    {enrollments.slice(0, 3).map(e => (
                                        <tr key={e.id}>
                                            <td className="ps-0">
                                                <div className="fw-bold text-primary">{e.course_name}</div>
                                                <div className="text-muted small">{e.course_code}</div>
                                            </td>
                                            <td className="text-end pe-0">
                                                <span className={`badge rounded-pill ${e.status === 'SUCCESS' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                    {e.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {enrollments.length === 0 && (
                                        <tr><td className="text-center py-4 text-muted">Chưa có dữ liệu đăng ký.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{__html: `
                .hover-lift { transition: transform 0.2s; }
                .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.1)!important; }
                [data-bs-theme='dark'] .bg-card { background-color: #2b3035 !important; }
                [data-bs-theme='light'] .bg-card { background-color: #ffffff !important; }
            `}} />
        </div>
    );
};

export default Dashboard;