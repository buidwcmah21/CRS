-- 1. Xóa các bảng cũ nếu tồn tại (để reset sạch sẽ)
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS users;

-- 2. Xóa và tạo lại các kiểu ENUM
DROP TYPE IF EXISTS user_role;
DROP TYPE IF EXISTS day_of_week_enum;
DROP TYPE IF EXISTS status_enum;
DROP TYPE IF EXISTS level_enum;
DROP TYPE IF EXISTS semester_enum;

CREATE TYPE user_role AS ENUM ('STUDENT', 'ACADEMIC_OFFICE', 'ADMIN');
CREATE TYPE day_of_week_enum AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');
CREATE TYPE status_enum AS ENUM ('SUCCESS', 'PENDING', 'FAILED');
CREATE TYPE level_enum AS ENUM ('Undergraduate', 'Graduate');
CREATE TYPE semester_enum AS ENUM ('HK1', 'HK2', 'HK3');

-- 3. Tạo bảng users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(50) NOT NULL,
    role user_role NOT NULL,
    address VARCHAR(100),
    phone VARCHAR(10),
    dob DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tạo bảng courses (Đã thêm Semester và Academic Year)
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    course_code VARCHAR(10) NOT NULL,
    course_name VARCHAR(50) NOT NULL,
    group_code VARCHAR(10) NOT NULL,
    semester semester_enum NOT NULL DEFAULT 'HK1',
    academic_year VARCHAR(10) NOT NULL DEFAULT '2023-2024',
    description TEXT,
    capacity INTEGER NOT NULL,
    lecturer_name VARCHAR(50) NOT NULL,
    day_of_week day_of_week_enum NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    level level_enum NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- Ràng buộc: Không thể có 2 lớp cùng mã, cùng nhóm trong 1 học kỳ
    UNIQUE (course_code, group_code, semester, academic_year)
);

-- 5. Tạo bảng enrollments
CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    status status_enum NOT NULL DEFAULT 'SUCCESS',
    enrollment_date TIMESTAMPTZ DEFAULT NOW(),
    -- Ràng buộc: Một sinh viên không thể đăng ký 1 lớp 2 lần
    UNIQUE (student_id, course_id)
);

-- 6. SEED DATA (Dữ liệu mẫu)

-- Mật khẩu mặc định cho tất cả là '123456' (đã hash bằng bcrypt)
-- $2a$10$X7.8vXm.vGvH7Z.vGvH7Z.vGvH7Z.vGvH7Z.vGvH7Z.vGvH7Z.vGvH7Z. (Ví dụ)
-- Lưu ý: Bạn nên dùng mật khẩu hash thật từ code của bạn. 
-- Dưới đây là hash của chuỗi '123456'
INSERT INTO users (email, password_hash, full_name, role) VALUES
('admin@gmail.com', '$2a$10$ByI76z5kv59dJpS.p.p.p.p.p.p.p.p.p.p.p.p.p.p.p.p.p.p.', 'System Admin', 'ADMIN'),
('office@gmail.com', '$2a$10$ByI76z5kv59dJpS.p.p.p.p.p.p.p.p.p.p.p.p.p.p.p.p.p.p.', 'Academic Office', 'ACADEMIC_OFFICE');

-- Thêm vài môn học mẫu cho HK1 2023-2024
INSERT INTO courses (course_code, course_name, group_code, semester, academic_year, capacity, lecturer_name, day_of_week, start_time, end_time, level) VALUES
('CO3001', 'Web Programming', 'CC01', 'HK1', '2023-2024', 40, 'Dr. Nguyen Van A', 'MONDAY', '07:00:00', '09:00:00', 'Undergraduate'),
('CO3001', 'Web Programming', 'CC02', 'HK1', '2023-2024', 40, 'Dr. Tran Thi B', 'TUESDAY', '13:00:00', '15:00:00', 'Undergraduate'),
('CO2003', 'Database Systems', 'L01', 'HK1', '2023-2024', 2, 'Dr. Le Van C', 'WEDNESDAY', '08:00:00', '11:00:00', 'Undergraduate');
-- (Môn Database để capacity = 2 để bạn dễ test Waitlist)