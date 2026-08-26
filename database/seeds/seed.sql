-- ===================================================
-- MyOS – Database Seed Script (Development Data)
-- ===================================================

USE myos_db;

-- 1. Users (Password: Password123@ hash)
INSERT IGNORE INTO users (id, name, email, password_hash, avatar_url) VALUES 
('11111111-1111-1111-1111-111111111111', 'Quang Duong (Demo)', 'demo@example.com', '$2b$10$iI8g.pY.w8cSm9tA2u8w/eNkW77oO2kU9I54Lcq1H8Nn2g5Xm9eY2', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'),
('22222222-2222-2222-2222-222222222222', 'Test User (Data Isolation)', 'test@example.com', '$2b$10$iI8g.pY.w8cSm9tA2u8w/eNkW77oO2kU9I54Lcq1H8Nn2g5Xm9eY2', NULL);

-- 2. Semesters
INSERT IGNORE INTO semesters (id, user_id, name, academic_year, start_date, end_date, is_current) VALUES
('sem-101', '11111111-1111-1111-1111-111111111111', 'Hoc ky 1 (2025-2026)', '2025-2026', '2025-09-01', '2026-01-15', FALSE),
('sem-102', '11111111-1111-1111-1111-111111111111', 'Hoc ky 2 (2025-2026)', '2025-2026', '2026-02-01', '2026-06-30', TRUE),
('sem-201', '22222222-2222-2222-2222-222222222222', 'Semester Fall 2025', '2025-2026', '2025-09-01', '2026-01-15', TRUE);

-- 3. Subjects
INSERT IGNORE INTO subjects (id, user_id, semester_id, code, name, credits, target_grade) VALUES
('sub-101', '11111111-1111-1111-1111-111111111111', 'sem-101', 'IT001', 'Nhap mon Lap trinh', 4, 9.00),
('sub-102', '11111111-1111-1111-1111-111111111111', 'sem-101', 'MA001', 'Giai tich 1', 3, 8.50),
('sub-103', '11111111-1111-1111-1111-111111111111', 'sem-102', 'IT002', 'Cau truc Du lieu & Giai thuat', 4, 9.50),
('sub-104', '11111111-1111-1111-1111-111111111111', 'sem-102', 'IT003', 'Co so Du lieu (MySQL)', 4, 9.00),
('sub-201', '22222222-2222-2222-2222-222222222222', 'sem-201', 'CS101', 'Computer Systems', 3, 8.00);

-- 4. Grades
INSERT IGNORE INTO grades (id, user_id, subject_id, component_name, weight, score, grade_point) VALUES
('grd-101', '11111111-1111-1111-1111-111111111111', 'sub-101', 'Qua trinh', 30.00, 9.00, 3.80),
('grd-102', '11111111-1111-1111-1111-111111111111', 'sub-101', 'Cuoi ky', 70.00, 9.50, 4.00),
('grd-103', '11111111-1111-1111-1111-111111111111', 'sub-102', 'Giua ky', 40.00, 8.00, 3.50),
('grd-104', '11111111-1111-1111-1111-111111111111', 'sub-102', 'Cuoi ky', 60.00, 8.50, 3.70),
('grd-105', '11111111-1111-1111-1111-111111111111', 'sub-103', 'Thuc hanh Lab', 40.00, 10.00, 4.00),
('grd-201', '22222222-2222-2222-2222-222222222222', 'sub-201', 'Midterm', 50.00, 7.50, 3.00);

-- 5. Tasks
INSERT IGNORE INTO tasks (id, user_id, title, description, priority, status, due_date, completed_at) VALUES
('tsk-101', '11111111-1111-1111-1111-111111111111', 'On tap Thuat toan Tree & Graph', 'Giai 10 bai LeetCode ve BFS/DFS', 'HIGH', 'TODO', '2026-08-30 23:59:59', NULL),
('tsk-102', '11111111-1111-1111-1111-111111111111', 'Hoan thanh Assignment MySQL 8.x', 'Viet script migration va seed database', 'URGENT', 'IN_PROGRESS', '2026-08-28 18:00:00', NULL),
('tsk-103', '11111111-1111-1111-1111-111111111111', 'Thiet ke Wireframe Dashboard MyOS', 'Ve layout Desktop-first tren Figma', 'MEDIUM', 'COMPLETED', '2026-08-25 12:00:00', '2026-08-25 11:30:00'),
('tsk-104', '11111111-1111-1111-1111-111111111111', 'Dang ky khoa hoc IELTS Online', 'Hoan thanh truoc khi het han discount', 'LOW', 'CANCELLED', '2026-08-20 00:00:00', NULL),
('tsk-201', '22222222-2222-2222-2222-222222222222', 'Test User Isolation Task', 'Du lieu nay chi thuoc User 2', 'MEDIUM', 'TODO', '2026-09-01 10:00:00', NULL);

-- 6. Events
INSERT IGNORE INTO events (id, user_id, title, description, start_at, end_at, location) VALUES
('evt-101', '11111111-1111-1111-1111-111111111111', 'Tiet hoc Co so Du lieu', 'Phong C201 - Giang duong A', '2026-08-28 07:30:00', '2026-08-28 11:30:00', 'Dai hoc CNTT'),
('evt-102', '11111111-1111-1111-1111-111111111111', 'Deadline Nop bao cao Web Full-Stack', 'Nop tren he thong LMS', '2026-08-31 23:59:00', '2026-08-31 23:59:59', 'Online'),
('evt-201', '22222222-2222-2222-2222-222222222222', 'Test User Meeting', 'Team Sync Meeting', '2026-08-29 14:00:00', '2026-08-29 15:00:00', 'Google Meet');

-- 7. Study Sessions
INSERT IGNORE INTO study_sessions (id, user_id, subject_id, start_time, end_time, duration_minutes, notes) VALUES
('ses-101', '11111111-1111-1111-1111-111111111111', 'sub-104', '2026-08-26 19:00:00', '2026-08-26 21:00:00', 120, 'Hoc ve Index B-Tree va Explain Plan'),
('ses-102', '11111111-1111-1111-1111-111111111111', 'sub-103', '2026-08-27 08:00:00', '2026-08-27 10:30:00', 150, 'Code bai tap Cay AVL bang C++'),
('ses-201', '22222222-2222-2222-2222-222222222222', 'sub-201', '2026-08-26 14:00:00', '2026-08-26 15:00:00', 60, 'Reading Operating System Chapter 3');

-- 8. Notes
INSERT IGNORE INTO notes (id, user_id, title, content, is_favorite, is_archived) VALUES
('not-101', '11111111-1111-1111-1111-111111111111', 'Kien truc Phan tang Backend REST API', 'Luon tuan thu flow: Route -> Controller -> Service -> Repository -> MySQL. Controller khong chua SQL.', TRUE, FALSE),
('not-102', '11111111-1111-1111-1111-111111111111', 'Tong ket Kien thuc MySQL Indexing', 'Index don vs Composite index (Leftmost Prefix Rule). Tranh index tren cot co do chon loc (cardinality) thap.', TRUE, FALSE),
('not-103', '11111111-1111-1111-1111-111111111111', 'Ke hoach cu nam 2025', 'Noi dung ghi chu luu tru khong con su dung.', FALSE, TRUE),
('not-201', '22222222-2222-2222-2222-222222222222', 'Test Note for User 2', 'User 1 cannot see this confidential note.', FALSE, FALSE);

-- 9. Snippets
INSERT IGNORE INTO snippets (id, user_id, title, language, code, description, category, is_favorite) VALUES
('snp-101', '11111111-1111-1111-1111-111111111111', 'MySQL2 Promise Connection Pool', 'TypeScript', 'import mysql from "mysql2/promise";\nexport const pool = mysql.createPool({\n  host: process.env.DB_HOST,\n  user: process.env.DB_USER,\n  password: process.env.DB_PASSWORD,\n  database: process.env.DB_NAME\n});', 'Boilerplate ket noi MySQL2 dung Connection Pool', 'Backend', TRUE),
('snp-102', '11111111-1111-1111-1111-111111111111', 'Custom Axios Instance with JWT Interceptor', 'TypeScript', 'import axios from "axios";\nconst api = axios.create({ baseURL: "/api" });\napi.interceptors.request.use((config) => {\n  const token = localStorage.getItem("token");\n  if (token) config.headers.Authorization = "Bearer " + token;\n  return config;\n});', 'Tu dong gan Token Bearer vao Header Request', 'Frontend', TRUE),
('snp-201', '22222222-2222-2222-2222-222222222222', 'Hello World Script', 'JavaScript', 'console.log("Hello User 2");', 'Simple logging script', 'General', FALSE);

-- 10. Errors (Error Notebook)
INSERT IGNORE INTO errors (id, user_id, title, technology, error_message, cause, solution, code_before, code_after, is_favorite) VALUES
('err-101', '11111111-1111-1111-1111-111111111111', 'MySQL Access Denied for User Root', 'MySQL / Node.js', 'ER_ACCESS_DENIED_ERROR: Access denied for user root@localhost (using password: YES)', 'Mat khau co chua ky tu # khien dotenv parse nham thanh comment', 'Boc mat khau trong dau ngoac kep "" tai file .env', 'DB_PASSWORD=24122005Quang#', 'DB_PASSWORD="24122005Quang#"', TRUE),
('err-102', '11111111-1111-1111-1111-111111111111', 'CORS Policy Blocked on Express API', 'Express.js', 'Access to XMLHttpRequest from origin localhost:5173 has been blocked by CORS policy', 'Chua khai bao middleware cors() tren Express app truoc cac Routes', 'Import cors va goi app.use(cors())', 'app.use("/api", routes);', 'app.use(cors());\napp.use("/api", routes);', TRUE),
('err-201', '22222222-2222-2222-2222-222222222222', 'Null Pointer in Java', 'Java', 'NullPointerException at Main.java:12', 'Object was null', 'Add null check', 'obj.run();', 'if (obj != null) obj.run();', FALSE);

-- 11. Bookmarks
INSERT IGNORE INTO bookmarks (id, user_id, title, url, description, category, is_favorite) VALUES
('bm-101', '11111111-1111-1111-1111-111111111111', 'React Official Docs', 'https://react.dev', 'Tai lieu chinh thuc cua React 18+', 'Frontend', TRUE),
('bm-102', '11111111-1111-1111-1111-111111111111', 'MySQL 8.0 Reference Manual', 'https://dev.mysql.com/doc/refman/8.0/en/', 'Tra cuu cu phap SQL, Index va Engine', 'Database', TRUE),
('bm-103', '11111111-1111-1111-1111-111111111111', 'Tailwind CSS Docs', 'https://tailwindcss.com/docs', 'Bang tra cuu Utility-first CSS classes', 'Frontend', FALSE),
('bm-201', '22222222-2222-2222-2222-222222222222', 'GitHub', 'https://github.com', 'Hosting git repos', 'Tools', FALSE);

-- 12. Budgets
INSERT IGNORE INTO budgets (id, user_id, category, amount, start_date, end_date) VALUES
('bdg-101', '11111111-1111-1111-1111-111111111111', 'Food', 3000000.00, '2026-08-01', '2026-08-31'),
('bdg-102', '11111111-1111-1111-1111-111111111111', 'Education', 1500000.00, '2026-08-01', '2026-08-31'),
('bdg-103', '11111111-1111-1111-1111-111111111111', 'Transport', 500000.00, '2026-08-01', '2026-08-31'),
('bdg-201', '22222222-2222-2222-2222-222222222222', 'Food', 2000000.00, '2026-08-01', '2026-08-31');

-- 13. Transactions
INSERT IGNORE INTO transactions (id, user_id, type, category, amount, description, transaction_date) VALUES
('tx-101', '11111111-1111-1111-1111-111111111111', 'INCOME', 'Salary', 10000000.00, 'Luong lam them Thang 8', '2026-08-05'),
('tx-102', '11111111-1111-1111-1111-111111111111', 'EXPENSE', 'Food', 85000.00, 'An trua cung ban', '2026-08-20'),
('tx-103', '11111111-1111-1111-1111-111111111111', 'EXPENSE', 'Education', 450000.00, 'Mua sach Giai thuat & Cau truc du lieu', '2026-08-22'),
('tx-104', '11111111-1111-1111-1111-111111111111', 'EXPENSE', 'Transport', 100000.00, 'Nap the xang xe may', '2026-08-24'),
('tx-201', '22222222-2222-2222-2222-222222222222', 'INCOME', 'Allowance', 3000000.00, 'Tien sinh hoat thang 8', '2026-08-01');

-- 14. Tags
INSERT IGNORE INTO tags (id, user_id, name) VALUES
('tag-101', '11111111-1111-1111-1111-111111111111', 'React'),
('tag-102', '11111111-1111-1111-1111-111111111111', 'Node.js'),
('tag-103', '11111111-1111-1111-1111-111111111111', 'MySQL'),
('tag-104', '11111111-1111-1111-1111-111111111111', 'University'),
('tag-105', '11111111-1111-1111-1111-111111111111', 'Important'),
('tag-106', '11111111-1111-1111-1111-111111111111', 'Finance'),
('tag-201', '22222222-2222-2222-2222-222222222222', 'React'),
('tag-202', '22222222-2222-2222-2222-222222222222', 'Personal');

-- 15. Pivot Relationships
INSERT IGNORE INTO task_tags (task_id, tag_id) VALUES
('tsk-101', 'tag-104'),
('tsk-101', 'tag-105'),
('tsk-102', 'tag-103'),
('tsk-102', 'tag-105'),
('tsk-201', 'tag-202');

INSERT IGNORE INTO note_tags (note_id, tag_id) VALUES
('not-101', 'tag-102'),
('not-101', 'tag-105'),
('not-102', 'tag-103'),
('not-201', 'tag-202');

INSERT IGNORE INTO snippet_tags (snippet_id, tag_id) VALUES
('snp-101', 'tag-102'),
('snp-101', 'tag-103'),
('snp-102', 'tag-101');

INSERT IGNORE INTO error_tags (error_id, tag_id) VALUES
('err-101', 'tag-103'),
('err-102', 'tag-102');

INSERT IGNORE INTO bookmark_tags (bookmark_id, tag_id) VALUES
('bm-101', 'tag-101'),
('bm-102', 'tag-103'),
('bm-103', 'tag-101');