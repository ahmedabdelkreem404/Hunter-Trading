-- Video playback controls for service cards/details.
-- Run after 2026_05_12_expand_media_url_columns.sql on existing databases.

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

CALL hunter_add_column_if_missing('services', 'cover_video_autoplay', 'TINYINT(1) DEFAULT 1');
CALL hunter_add_column_if_missing('services', 'cover_video_muted', 'TINYINT(1) DEFAULT 1');
CALL hunter_add_column_if_missing('services', 'cover_video_loop', 'TINYINT(1) DEFAULT 1');
CALL hunter_add_column_if_missing('services', 'cover_video_controls', 'TINYINT(1) DEFAULT 0');
CALL hunter_add_column_if_missing('services', 'card_video_controls', 'TINYINT(1) DEFAULT 0');

ALTER TABLE services
    MODIFY card_video_autoplay TINYINT(1) DEFAULT 1,
    MODIFY card_video_muted TINYINT(1) DEFAULT 1,
    MODIFY card_video_loop TINYINT(1) DEFAULT 1;

UPDATE services
SET card_video_autoplay = 1,
    card_video_muted = 1,
    card_video_loop = 1,
    cover_video_autoplay = 1,
    cover_video_muted = 1,
    cover_video_loop = 1
WHERE card_media_type IN ('video', 'embed')
   OR cover_media_type IN ('video', 'embed')
   OR card_media_url REGEXP '\\.(mp4|webm|mov|m4v)(\\?|#|$)'
   OR cover_url REGEXP '\\.(mp4|webm|mov|m4v)(\\?|#|$)';

DROP PROCEDURE hunter_add_column_if_missing;
