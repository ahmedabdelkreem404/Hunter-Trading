INSERT INTO site_settings (setting_key, setting_value, setting_type, category, description)
VALUES ('default_language', 'ar', 'select', 'general', 'Default public website language: ar or en')
ON DUPLICATE KEY UPDATE
    setting_value = COALESCE(NULLIF(setting_value, ''), VALUES(setting_value)),
    setting_type = VALUES(setting_type),
    category = VALUES(category),
    description = VALUES(description);
