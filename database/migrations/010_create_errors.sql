CREATE TABLE IF NOT EXISTS errors (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    technology VARCHAR(100) NOT NULL,
    error_message MEDIUMTEXT NOT NULL,
    cause TEXT,
    solution TEXT NOT NULL,
    code_before MEDIUMTEXT,
    code_after MEDIUMTEXT,
    is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_errors_user_tech (user_id, technology)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;