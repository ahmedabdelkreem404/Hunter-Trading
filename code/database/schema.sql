CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(150) NOT NULL UNIQUE,
    setting_value LONGTEXT NULL,
    setting_type VARCHAR(50) DEFAULT 'text',
    category VARCHAR(50) DEFAULT 'general',
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS media (
    id INT PRIMARY KEY AUTO_INCREMENT,
    filename VARCHAR(255) NOT NULL,
    filepath VARCHAR(500) NOT NULL UNIQUE,
    mimetype VARCHAR(100) NULL,
    size_bytes BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS coach_profile (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name_en VARCHAR(255) NULL,
    name_ar VARCHAR(255) NULL,
    title_en VARCHAR(255) NULL,
    title_ar VARCHAR(255) NULL,
    bio_en LONGTEXT NULL,
    bio_ar LONGTEXT NULL,
    image_url VARCHAR(500) NULL,
    experience_years INT DEFAULT 0,
    students_count INT DEFAULT 0,
    profit_shared VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS coach_social_links (
    id INT PRIMARY KEY AUTO_INCREMENT,
    platform VARCHAR(50) NOT NULL,
    label VARCHAR(100) NOT NULL,
    url VARCHAR(500) NOT NULL,
    sort_order INT DEFAULT 0,
    is_enabled TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS section_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    section_key VARCHAR(100) NOT NULL UNIQUE,
    title_en VARCHAR(255) NULL,
    title_ar VARCHAR(255) NULL,
    subtitle_en TEXT NULL,
    subtitle_ar TEXT NULL,
    body_en LONGTEXT NULL,
    body_ar LONGTEXT NULL,
    cta_label_en VARCHAR(100) NULL,
    cta_label_ar VARCHAR(100) NULL,
    cta_url VARCHAR(1000) NULL,
    secondary_cta_label_en VARCHAR(100) NULL,
    secondary_cta_label_ar VARCHAR(100) NULL,
    secondary_cta_url VARCHAR(500) NULL,
    image_url VARCHAR(500) NULL,
    stats_json LONGTEXT NULL,
    settings_json LONGTEXT NULL,
    is_visible TINYINT(1) DEFAULT 1,
    sort_order INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(50) NOT NULL,
    slug VARCHAR(191) NOT NULL UNIQUE,
    title_en VARCHAR(255) NOT NULL,
    title_ar VARCHAR(255) NOT NULL,
    subtitle_en VARCHAR(255) NULL,
    subtitle_ar VARCHAR(255) NULL,
    short_description_en TEXT NULL,
    short_description_ar TEXT NULL,
    full_description_en LONGTEXT NULL,
    full_description_ar LONGTEXT NULL,
    price DECIMAL(10,2) DEFAULT 0,
    compare_price DECIMAL(10,2) DEFAULT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    cta_label_en VARCHAR(100) DEFAULT 'Buy Now',
    cta_label_ar VARCHAR(100) DEFAULT 'اشتر الآن',
    cta_url VARCHAR(500) NULL,
    badge_text_en VARCHAR(100) NULL,
    badge_text_ar VARCHAR(100) NULL,
    thumbnail_url VARCHAR(1000) NULL,
    cover_url VARCHAR(1000) NULL,
    cover_media_type ENUM('image','video','embed') DEFAULT 'image',
    cover_video_poster_url VARCHAR(1000) NULL,
    cover_video_autoplay TINYINT(1) DEFAULT 1,
    cover_video_muted TINYINT(1) DEFAULT 1,
    cover_video_loop TINYINT(1) DEFAULT 1,
    cover_video_controls TINYINT(1) DEFAULT 0,
    card_media_type ENUM('image','video','embed') DEFAULT 'image',
    card_media_url VARCHAR(1000) NULL,
    card_video_poster_url VARCHAR(1000) NULL,
    card_video_autoplay TINYINT(1) DEFAULT 1,
    card_video_muted TINYINT(1) DEFAULT 1,
    card_video_loop TINYINT(1) DEFAULT 1,
    card_video_controls TINYINT(1) DEFAULT 0,
    offer_starts_at DATETIME NULL,
    offer_ends_at DATETIME NULL,
    cta_action ENUM('checkout','details','external','referral','whatsapp','telegram') DEFAULT 'checkout',
    referral_url VARCHAR(1000) NULL,
    broker_name VARCHAR(150) NULL,
    broker_url VARCHAR(1000) NULL,
    terms_title_en VARCHAR(255) NULL,
    terms_title_ar VARCHAR(255) NULL,
    terms_content_en LONGTEXT NULL,
    terms_content_ar LONGTEXT NULL,
    risk_warning_en TEXT NULL,
    risk_warning_ar TEXT NULL,
    important_links_json LONGTEXT NULL,
    details_button_label_en VARCHAR(100) NULL,
    details_button_label_ar VARCHAR(100) NULL,
    final_cta_label_en VARCHAR(100) NULL,
    final_cta_label_ar VARCHAR(100) NULL,
    is_featured TINYINT(1) DEFAULT 0,
    is_visible TINYINT(1) DEFAULT 1,
    sort_order INT DEFAULT 0,
    metadata_json LONGTEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS service_features (
    id INT PRIMARY KEY AUTO_INCREMENT,
    service_id INT NOT NULL,
    label_en VARCHAR(255) NOT NULL,
    label_ar VARCHAR(255) NULL,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS service_steps (
    id INT PRIMARY KEY AUTO_INCREMENT,
    service_id INT NOT NULL,
    title_en VARCHAR(255) NULL,
    title_ar VARCHAR(255) NULL,
    description_en TEXT NULL,
    description_ar TEXT NULL,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS service_faqs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    service_id INT NOT NULL,
    question_en VARCHAR(255) NOT NULL,
    question_ar VARCHAR(255) NULL,
    answer_en TEXT NULL,
    answer_ar TEXT NULL,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS service_media (
    id INT PRIMARY KEY AUTO_INCREMENT,
    service_id INT NOT NULL,
    media_url VARCHAR(1000) NOT NULL,
    media_type VARCHAR(50) DEFAULT 'image',
    alt_text_en VARCHAR(255) NULL,
    alt_text_ar VARCHAR(255) NULL,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS testimonials (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NULL,
    image_url VARCHAR(500) NULL,
    video_url VARCHAR(500) NULL,
    content_en LONGTEXT NOT NULL,
    content_ar LONGTEXT NULL,
    rating INT DEFAULT 5,
    service_type VARCHAR(50) NULL,
    service_id INT NULL,
    is_featured TINYINT(1) DEFAULT 0,
    is_approved TINYINT(1) DEFAULT 1,
    is_visible TINYINT(1) DEFAULT 1,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS market_updates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title_en VARCHAR(255) NOT NULL,
    title_ar VARCHAR(255) NULL,
    summary_en TEXT NULL,
    summary_ar TEXT NULL,
    content_en LONGTEXT NULL,
    content_ar LONGTEXT NULL,
    category VARCHAR(100) DEFAULT 'analysis',
    image_url VARCHAR(500) NULL,
    author_name VARCHAR(150) NULL,
    tags_json TEXT NULL,
    is_pinned TINYINT(1) DEFAULT 0,
    is_featured TINYINT(1) DEFAULT 0,
    is_visible TINYINT(1) DEFAULT 1,
    sort_order INT DEFAULT 0,
    published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payment_orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    service_id INT NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NULL,
    payment_method VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) DEFAULT 0,
    screenshot_url VARCHAR(500) NULL,
    status VARCHAR(30) DEFAULT 'pending',
    redirect_url VARCHAR(500) NULL,
    admin_note TEXT NULL,
    verified_at DATETIME NULL,
    verified_by VARCHAR(150) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS leads (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NULL,
    source VARCHAR(100) NULL,
    message TEXT NULL,
    telegram_joined TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS analytics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_type VARCHAR(100) NOT NULL,
    event_data LONGTEXT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO users (username, email, password_hash, role)
VALUES ('admin', 'admin@huntertrading.com', '$2y$10$rmcmz0oV0g5uA4961/JMtOYtJTQ93NGnBbr7jXyxG0EbWZgda6Nc6', 'admin');

INSERT IGNORE INTO site_settings (setting_key, setting_value, setting_type, category, description)
VALUES ('default_language', 'ar', 'select', 'general', 'Default public website language: ar or en');
