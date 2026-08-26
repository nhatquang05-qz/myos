-- Migration 016: Cho phép start_date và end_date trong bảng semesters có giá trị NULL
ALTER TABLE semesters
  MODIFY start_date DATE NULL,
  MODIFY end_date DATE NULL;
