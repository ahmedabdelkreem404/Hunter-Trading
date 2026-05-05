-- Hunter Trading production-readiness migration
-- Run manually on existing databases before deploying the updated code.

DELIMITER $$

CREATE PROCEDURE hunter_add_column_if_missing(
    IN p_table_name VARCHAR(64),
    IN p_column_name VARCHAR(64),
    IN p_column_definition TEXT
)
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = p_table_name
          AND COLUMN_NAME = p_column_name
    ) THEN
        SET @hunter_sql = CONCAT('ALTER TABLE `', p_table_name, '` ADD COLUMN `', p_column_name, '` ', p_column_definition);
        PREPARE hunter_stmt FROM @hunter_sql;
        EXECUTE hunter_stmt;
        DEALLOCATE PREPARE hunter_stmt;
    END IF;
END$$

DELIMITER ;

CALL hunter_add_column_if_missing('services', 'cover_media_type', "ENUM('image','video','embed') DEFAULT 'image'");
CALL hunter_add_column_if_missing('services', 'cover_video_poster_url', 'VARCHAR(500) NULL');
CALL hunter_add_column_if_missing('services', 'card_media_type', "ENUM('image','video','embed') DEFAULT 'image'");
CALL hunter_add_column_if_missing('services', 'card_media_url', 'VARCHAR(500) NULL');
CALL hunter_add_column_if_missing('services', 'card_video_poster_url', 'VARCHAR(500) NULL');
CALL hunter_add_column_if_missing('services', 'card_video_autoplay', 'TINYINT(1) DEFAULT 0');
CALL hunter_add_column_if_missing('services', 'card_video_muted', 'TINYINT(1) DEFAULT 1');
CALL hunter_add_column_if_missing('services', 'card_video_loop', 'TINYINT(1) DEFAULT 1');
CALL hunter_add_column_if_missing('services', 'cta_action', "ENUM('checkout','details','external','referral','whatsapp','telegram') DEFAULT 'checkout'");
CALL hunter_add_column_if_missing('services', 'referral_url', 'VARCHAR(500) NULL');
CALL hunter_add_column_if_missing('services', 'broker_name', 'VARCHAR(150) NULL');
CALL hunter_add_column_if_missing('services', 'broker_url', 'VARCHAR(500) NULL');
CALL hunter_add_column_if_missing('services', 'terms_title_en', 'VARCHAR(255) NULL');
CALL hunter_add_column_if_missing('services', 'terms_title_ar', 'VARCHAR(255) NULL');
CALL hunter_add_column_if_missing('services', 'terms_content_en', 'LONGTEXT NULL');
CALL hunter_add_column_if_missing('services', 'terms_content_ar', 'LONGTEXT NULL');
CALL hunter_add_column_if_missing('services', 'risk_warning_en', 'TEXT NULL');
CALL hunter_add_column_if_missing('services', 'risk_warning_ar', 'TEXT NULL');
CALL hunter_add_column_if_missing('services', 'important_links_json', 'LONGTEXT NULL');
CALL hunter_add_column_if_missing('services', 'details_button_label_en', 'VARCHAR(100) NULL');
CALL hunter_add_column_if_missing('services', 'details_button_label_ar', 'VARCHAR(100) NULL');
CALL hunter_add_column_if_missing('services', 'final_cta_label_en', 'VARCHAR(100) NULL');
CALL hunter_add_column_if_missing('services', 'final_cta_label_ar', 'VARCHAR(100) NULL');

CALL hunter_add_column_if_missing('leads', 'telegram_joined', 'TINYINT(1) DEFAULT 0');

CALL hunter_add_column_if_missing('analytics', 'event_type', 'VARCHAR(100) NULL');
CALL hunter_add_column_if_missing('analytics', 'ip_address', 'VARCHAR(45) NULL');
CALL hunter_add_column_if_missing('analytics', 'user_agent', 'TEXT NULL');

SET @hunter_has_event_name = (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'analytics'
      AND COLUMN_NAME = 'event_name'
);
SET @hunter_copy_event_sql = IF(
    @hunter_has_event_name > 0,
    'UPDATE analytics SET event_type = event_name WHERE event_type IS NULL',
    'SELECT 1'
);
PREPARE hunter_copy_event_stmt FROM @hunter_copy_event_sql;
EXECUTE hunter_copy_event_stmt;
DEALLOCATE PREPARE hunter_copy_event_stmt;

UPDATE analytics
SET event_type = 'unknown'
WHERE event_type IS NULL OR event_type = '';

ALTER TABLE analytics MODIFY event_type VARCHAR(100) NOT NULL;

UPDATE users
SET email = 'admin@huntertrading.com',
    password_hash = '$2y$10$rmcmz0oV0g5uA4961/JMtOYtJTQ93NGnBbr7jXyxG0EbWZgda6Nc6'
WHERE role = 'admin'
ORDER BY id ASC
LIMIT 1;

DROP PROCEDURE hunter_add_column_if_missing;
