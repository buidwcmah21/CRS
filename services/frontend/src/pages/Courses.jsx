import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import CourseComponent from '../components/CourseComponent';
import toast from 'react-hot-toast';

const Courses = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // SỬ DỤNG REACT QUERY: Dữ liệu sẽ được lưu lại, bấm quay lại trang là hiện ngay lập tức
    const { data: courses, isLoading } = useQuery({
        queryKey: ['courses', searchTerm],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/courses?search=${searchTerm}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return res.data;
        },
        staleTime: 1000 * 60 * 5, // Coi dữ liệu là "mới" trong 5 phút, không cần load lại
    });

    if (isLoading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="container mt-5">
            {/* Giao diện giữ nguyên như bản Nexus cũ của bạn */}
            {/* ... */}
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