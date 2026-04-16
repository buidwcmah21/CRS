import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import toast from 'react-hot-toast';
// Import logo CRS của bạn
import crsLogo from '../assets/CRS.png'; 

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/auth/register`, { 
                email, 
                password, 
                full_name: fullName 
            });
            toast.success('Đăng ký thành công! Bây giờ bạn có thể đăng nhập.');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Đăng ký thất bại');
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="card shadow-lg border-0 rounded-4" style={{maxWidth: '450px', width: '100%'}}>
                <div className="card-body p-5">
                    {/* Logo và Tiêu đề mới */}
                    <div className="text-center mb-4">
                        <img src={crsLogo} alt="CRS Logo" style={{height: '70px'}} className="mb-3" />
                        <h4 className="fw-bold text-dark">TẠO TÀI KHOẢN MỚI</h4>
                        <p className="text-muted small">Hệ thống Đăng ký Học phần CRS</p>
                    </div>

                    <form onSubmit={handleRegister}>
                        <div className="mb-3">
                            <label className="form-label small fw-bold text-muted">HỌ VÀ TÊN SINH VIÊN</label>
                            <input 
                                type="text" 
                                className="form-control form-control-lg fs-6" 
                                placeholder="Nhập họ và tên"
                                value={fullName} 
                                onChange={(e) => setFullName(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label small fw-bold text-muted">EMAIL / TÊN ĐĂNG NHẬP</label>
                            <input 
                                type="email" 
                                className="form-control form-control-lg fs-6" 
                                placeholder="example@gmail.com"
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label small fw-bold text-muted">MẬT KHẨU</label>
                            <input 
                                type="password" 
                                className="form-control form-control-lg fs-6" 
                                placeholder="Nhập mật khẩu bảo mật"
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>

                        {/* Nút bấm đổi sang màu Xanh dương (Primary) để khớp với Login */}
                        <button type="submit" className="btn btn-primary w-100 fw-bold py-2 mb-3 shadow-sm">
                            ĐĂNG KÝ TÀI KHOẢN
                        </button>

                        <div className="text-center small">
                            <span className="text-muted">Đã có tài khoản? </span>
                            <Link to="/login" className="text-decoration-none fw-bold">Đăng nhập ngay</Link>
                        </div>
                    </form>
                </div>
                <div className="card-footer bg-white border-0 text-center pb-4">
                    <p className="text-muted" style={{fontSize: '0.7rem'}}>
                        © 2024 Course Registration System. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;