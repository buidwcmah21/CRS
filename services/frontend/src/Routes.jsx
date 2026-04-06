import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Enrollments from './pages/Enrollments';
import Course from './pages/Course'; // Đã sửa tên từ CourseDetail thành Course cho khớp
import { useAuth } from './AuthProvider';

const AppRoutes = () => {
    const { isAuthenticated, isAuthReady } = useAuth(); // Lấy isAuthenticated từ AuthProvider

    // Đợi cho đến khi AuthProvider kiểm tra xong localStorage
    if (!isAuthReady) {
        return <div className="d-flex justify-content-center mt-5">Loading...</div>;
    }

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={!isAuthenticated ? <Auth /> : <Navigate replace to="/dashboard" />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate replace to="/dashboard" />} />

            {/* Private Routes - Chỉ cho vào nếu isAuthenticated là true */}
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate replace to="/login" />} />
            <Route path="/courses" element={isAuthenticated ? <Courses /> : <Navigate replace to="/login" />} />
            <Route path="/courses/:id" element={isAuthenticated ? <Course /> : <Navigate replace to="/login" />} />
            <Route path="/enrollments" element={isAuthenticated ? <Enrollments /> : <Navigate replace to="/login" />} />

            {/* Default Route */}
            <Route path="/" element={<Navigate replace to="/dashboard" />} />
        </Routes>
    );
};

export default AppRoutes;