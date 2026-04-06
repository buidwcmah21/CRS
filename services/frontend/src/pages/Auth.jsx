import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthProvider';

const Auth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { handleLogIn } = useAuth(); // Lấy đúng tên hàm handleLogIn từ AuthProvider

    const handleSubmit = (e) => {
        e.preventDefault();
        // Truyền dữ liệu vào hàm handleLogIn như AuthProvider yêu cầu
        handleLogIn({ email, password });
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 bg-light p-5 rounded shadow">
                    <h1 className="display-6 fw-bold mb-4 text-center">Central Authentication Service</h1>
                    <h4 className="mb-4 text-center">Enter your Email and Password</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Email address</label>
                            <input 
                                type="email" 
                                className="form-control form-control-lg" 
                                placeholder="Enter your email"
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label">Password</label>
                            <input 
                                type="password" 
                                className="form-control form-control-lg" 
                                placeholder="Enter your password"
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg w-100 mb-3">Login</button>
                        
                        <div className="text-center mt-3">
                            <p className="mb-1">Don't have an account?</p>
                            <Link to="/register" className="fw-bold text-decoration-none">
                                Register a new student account
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Auth;