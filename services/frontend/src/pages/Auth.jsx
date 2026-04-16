import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import toast from 'react-hot-toast';
import crsLogo from '../assets/CRS.png'; 

const Auth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [generatedCaptcha, setGeneratedCaptcha] = useState('');
    const { handleLogIn } = useAuth();

    const generateCaptcha = () => {
        const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
        let result = '';
        for (let i = 0; i < 5; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
        setGeneratedCaptcha(result);
    };

    useEffect(() => { generateCaptcha(); }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (captchaInput.toLowerCase() !== generatedCaptcha.toLowerCase()) {
            toast.error("Mã bảo vệ không chính xác!");
            generateCaptcha();
            return;
        }
        handleLogIn({ email, password });
    };

    const newsItems = [
        { id: 1, date: '16', month: 'APR', title: 'HỆ THỐNG TỰ ĐỘNG HÓA HÀNG CHỜ (WAITLIST) ĐÃ KÍCH HOẠT', hot: true },
        { id: 2, date: '14', month: 'APR', title: 'HƯỚNG DẪN ĐĂNG KÝ HỌC PHẦN TRỰC TUYẾN HÈ 2024', hot: false },
        { id: 3, date: '10', month: 'APR', title: 'NÂNG CẤP KIẾN TRÚC API GATEWAY VÀ CACHING LAYER', hot: true },
        { id: 4, date: '05', month: 'APR', title: 'THÔNG BÁO VỀ VIỆC CẬP NHẬT THÔNG TIN SINH VIÊN', hot: false },
    ];

    return (
        <div className="min-vh-100 bg-white">
            <div className="container py-3 border-bottom">
                <div className="d-flex align-items-center">
                    <img src={crsLogo} alt="Logo" style={{height: '50px'}} className="me-3" />
                    <div>
                        <h4 className="mb-0 fw-bold text-primary">COURSE REGISTRATION</h4>
                        <h6 className="mb-0 text-secondary text-uppercase small">Management System</h6>
                    </div>
                </div>
            </div>

            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-8 pe-md-5">
                        <h5 className="fw-bold border-bottom border-primary border-3 d-inline-block pb-2 mb-4">BẢN TIN HỆ THỐNG</h5>
                        {newsItems.map(item => (
                            <div key={item.id} className="d-flex mb-4 shadow-sm p-3 rounded border-start border-4 border-primary bg-light">
                                <div className="text-center me-4" style={{minWidth: '60px'}}>
                                    <div className="small text-uppercase text-muted">{item.month}</div>
                                    <div className="h2 mb-0 fw-bold text-primary">{item.date}</div>
                                </div>
                                <div>
                                    <h6 className="fw-bold mb-1">{item.title} {item.hot && <span className="badge bg-danger ms-1">NEW</span>}</h6>
                                    <p className="small text-muted mb-0">Truy cập <strong>sv.crs-system.edu.vn</strong> để xem chi tiết lịch học...</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="col-md-4">
                        <div className="card shadow-lg border-0 rounded-4">
                            <div className="card-body p-4">
                                <h4 className="text-center fw-bold mb-4">ĐĂNG NHẬP</h4>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="small fw-bold text-muted">EMAIL / MSSV</label>
                                        <input type="email" className="form-control" placeholder="username@crs-system.edu.vn" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="small fw-bold text-muted">MẬT KHẨU</label>
                                        <input type="password" className="form-control" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                    </div>
                                    <div className="row g-2 mb-4">
                                        <div className="col-7">
                                            <input type="text" className="form-control" placeholder="Mã bảo vệ" value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} required />
                                        </div>
                                        <div className="col-5 d-flex align-items-center bg-light border rounded justify-content-center">
                                            <span className="fw-bold text-muted" style={{letterSpacing: '3px', textDecoration: 'line-through'}}>{generatedCaptcha}</span>
                                            <i className="bi bi-arrow-clockwise ms-2 text-primary cursor-pointer" onClick={generateCaptcha}></i>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100 fw-bold py-2 shadow">VÀO HỆ THỐNG</button>
                                    <div className="text-center mt-3 small">
                                        <Link to="/register" className="text-decoration-none">Tạo tài khoản sinh viên mới</Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="mt-4 text-center">
                            <div className="p-3 border rounded bg-white shadow-sm">
                                <p className="small text-muted mb-0">Tải App Mobile: <strong>app.crs-system.edu.vn</strong></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Auth;