import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthProvider';

const Navbar = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    if (!isAuthenticated) return null;

    return (
        <nav className="navbar navbar-expand-lg shadow-sm py-2 sticky-top" 
             style={{backgroundColor: theme === 'dark' ? '#212529' : '#0d6efd'}}>
            <div className="container">
                <Link className="navbar-brand fw-bold text-white" to="/dashboard">
                    <i className="bi bi-cpu-fill me-2"></i>CRS SYSTEM
                </Link>
                
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item"><Link className="nav-link text-white" to="/dashboard">Dashboard</Link></li>
                        <li className="nav-item"><Link className="nav-link text-white" to="/courses">Đăng ký môn</Link></li>
                        <li className="nav-item"><Link className="nav-link text-white" to="/timetable">Lịch học</Link></li>
                    </ul>
                    
                    <div className="d-flex align-items-center">
                        {/* NÚT ĐỔI GIAO DIỆN SÁNG/TỐI RÕ RÀNG */}
                        <button 
                            className={`btn ${theme === 'dark' ? 'btn-outline-warning' : 'btn-outline-light'} me-3 rounded-pill px-3 btn-sm`}
                            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                        >
                            {theme === 'light' ? (
                                <><i className="bi bi-moon-stars-fill me-1"></i> Chế độ tối</>
                            ) : (
                                <><i className="bi bi-sun-fill me-1"></i> Chế độ sáng</>
                            )}
                        </button>

                        <img src={user?.avatar_url} alt="avt" className="rounded-circle me-2 border border-2 border-white" style={{width:'35px', height:'35px', objectFit:'cover'}} />
                        <button className="btn btn-light btn-sm fw-bold rounded-pill px-3" onClick={logout}>Đăng xuất</button>
                    </div>
                </div>
            </div>
        </nav>
    );
};
export default Navbar;