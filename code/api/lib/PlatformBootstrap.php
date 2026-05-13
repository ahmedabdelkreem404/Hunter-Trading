<?php

require_once __DIR__ . '/../config/database.php';

class PlatformBootstrap
{
    private static bool $bootstrapped = false;

    public static function ensure(): void
    {
        if (self::$bootstrapped) {
            return;
        }

        $runtimeSchemaCheck = strtolower((string) getenv('HUNTER_RUNTIME_SCHEMA_CHECK'));
        if (!in_array($runtimeSchemaCheck, ['1', 'true', 'yes'], true)) {
            self::$bootstrapped = true;
            return;
        }

        self::ensureServicesSchema();
        self::ensureSectionSettingsSchema();
        self::ensureMarketUpdatesSchema();
        self::ensureTestimonialsSchema();
        self::ensurePaymentOrdersSchema();
        self::normalizeExistingSectionSettings();

        self::$bootstrapped = true;
    }

    private static function ensureServicesSchema(): void
    {
        modify("
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
                cta_url VARCHAR(1000) NULL,
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
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_services_type (type),
                INDEX idx_services_visible (is_visible),
                INDEX idx_services_offer_ends (offer_ends_at)
            )
        ");

        self::ensureServiceColumns();

        modify("
            CREATE TABLE IF NOT EXISTS service_features (
                id INT PRIMARY KEY AUTO_INCREMENT,
                service_id INT NOT NULL,
                label_en VARCHAR(255) NOT NULL,
                label_ar VARCHAR(255) NULL,
                sort_order INT DEFAULT 0,
                FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
            )
        ");

        modify("
            CREATE TABLE IF NOT EXISTS service_steps (
                id INT PRIMARY KEY AUTO_INCREMENT,
                service_id INT NOT NULL,
                title_en VARCHAR(255) NULL,
                title_ar VARCHAR(255) NULL,
                description_en TEXT NULL,
                description_ar TEXT NULL,
                sort_order INT DEFAULT 0,
                FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
            )
        ");

        modify("
            CREATE TABLE IF NOT EXISTS service_faqs (
                id INT PRIMARY KEY AUTO_INCREMENT,
                service_id INT NOT NULL,
                question_en VARCHAR(255) NOT NULL,
                question_ar VARCHAR(255) NULL,
                answer_en TEXT NULL,
                answer_ar TEXT NULL,
                sort_order INT DEFAULT 0,
                FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
            )
        ");

        modify("
            CREATE TABLE IF NOT EXISTS service_media (
                id INT PRIMARY KEY AUTO_INCREMENT,
                service_id INT NOT NULL,
                media_url VARCHAR(1000) NOT NULL,
                media_type VARCHAR(50) DEFAULT 'image',
                alt_text_en VARCHAR(255) NULL,
                alt_text_ar VARCHAR(255) NULL,
                sort_order INT DEFAULT 0,
                FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
            )
        ");

        // Keep runtime schema-safe only. Content/products are created from the dashboard or imported DB.
    }

    private static function ensureServiceColumns(): void
    {
        $columns = [
            'cover_media_type' => "ENUM('image','video','embed') DEFAULT 'image' AFTER cover_url",
            'cover_video_poster_url' => "VARCHAR(1000) NULL AFTER cover_media_type",
            'cover_video_autoplay' => "TINYINT(1) DEFAULT 1 AFTER cover_video_poster_url",
            'cover_video_muted' => "TINYINT(1) DEFAULT 1 AFTER cover_video_autoplay",
            'cover_video_loop' => "TINYINT(1) DEFAULT 1 AFTER cover_video_muted",
            'cover_video_controls' => "TINYINT(1) DEFAULT 0 AFTER cover_video_loop",
            'card_media_type' => "ENUM('image','video','embed') DEFAULT 'image' AFTER cover_video_poster_url",
            'card_media_url' => "VARCHAR(1000) NULL AFTER card_media_type",
            'card_video_poster_url' => "VARCHAR(1000) NULL AFTER card_media_url",
            'card_video_autoplay' => "TINYINT(1) DEFAULT 1 AFTER card_video_poster_url",
            'card_video_muted' => "TINYINT(1) DEFAULT 1 AFTER card_video_autoplay",
            'card_video_loop' => "TINYINT(1) DEFAULT 1 AFTER card_video_muted",
            'card_video_controls' => "TINYINT(1) DEFAULT 0 AFTER card_video_loop",
            'cta_action' => "ENUM('checkout','details','external','referral','whatsapp','telegram') DEFAULT 'checkout' AFTER offer_ends_at",
            'referral_url' => "VARCHAR(1000) NULL AFTER cta_action",
            'broker_name' => "VARCHAR(150) NULL AFTER referral_url",
            'broker_url' => "VARCHAR(1000) NULL AFTER broker_name",
            'terms_title_en' => "VARCHAR(255) NULL AFTER broker_url",
            'terms_title_ar' => "VARCHAR(255) NULL AFTER terms_title_en",
            'terms_content_en' => "LONGTEXT NULL AFTER terms_title_ar",
            'terms_content_ar' => "LONGTEXT NULL AFTER terms_content_en",
            'risk_warning_en' => "TEXT NULL AFTER terms_content_ar",
            'risk_warning_ar' => "TEXT NULL AFTER risk_warning_en",
            'important_links_json' => "LONGTEXT NULL AFTER risk_warning_ar",
            'details_button_label_en' => "VARCHAR(100) NULL AFTER important_links_json",
            'details_button_label_ar' => "VARCHAR(100) NULL AFTER details_button_label_en",
            'final_cta_label_en' => "VARCHAR(100) NULL AFTER details_button_label_ar",
            'final_cta_label_ar' => "VARCHAR(100) NULL AFTER final_cta_label_en",
        ];

        foreach ($columns as $column => $definition) {
            self::ensureColumn('services', $column, $definition);
        }
    }

    private static function ensureSectionSettingsSchema(): void
    {
        modify("
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
                cta_url VARCHAR(500) NULL,
                secondary_cta_label_en VARCHAR(100) NULL,
                secondary_cta_label_ar VARCHAR(100) NULL,
                secondary_cta_url VARCHAR(500) NULL,
                image_url VARCHAR(500) NULL,
                stats_json LONGTEXT NULL,
                settings_json LONGTEXT NULL,
                is_visible TINYINT(1) DEFAULT 1,
                sort_order INT DEFAULT 0,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        ");

        $count = fetchOne("SELECT COUNT(*) AS total FROM section_settings");
        if ((int) ($count['total'] ?? 0) > 0) {
            return;
        }

        $defaults = [
            ['section_key' => 'hero', 'sort_order' => 1],
            ['section_key' => 'funded', 'sort_order' => 2],
            ['section_key' => 'vip', 'sort_order' => 3],
            ['section_key' => 'scalp', 'sort_order' => 4],
            ['section_key' => 'courses', 'sort_order' => 5],
            ['section_key' => 'offers', 'sort_order' => 6],
            ['section_key' => 'testimonials', 'sort_order' => 7],
            ['section_key' => 'market', 'sort_order' => 8],
            ['section_key' => 'coach', 'sort_order' => 9],
            ['section_key' => 'navigation', 'sort_order' => 90],
            ['section_key' => 'footer', 'sort_order' => 91],
        ];

        foreach ($defaults as $row) {
            insert(
                "INSERT INTO section_settings
                (section_key, title_en, title_ar, subtitle_en, subtitle_ar, body_en, body_ar, cta_label_en, cta_label_ar,
                 cta_url, secondary_cta_label_en, secondary_cta_label_ar, secondary_cta_url, image_url, stats_json, settings_json,
                 is_visible, sort_order)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    $row['section_key'],
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    0,
                    $row['sort_order'] ?? 0,
                ]
            );
        }
    }

    private static function ensureMarketUpdatesSchema(): void
    {
        modify("
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
            )
        ");

        self::ensureColumn('market_updates', 'is_pinned', "TINYINT(1) DEFAULT 0 AFTER tags_json");

        // Do not seed market content during requests. Admin/imported DB content only.
    }

    private static function ensureTestimonialsSchema(): void
    {
        if (!self::tableExists('testimonials')) {
            return;
        }

        self::ensureColumn('testimonials', 'service_type', "VARCHAR(50) NULL AFTER rating");
        self::ensureColumn('testimonials', 'service_id', "INT NULL AFTER service_type");
        self::ensureColumn('testimonials', 'is_featured', "TINYINT(1) DEFAULT 0 AFTER service_id");
        self::ensureColumn('testimonials', 'is_approved', "TINYINT(1) DEFAULT 1 AFTER is_featured");
        self::ensureColumn('testimonials', 'is_visible', "TINYINT(1) DEFAULT 1 AFTER is_approved");
        self::ensureColumn('testimonials', 'order_index', "INT DEFAULT 0 AFTER is_visible");
    }

    private static function ensurePaymentOrdersSchema(): void
    {
        if (!self::tableExists('payment_orders')) {
            modify("
                CREATE TABLE IF NOT EXISTS payment_orders (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    service_id INT NOT NULL,
                    customer_name VARCHAR(150) NOT NULL,
                    customer_email VARCHAR(255) NOT NULL,
                    customer_phone VARCHAR(50),
                    payment_method VARCHAR(50) NOT NULL,
                    amount DECIMAL(10,2) DEFAULT 0,
                    screenshot_url VARCHAR(500),
                    status VARCHAR(30) DEFAULT 'pending',
                    redirect_url VARCHAR(500),
                    admin_note TEXT,
                    verified_at DATETIME NULL,
                    verified_by VARCHAR(150) NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            ");
            return;
        }

        self::ensureColumn('payment_orders', 'service_id', "INT NULL");
        self::ensureColumn('payment_orders', 'verified_at', "DATETIME NULL AFTER admin_note");
        self::ensureColumn('payment_orders', 'verified_by', "VARCHAR(150) NULL AFTER verified_at");
    }

    private static function normalizeExistingSectionSettings(): void
    {
        if (!self::tableExists('section_settings')) {
            return;
        }

        $rows = fetchAll("SELECT id, section_key, settings_json FROM section_settings WHERE section_key IN ('navigation', 'footer')");
        foreach ($rows as $row) {
            $settings = !empty($row['settings_json']) ? json_decode($row['settings_json'], true) : [];
            if (!is_array($settings)) {
                $settings = [];
            }

            foreach (['menu_items', 'quick_links', 'legal_links'] as $groupKey) {
                if (!isset($settings[$groupKey]) || !is_array($settings[$groupKey])) {
                    continue;
                }

                $settings[$groupKey] = array_map(function ($item) {
                    if (!is_array($item)) {
                        return $item;
                    }

                    if (($item['href'] ?? '') === '#affiliate') {
                        $item['href'] = '#scalp';
                    }
                    if (($item['href'] ?? '') === '#signals') {
                        $item['href'] = '#market';
                    }
                    if (($item['href'] ?? '') === '#blog') {
                        $item['href'] = '#offers';
                    }
                    if (($item['id'] ?? '') === 'affiliate') {
                        $item['id'] = 'scalp';
                    }
                    if (($item['id'] ?? '') === 'signals') {
                        $item['id'] = 'market';
                    }
                    if (($item['id'] ?? '') === 'blog') {
                        $item['id'] = 'offers';
                    }

                    return $item;
                }, $settings[$groupKey]);
            }

            modify(
                "UPDATE section_settings SET settings_json = ? WHERE id = ?",
                [json_encode($settings, JSON_UNESCAPED_UNICODE), (int) $row['id']]
            );
        }
    }

    private static function ensureColumn(string $table, string $column, string $definition): void
    {
        $existing = fetchOne(
            "SELECT COUNT(*) AS total
             FROM information_schema.columns
             WHERE table_schema = DATABASE()
             AND table_name = ?
             AND column_name = ?",
            [$table, $column]
        );

        if ((int) ($existing['total'] ?? 0) === 0) {
            modify("ALTER TABLE {$table} ADD COLUMN {$column} {$definition}");
        }
    }

    private static function tableExists(string $table): bool
    {
        $row = fetchOne(
            "SELECT COUNT(*) AS total
             FROM information_schema.tables
             WHERE table_schema = DATABASE() AND table_name = ?",
            [$table]
        );
        return (int) ($row['total'] ?? 0) > 0;
    }

}
