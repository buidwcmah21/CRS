DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TYPE user_role AS ENUM ('STUDENT', 'ACADEMIC_OFFICE', 'ADMIN');
CREATE TYPE day_of_week_enum AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');
CREATE TYPE status_enum AS ENUM ('SUCCESS', 'PENDING', 'FAILED');
CREATE TYPE level_enum AS ENUM ('Undergraduate', 'Graduate');
CREATE TYPE semester_enum AS ENUM ('HK1', 'HK2', 'HK3');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(50) NOT NULL,
    role user_role NOT NULL,
    avatar_url TEXT DEFAULT 'https://ui-avatars.com/api/?name=User&background=random',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    course_code VARCHAR(10) NOT NULL,
    course_name VARCHAR(100) NOT NULL,
    group_code VARCHAR(10) NOT NULL,
    semester semester_enum NOT NULL DEFAULT 'HK1',
    academic_year VARCHAR(10) NOT NULL DEFAULT '2023-2024',
    capacity INTEGER NOT NULL,
    lecturer_name VARCHAR(50) NOT NULL,
    day_of_week day_of_week_enum NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    level level_enum NOT NULL,
    UNIQUE (course_code, group_code, semester, academic_year)
);

CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    status status_enum NOT NULL DEFAULT 'SUCCESS',
    enrollment_date TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (student_id, course_id)
);

-- Tài khoản mẫu (Pass: 123456)
INSERT INTO users (email, password_hash, full_name, role, avatar_url) VALUES
('admin@gmail.com', '$2a$10$ByI76z5kv59dJpS.p.p.p.p.p.p.p.p.p.p.p.p.p.p.p.p.p.p.', 'Quản trị viên', 'ADMIN', 'https://ui-avatars.com/api/?name=Admin&background=0D6EFD&color=fff'),
('student@gmail.com', '$2a$10$ByI76z5kv59dJpS.p.p.p.p.p.p.p.p.p.p.p.p.p.p.p.p.p.p.', 'Bùi Đức Mạnh', 'STUDENT', 'https://ui-avatars.com/api/?name=Bui+Duc+Manh&background=random');

-- Danh sách môn IT chuẩn
INSERT INTO courses (course_code, course_name, group_code, capacity, lecturer_name, day_of_week, start_time, end_time, level) VALUES
('IT001', 'Trí tuệ nhân tạo (AI)', 'L01', 30, 'TS. Nguyễn Máy Tính', 'MONDAY', '07:30:00', '10:30:00', 'Undergraduate'),
('IT002', 'An toàn thông tin', 'L02', 25, 'ThS. Bảo Mật', 'TUESDAY', '13:00:00', '16:00:00', 'Undergraduate'),
('IT003', 'Lập trình Di động', 'L01', 40, 'ThS. Android', 'WEDNESDAY', '08:00:00', '11:00:00', 'Undergraduate'),
('IT004', 'Mạng máy tính', 'L03', 50, 'TS. Cisco', 'THURSDAY', '14:00:00', '17:00:00', 'Undergraduate'),
('IT005', 'Điện toán đám mây', 'L01', 35, 'TS. Azure', 'FRIDAY', '07:00:00', '10:00:00', 'Undergraduate');