-- Hunter Trading Database Schema
-- Run this SQL to set up the database

CREATE DATABASE IF NOT EXISTS hunter_tradeing CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hunter_tradeing;

-- Users table (admin/moderators)
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'moderator') DEFAULT 'moderator',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
-- Hash: $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
INSERT INTO users (email, password_hash, role) VALUES 
('admin@hunter_tradeing.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Home content (dynamic)
CREATE TABLE IF NOT EXISTS home_content (
    id INT PRIMARY KEY AUTO_INCREMENT,
    section VARCHAR(50) NOT NULL,
    field VARCHAR(100) NOT NULL,
    value TEXT,
    language ENUM('en', 'ar') DEFAULT 'en',
    UNIQUE KEY unique_content (section, field, language)
);

-- Courses
CREATE TABLE IF NOT EXISTS courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title_en VARCHAR(255) NOT NULL,
    title_ar VARCHAR(255) NOT NULL,
    description_en TEXT,
    description_ar TEXT,
    level ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
    image_url VARCHAR(500),
    price DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lessons
CREATE TABLE IF NOT EXISTS lessons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    title_ar VARCHAR(255) NOT NULL,
    description_en TEXT,
    description_ar TEXT,
    video_url VARCHAR(500),
    pdf_url VARCHAR(500),
    order_index INT DEFAULT 0,
    duration_minutes INT DEFAULT 0,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Course enrollments
CREATE TABLE IF NOT EXISTS course_enrollments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    user_email VARCHAR(255),
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Signals
CREATE TABLE IF NOT EXISTS signals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type ENUM('buy', 'sell') NOT NULL,
    pair VARCHAR(20) NOT NULL,
    entry_price DECIMAL(12,5) NOT NULL,
    take_profit DECIMAL(12,5) NOT NULL,
    stop_loss DECIMAL(12,5) NOT NULL,
    status ENUM('active', 'closed', 'profitable', 'loss') DEFAULT 'active',
    result_pips DECIMAL(10,3) DEFAULT NULL,
    closed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    image_url VARCHAR(500),
    video_url VARCHAR(500),
    content_en TEXT NOT NULL,
    content_ar TEXT,
    rating INT DEFAULT 5,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trading Results
CREATE TABLE IF NOT EXISTS results (
    id INT PRIMARY KEY AUTO_INCREMENT,
    image_url VARCHAR(500),
    description VARCHAR(500),
    profit_amount DECIMAL(15,2) DEFAULT 0,
    loss_amount DECIMAL(15,2) DEFAULT 0,
    win_rate DECIMAL(5,2) DEFAULT 0,
    total_trades INT DEFAULT 0,
    profitable_trades INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leads
CREATE TABLE IF NOT EXISTS leads (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    source VARCHAR(50) DEFAULT 'website',
    telegram_joined BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog posts
CREATE TABLE IF NOT EXISTS blog_posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title_en VARCHAR(255) NOT NULL,
    title_ar VARCHAR(255),
    content_en TEXT,
    content_ar TEXT,
    excerpt_en VARCHAR(500),
    excerpt_ar VARCHAR(500),
    image_url VARCHAR(500),
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100),
    read_time_minutes INT DEFAULT 5,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics
CREATE TABLE IF NOT EXISTS analytics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_type VARCHAR(50) NOT NULL,
    event_data JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_event_type (event_type),
    INDEX idx_created_at (created_at)
);

-- Affiliate tracking
CREATE TABLE IF NOT EXISTS affiliate_clicks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    broker_id VARCHAR(50) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_broker (broker_id),
    INDEX idx_created_at (created_at)
);

-- Site Settings (links, social media, etc.)
CREATE TABLE IF NOT EXISTS site_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('text', 'url', 'image', 'number') DEFAULT 'text',
    category VARCHAR(50) DEFAULT 'general',
    description VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Coach Profile
CREATE TABLE IF NOT EXISTS coach_profile (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name_en VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    title_ar VARCHAR(255),
    bio_en TEXT,
    bio_ar TEXT,
    image_url VARCHAR(500),
    experience_years INT DEFAULT 0,
    students_count INT DEFAULT 0,
    profit_shared VARCHAR(50),
    twitter_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    telegram_url VARCHAR(500),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Media library
CREATE TABLE IF NOT EXISTS media (
    id INT PRIMARY KEY AUTO_INCREMENT,
    filename VARCHAR(255) NOT NULL,
    filepath VARCHAR(500) NOT NULL,
    mimetype VARCHAR(100),
    size_bytes INT,
    uploaded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    title VARCHAR(255),
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default settings
INSERT INTO site_settings (setting_key, setting_value, setting_type, category, description) VALUES
('telegram_link', 'https://t.me/hunter_tradeing', 'url', 'social', 'Telegram Channel Link'),
('facebook_link', 'https://facebook.com/hunter_tradeing', 'url', 'social', 'Facebook Page Link'),
('twitter_link', 'https://twitter.com/hunter_tradeing', 'url', 'social', 'Twitter Profile Link'),
('instagram_link', 'https://instagram.com/hunter_tradeing', 'url', 'social', 'Instagram Profile Link'),
('youtube_link', 'https://youtube.com/@hunter_tradeing', 'url', 'social', 'YouTube Channel Link'),
('whatsapp_link', 'https://wa.me/966500000000', 'url', 'social', 'WhatsApp Number'),
('support_email', 'support@hunter_tradeing.com', 'text', 'contact', 'Support Email'),
('affiliate_broker_1', 'https://exness.com/ref=hunter', 'url', 'affiliate', 'Broker 1 Affiliate Link'),
('affiliate_broker_2', 'https://icmarkets.com/ref=hunter', 'url', 'affiliate', 'Broker 2 Affiliate Link'),
('homepage_sections', '[{"id":"hero","enabled":true,"order":1},{"id":"coach","enabled":true,"order":2},{"id":"testimonials","enabled":true,"order":3},{"id":"signals","enabled":true,"order":4},{"id":"affiliate","enabled":true,"order":5},{"id":"blog","enabled":true,"order":6}]', 'text', 'layout', 'Homepage section order and visibility');

-- Insert default coach profile
INSERT INTO coach_profile (name_en, name_ar, title_en, title_ar, bio_en, bio_ar, experience_years, students_count, profit_shared) VALUES
('Ahmed Hunter', 'أحمد هانتر', 'Professional Trading Coach', 'مدرب تداول محترف', 'After losing $50,000 in my first year of trading, I decided to dedicate my life to mastering the markets. Now I help thousands of traders achieve financial freedom through proven strategies and mentorship.', 'بعد خسارة 50,000 دولار في سنتي الأولى في التداول، قررت تكريس حياتي لإتقان الأسواق. الآن أساعد آلاف المتداولين على تحقيق الحرية المالية من خلال الاستراتيجيات المجربة والتوجيه.', 8, 10000, '$2M+');

-- Insert sample data

-- Sample courses
INSERT INTO courses (title_en, title_ar, description_en, description_ar, level, price) VALUES
('Forex Trading Mastery', 'إتقان تداول الفوركس', 'Learn the complete foundation of forex trading from scratch', 'تعلم الأساس الكامل لتداول الفوركس من الصفر', 'beginner', 199.00),
('Technical Analysis Pro', 'تحليل فني احترافي', 'Master chart patterns, indicators, and price action strategies', 'أتقن أنماط الرسم البياني والمؤشرات واستراتيجيات حركة السعر', 'intermediate', 399.00),
('Professional Trading Systems', 'أنظمة التداول الاحترافية', 'Build and execute professional-grade trading systems', 'بناء وتنفيذ أنظمة تداول احترافية', 'advanced', 699.00);

-- Sample lessons
INSERT INTO lessons (course_id, title_en, title_ar, order_index, duration_minutes) VALUES
(1, 'What is Forex Trading?', 'ما هو تداول الفوركس؟', 1, 15),
(1, 'Currency Pairs Explained', 'شرح أزواج العملات', 2, 20),
(1, 'Market Hours & Sessions', 'ساعات وسلسات السوق', 3, 18),
(1, 'Understanding Price Charts', 'فهم الرسوم البيانية', 4, 25),
(2, 'Candlestick Patterns', 'أنماط الشموع اليابانية', 1, 30),
(2, 'Support & Resistance', 'الدعم والمقاومة', 2, 25),
(2, 'Technical Indicators', 'المؤشرات الفنية', 3, 35),
(3, 'Building a Trading Plan', 'بناء خطة تداول', 1, 40),
(3, 'Risk Management Systems', 'أنظمة إدارة المخاطر', 2, 45),
(3, 'Psychology of Trading', 'سيكولوجية التداول', 3, 30);

-- Sample signals
INSERT INTO signals (type, pair, entry_price, take_profit, stop_loss, status, result_pips, closed_at) VALUES
('buy', 'EUR/USD', 1.0895, 1.0945, 1.0865, 'profitable', 50, NOW() - INTERVAL 2 HOUR),
('sell', 'GBP/JPY', 188.45, 187.85, 188.95, 'active', NULL, NULL),
('buy', 'XAU/USD', 2032.50, 2045.00, 2020.00, 'profitable', 85, NOW() - INTERVAL 4 HOUR),
('sell', 'USD/CAD', 1.3520, 1.3470, 1.3550, 'loss', -30, NOW() - INTERVAL 6 HOUR),
('buy', 'EUR/GBP', 0.8565, 0.8620, 0.8530, 'profitable', 45, NOW() - INTERVAL 8 HOUR);

-- Sample testimonials
INSERT INTO testimonials (name, location, content_en, content_ar, rating, order_index) VALUES
('Mohammed A.', 'United Arab Emirates', 'Hunter Trading completely changed my approach to forex. The structured courses and real-time signals helped me achieve consistent profits. I went from losing money to making $3,000+ monthly.', 'غيّر هانتر تريدنغ نهجتي تجاه الفوركس تماماً. ساعدتني الدورات المنظمة والإشارات الفورية على تحقيق أرباح ثابتة.', 5, 1),
('Sarah K.', 'United Kingdom', "The mentorship program is exceptional. Ahmed doesn't just teach strategies; he teaches you how to think like a professional trader. My win rate improved from 45% to 82% in just 3 months.", 'برنامج التوجيه استثنائي. أحمد لا يعلم الاستراتيجيات فحسب؛ بل يعلمك كيف تفكر كمتداول محترف. تحسن معدل ربحي من 45% إلى 82% في 3 أشهر فقط.', 5, 2),
('John D.', 'United States', "I've tried many trading courses before, but Hunter Trading is different. The community support and the quality of education are unmatched. Best investment I've made in my trading career.", 'جربت العديد من دورات التداول من قبل، لكن هانتر تريدنغ مختلفة. دعم المجتمع وجودية التعليم لا مثيل لهما.', 5, 3);

-- Sample results
INSERT INTO results (profit_amount, win_rate, total_trades) VALUES
(12500.00, 88.5, 45),
(8200.00, 85.2, 38),
(15800.00, 90.1, 52),
(5400.00, 78.5, 32);

-- Sample home content
INSERT INTO home_content (section, field, value, language) VALUES
('hero', 'title', 'Master the Art of Trading', 'en'),
('hero', 'subtitle', 'Join thousands of successful traders who transformed their financial future with proven strategies and expert mentorship.', 'en'),
('coach', 'name', 'Ahmed Hunter', 'en'),
('coach', 'bio', 'After losing $50,000 in my first year of trading, I decided to dedicate my life to mastering the markets.', 'en');
