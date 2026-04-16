import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Enrollments from './pages/Enrollments';
import Timetable from './pages/Timetable';
import { useAuth } from './AuthProvider';

const AppRoutes = () => {
    const { isAuthenticated, isAuthReady, user } = useAuth();

    if (!isAuthReady) return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-primary" role="status"></div>
        </div>
    );

    return (
        <Routes>
            {/* Điều hướng trang chủ */}
            <Route path="/" element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
            } />

            {/* Public Routes */}
            <Route path="/login" element={!isAuthenticated ? <Auth /> : <Navigate to="/dashboard" replace />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" replace />} />

            {/* Private Routes - Dùng chung cho Dashboard nhưng nội dung bên trong Dashboard sẽ tự phân quyền */}
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
            
            {/* Routes dành riêng cho Sinh viên */}
            <Route path="/courses" element={isAuthenticated && user?.role === 'STUDENT' ? <Courses /> : <Navigate to="/dashboard" replace />} />
            <Route path="/enrollments" element={isAuthenticated && user?.role === 'STUDENT' ? <Enrollments /> : <Navigate to="/dashboard" replace />} />
            <Route path="/timetable" element={isAuthenticated && user?.role === 'STUDENT' ? <Timetable /> : <Navigate to="/dashboard" replace />} />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;