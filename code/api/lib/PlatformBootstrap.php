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

        self::ensureServicesSchema();
        self::ensureSectionSettingsSchema();
        self::ensureMarketUpdatesSchema();
        self::ensureTestimonialsSchema();
        self::ensurePaymentOrdersSchema();
        self::normalizeExistingSectionSettings();
        self::removeLegacyArtifacts();

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
                cta_url VARCHAR(500) NULL,
                badge_text_en VARCHAR(100) NULL,
                badge_text_ar VARCHAR(100) NULL,
                thumbnail_url VARCHAR(500) NULL,
                cover_url VARCHAR(500) NULL,
                offer_starts_at DATETIME NULL,
                offer_ends_at DATETIME NULL,
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
                media_url VARCHAR(500) NOT NULL,
                media_type VARCHAR(50) DEFAULT 'image',
                alt_text_en VARCHAR(255) NULL,
                alt_text_ar VARCHAR(255) NULL,
                sort_order INT DEFAULT 0,
                FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
            )
        ");

        $count = fetchOne("SELECT COUNT(*) AS total FROM services");
        if ((int) ($count['total'] ?? 0) > 0) {
            return;
        }

        self::seedDefaultServices();
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
            [
                'section_key' => 'hero',
                'title_en' => 'Trade with structure, not noise',
                'title_ar' => 'تداول بخطة واضحة وليس بعشوائية',
                'subtitle_en' => 'Funded accounts, VIP plans, scalp setups, courses, and limited offers managed from one place.',
                'subtitle_ar' => 'حسابات ممولة وباقات VIP وخدمات سكالب ودورات وعروض محدودة كلها بإدارة موحدة.',
                'cta_label_en' => 'Join Telegram',
                'cta_label_ar' => 'انضم لتيليجرام',
                'secondary_cta_label_en' => 'View Services',
                'secondary_cta_label_ar' => 'اعرض الخدمات',
                'stats_json' => json_encode([
                    ['value' => '10000+', 'label_en' => 'Students', 'label_ar' => 'طالب'],
                    ['value' => '8+', 'label_en' => 'Years', 'label_ar' => 'سنوات خبرة'],
                    ['value' => '87%', 'label_en' => 'Win Rate', 'label_ar' => 'معدل نجاح'],
                ], JSON_UNESCAPED_UNICODE),
                'sort_order' => 1,
            ],
            [
                'section_key' => 'funded',
                'title_en' => 'Funded Accounts',
                'title_ar' => 'الحسابات الممولة',
                'subtitle_en' => 'Sell funded account packages with clear pricing, features, and requirements.',
                'subtitle_ar' => 'اعرض الحسابات الممولة بتسعير واضح ومزايا ومتطلبات وخطوات.',
                'sort_order' => 2,
            ],
            [
                'section_key' => 'vip',
                'title_en' => 'VIP Plans',
                'title_ar' => 'باقات VIP',
                'subtitle_en' => 'Private trading recommendations with clear package comparisons and direct checkout.',
                'subtitle_ar' => 'توصيات خاصة مع مقارنة واضحة بين الباقات وربط مباشر بصفحة الشراء.',
                'sort_order' => 3,
            ],
            [
                'section_key' => 'scalp',
                'title_en' => 'Scalp',
                'title_ar' => 'Scalp',
                'subtitle_en' => 'Fast-execution service offers with direct CTA and onboarding details.',
                'subtitle_ar' => 'خدمات سكالب بتنفيذ سريع وروابط مباشرة وتفاصيل واضحة.',
                'sort_order' => 4,
            ],
            [
                'section_key' => 'courses',
                'title_en' => 'Courses',
                'title_ar' => 'الدورات التعليمية',
                'subtitle_en' => 'Educational products with modules, lessons, and direct purchase.',
                'subtitle_ar' => 'منتجات تعليمية مع منهج وخطوات واضحة وشراء مباشر.',
                'sort_order' => 5,
            ],
            [
                'section_key' => 'offers',
                'title_en' => 'Limited Offers',
                'title_ar' => 'العروض المحدودة',
                'subtitle_en' => 'Time-limited offers with badges, countdowns, and automatic expiry.',
                'subtitle_ar' => 'عروض مؤقتة مع بادجات وعد تنازلي واختفاء تلقائي عند الانتهاء.',
                'sort_order' => 6,
            ],
            [
                'section_key' => 'testimonials',
                'title_en' => 'Student Reviews',
                'title_ar' => 'آراء الطلاب',
                'subtitle_en' => 'Real public proof controlled by moderation and ordering.',
                'subtitle_ar' => 'تجارب حقيقية قابلة للمراجعة والترتيب والإظهار من لوحة التحكم.',
                'sort_order' => 7,
            ],
            [
                'section_key' => 'market',
                'title_en' => 'Market Follow-up',
                'title_ar' => 'تابع السوق',
                'subtitle_en' => 'Managed market analysis, updates, and follow-up from one source.',
                'subtitle_ar' => 'تحليلات وتحديثات ومتابعة للسوق من نظام واحد مُدار.',
                'sort_order' => 8,
            ],
            [
                'section_key' => 'coach',
                'title_en' => 'Coach',
                'title_ar' => 'المدرب',
                'sort_order' => 9,
            ],
            [
                'section_key' => 'navigation',
                'title_en' => 'Main Navigation',
                'title_ar' => 'القائمة الرئيسية',
                'settings_json' => json_encode([
                    'menu_items' => [
                        ['id' => 'funded', 'label_en' => 'Funded Accounts', 'label_ar' => 'الحسابات الممولة', 'href' => '#funded', 'is_visible' => true, 'new_tab' => false, 'sort_order' => 1],
                        ['id' => 'vip', 'label_en' => 'VIP', 'label_ar' => 'VIP', 'href' => '#vip', 'is_visible' => true, 'new_tab' => false, 'sort_order' => 2],
                        ['id' => 'scalp', 'label_en' => 'Scalp', 'label_ar' => 'Scalp', 'href' => '#scalp', 'is_visible' => true, 'new_tab' => false, 'sort_order' => 3],
                        ['id' => 'courses', 'label_en' => 'Courses', 'label_ar' => 'الدورات التعليمية', 'href' => '#courses', 'is_visible' => true, 'new_tab' => false, 'sort_order' => 4],
                        ['id' => 'offers', 'label_en' => 'Offers', 'label_ar' => 'العروض', 'href' => '#offers', 'is_visible' => true, 'new_tab' => false, 'sort_order' => 5],
                    ],
                ], JSON_UNESCAPED_UNICODE),
                'is_visible' => 0,
                'sort_order' => 90,
            ],
            [
                'section_key' => 'footer',
                'title_en' => 'Footer',
                'title_ar' => 'الفوتر',
                'settings_json' => json_encode([
                    'quick_links' => [
                        ['label_en' => 'Home', 'label_ar' => 'الرئيسية', 'href' => '#home', 'is_visible' => true, 'new_tab' => false, 'sort_order' => 1],
                        ['label_en' => 'Funded Accounts', 'label_ar' => 'الحسابات الممولة', 'href' => '#funded', 'is_visible' => true, 'new_tab' => false, 'sort_order' => 2],
                        ['label_en' => 'VIP', 'label_ar' => 'VIP', 'href' => '#vip', 'is_visible' => true, 'new_tab' => false, 'sort_order' => 3],
                        ['label_en' => 'Offers', 'label_ar' => 'العروض', 'href' => '#offers', 'is_visible' => true, 'new_tab' => false, 'sort_order' => 4],
                    ],
                    'legal_links' => [
                        ['label_en' => 'Privacy Policy', 'label_ar' => 'سياسة الخصوصية', 'href' => '/privacy-policy', 'is_visible' => true, 'new_tab' => false, 'sort_order' => 1],
                        ['label_en' => 'Terms & Conditions', 'label_ar' => 'الشروط والأحكام', 'href' => '/terms-and-conditions', 'is_visible' => true, 'new_tab' => false, 'sort_order' => 2],
                        ['label_en' => 'Risk Disclaimer', 'label_ar' => 'إخلاء المسؤولية', 'href' => '/risk-disclaimer', 'is_visible' => true, 'new_tab' => false, 'sort_order' => 3],
                    ],
                ], JSON_UNESCAPED_UNICODE),
                'is_visible' => 0,
                'sort_order' => 91,
            ],
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
                    $row['title_en'] ?? null,
                    $row['title_ar'] ?? null,
                    $row['subtitle_en'] ?? null,
                    $row['subtitle_ar'] ?? null,
                    $row['body_en'] ?? null,
                    $row['body_ar'] ?? null,
                    $row['cta_label_en'] ?? null,
                    $row['cta_label_ar'] ?? null,
                    $row['cta_url'] ?? null,
                    $row['secondary_cta_label_en'] ?? null,
                    $row['secondary_cta_label_ar'] ?? null,
                    $row['secondary_cta_url'] ?? null,
                    $row['image_url'] ?? null,
                    $row['stats_json'] ?? null,
                    $row['settings_json'] ?? null,
                    $row['is_visible'] ?? 1,
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

        $count = fetchOne("SELECT COUNT(*) AS total FROM market_updates");
        if ((int) ($count['total'] ?? 0) > 0) {
            return;
        }

        insert(
            "INSERT INTO market_updates
            (title_en, title_ar, summary_en, summary_ar, content_en, content_ar, category, author_name, is_pinned, is_featured, sort_order, published_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 1, 1, ?)",
            [
                'Gold intraday momentum watch',
                'متابعة زخم الذهب اليومية',
                'Watch price reaction around the nearest liquidity zone before entries.',
                'تابع تفاعل السعر مع أقرب منطقة سيولة قبل الدخول.',
                'Managed market updates now live in one source with ordering, visibility, and pinning.',
                'تحديثات السوق الآن في نظام واحد مع ترتيب وإظهار وتثبيت.',
                'analysis',
                'Hunter Trading',
                date('Y-m-d H:i:s'),
            ]
        );
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

        self::ensureColumn('payment_orders', 'service_id', "INT NULL AFTER product_id");
        self::ensureColumn('payment_orders', 'verified_at', "DATETIME NULL AFTER admin_note");
        self::ensureColumn('payment_orders', 'verified_by', "VARCHAR(150) NULL AFTER verified_at");
    }

    private static function removeLegacyArtifacts(): void
    {
        $legacyTables = [
            'course_enrollments',
            'lessons',
            'courses',
            'digital_products',
            'blog_posts',
            'signals',
            'home_content',
        ];

        foreach ($legacyTables as $table) {
            if (!self::tableExists($table)) {
                continue;
            }
            modify("DROP TABLE IF EXISTS {$table}");
        }
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
        $columns = array_column(fetchAll("SHOW COLUMNS FROM {$table}"), 'Field');
        if (!in_array($column, $columns, true)) {
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

    private static function seedDefaultServices(): void
    {
        $rows = [
            ['funded', 'funded-100k', 'Funded 100K', 'حساب ممول 100K', 'Funded challenge package', 'باقة حساب ممول', 100, '100K'],
            ['vip', 'vip-monthly', 'VIP Monthly', 'VIP شهري', 'Private recommendations', 'توصيات خاصة', 69, 'Popular'],
            ['courses', 'course-price-action', 'Price Action Course', 'كورس برايس أكشن', 'Beginner to advanced course', 'كورس من البداية للاحتراف', 149, 'Course'],
            ['offers', 'offer-vip-quarter', 'VIP Quarter Offer', 'عرض VIP ثلاثة شهور', 'Limited-time VIP offer', 'عرض VIP لفترة محدودة', 179, 'Limited'],
            ['scalp', 'scalp-onboarding', 'Scalp Setup', 'خدمة سكالب', 'Fast execution and broker onboarding', 'تنفيذ سريع وربط مباشر', 0, 'Scalp'],
        ];

        foreach ($rows as [$type, $slug, $titleEn, $titleAr, $descEn, $descAr, $price, $badge]) {
            $id = insert(
                "INSERT INTO services
                (type, slug, title_en, title_ar, short_description_en, short_description_ar, full_description_en, full_description_ar,
                 price, badge_text_en, badge_text_ar, cta_label_en, cta_label_ar, is_visible, sort_order)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Buy Now', 'اشتر الآن', 1, 0)",
                [$type, $slug, $titleEn, $titleAr, $descEn, $descAr, $descEn, $descAr, $price, $badge, $badge]
            );

            insert(
                "INSERT INTO service_features (service_id, label_en, label_ar, sort_order) VALUES (?, ?, ?, 1)",
                [(int) $id, $descEn, $descAr]
            );
        }
    }
}
