-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: hunter_trading
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `affiliate_clicks`
--

DROP TABLE IF EXISTS `affiliate_clicks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `affiliate_clicks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `broker_id` varchar(50) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_broker` (`broker_id`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `affiliate_clicks`
--

LOCK TABLES `affiliate_clicks` WRITE;
/*!40000 ALTER TABLE `affiliate_clicks` DISABLE KEYS */;
INSERT INTO `affiliate_clicks` VALUES (1,'affiliate_broker_1','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36','2026-04-14 09:57:35'),(2,'affiliate_valtex','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36','2026-04-15 20:50:37'),(3,'affiliate_gtc','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36','2026-04-15 20:50:40'),(4,'affiliate_valtex','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36','2026-04-15 21:08:31'),(5,'affiliate_gtc','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36','2026-04-15 21:08:50'),(6,'affiliate_valtex','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36','2026-04-15 21:08:53'),(7,'affiliate_valtex','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36','2026-04-18 21:52:48'),(8,'affiliate_gtc','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36','2026-04-18 21:52:51'),(9,'affiliate_gtc','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36','2026-04-18 21:52:54');
/*!40000 ALTER TABLE `affiliate_clicks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `analytics`
--

DROP TABLE IF EXISTS `analytics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `analytics` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_type` varchar(50) NOT NULL,
  `event_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`event_data`)),
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_event_type` (`event_type`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `analytics`
--

LOCK TABLES `analytics` WRITE;
/*!40000 ALTER TABLE `analytics` DISABLE KEYS */;
INSERT INTO `analytics` VALUES (1,'affiliate_click','{\"broker_id\":\"affiliate_broker_1\"}',NULL,NULL,'2026-04-14 09:57:35'),(2,'affiliate_click','{\"broker_id\":\"affiliate_valtex\"}',NULL,NULL,'2026-04-15 20:50:37'),(3,'affiliate_click','{\"broker_id\":\"affiliate_gtc\"}',NULL,NULL,'2026-04-15 20:50:40'),(4,'affiliate_click','{\"broker_id\":\"affiliate_valtex\"}',NULL,NULL,'2026-04-15 21:08:31'),(5,'affiliate_click','{\"broker_id\":\"affiliate_gtc\"}',NULL,NULL,'2026-04-15 21:08:50'),(6,'affiliate_click','{\"broker_id\":\"affiliate_valtex\"}',NULL,NULL,'2026-04-15 21:08:53'),(7,'affiliate_click','{\"broker_id\":\"affiliate_valtex\"}',NULL,NULL,'2026-04-18 21:52:48'),(8,'affiliate_click','{\"broker_id\":\"affiliate_gtc\"}',NULL,NULL,'2026-04-18 21:52:51'),(9,'affiliate_click','{\"broker_id\":\"affiliate_gtc\"}',NULL,NULL,'2026-04-18 21:52:54');
/*!40000 ALTER TABLE `analytics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coach_profile`
--

DROP TABLE IF EXISTS `coach_profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `coach_profile` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name_en` varchar(255) NOT NULL,
  `name_ar` varchar(255) NOT NULL,
  `title_en` varchar(255) DEFAULT NULL,
  `title_ar` varchar(255) DEFAULT NULL,
  `bio_en` text DEFAULT NULL,
  `bio_ar` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `experience_years` int(11) DEFAULT 0,
  `students_count` int(11) DEFAULT 0,
  `profit_shared` varchar(50) DEFAULT NULL,
  `twitter_url` varchar(500) DEFAULT NULL,
  `linkedin_url` varchar(500) DEFAULT NULL,
  `telegram_url` varchar(500) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coach_profile`
--

LOCK TABLES `coach_profile` WRITE;
/*!40000 ALTER TABLE `coach_profile` DISABLE KEYS */;
INSERT INTO `coach_profile` VALUES (1,'mm Hunter','maaa','Professional Trading Coach','???? ????? ?????','After losing $50,000 in my first year of trading, I decided to dedicate my life to mastering the markets. Now I help thousands of traders achieve financial freedom through proven strategies and mentorship.','??? ????? 50,000 ????? ?? ??? ??? ?? ?? ???????? ???? ?? ???? ????? ?????? ???????. ???? ????? ???? ?????????? ??? ????? ?????? ??????? ?? ???? ??????????? ????? ?????? ????.','/uploads/coach/coach_1776191044_69de8644054c5.png',8,10000,'$2M+',NULL,NULL,NULL,'2026-04-14 18:24:04');
/*!40000 ALTER TABLE `coach_profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coach_social_links`
--

DROP TABLE IF EXISTS `coach_social_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `coach_social_links` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `platform` varchar(50) NOT NULL,
  `label` varchar(100) NOT NULL,
  `url` varchar(500) NOT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_enabled` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coach_social_links`
--

LOCK TABLES `coach_social_links` WRITE;
/*!40000 ALTER TABLE `coach_social_links` DISABLE KEYS */;
INSERT INTO `coach_social_links` VALUES (1,'telegram','Telegram','https://t.me/huntertrading',1,1,'2026-04-18 20:22:00','2026-04-18 20:22:00'),(2,'instagram','Instagram','https://instagram.com/huntertrading',2,1,'2026-04-18 20:22:00','2026-04-18 20:22:00'),(3,'youtube','YouTube','https://youtube.com/@huntertrading',3,1,'2026-04-18 20:22:00','2026-04-18 20:22:00'),(4,'facebook','Facebook','https://facebook.com/huntertrading',4,1,'2026-04-18 20:22:00','2026-04-18 20:33:13'),(5,'twitter','X / Twitter','https://x.com/huntertrading',5,1,'2026-04-18 20:22:00','2026-04-18 20:33:16'),(6,'whatsapp','WhatsApp','https://wa.me/201000000000',6,1,'2026-04-18 20:22:00','2026-04-18 20:33:18'),(7,'facebook','facebook','http://127.0.0.1:5173/admin',0,1,'2026-04-18 20:30:40','2026-04-18 20:31:15');
/*!40000 ALTER TABLE `coach_social_links` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leads`
--

DROP TABLE IF EXISTS `leads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `leads` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `source` varchar(50) DEFAULT 'website',
  `telegram_joined` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leads`
--

LOCK TABLES `leads` WRITE;
/*!40000 ALTER TABLE `leads` DISABLE KEYS */;
/*!40000 ALTER TABLE `leads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `market_updates`
--

DROP TABLE IF EXISTS `market_updates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `market_updates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title_en` varchar(255) NOT NULL,
  `title_ar` varchar(255) DEFAULT NULL,
  `summary_en` text DEFAULT NULL,
  `summary_ar` text DEFAULT NULL,
  `content_en` longtext DEFAULT NULL,
  `content_ar` longtext DEFAULT NULL,
  `category` varchar(100) DEFAULT 'analysis',
  `image_url` varchar(500) DEFAULT NULL,
  `author_name` varchar(150) DEFAULT NULL,
  `tags_json` text DEFAULT NULL,
  `is_pinned` tinyint(1) DEFAULT 0,
  `is_featured` tinyint(1) DEFAULT 0,
  `is_visible` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `published_at` datetime DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `market_updates`
--

LOCK TABLES `market_updates` WRITE;
/*!40000 ALTER TABLE `market_updates` DISABLE KEYS */;
INSERT INTO `market_updates` VALUES (1,'Gold intraday momentum watch','متابعة زخم الذهب اليومية','Watch price reaction around the nearest liquidity zone before entries.','تابع تفاعل السعر مع أقرب منطقة سيولة قبل الدخول.','Managed market updates now live in one source with ordering, visibility, and pinning.','تحديثات السوق الآن في نظام واحد مع ترتيب وإظهار وتثبيت.','analysis',NULL,'Hunter Trading',NULL,1,1,1,1,'2026-04-19 16:22:38','2026-04-19 14:22:38','2026-04-19 14:22:38');
/*!40000 ALTER TABLE `market_updates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media`
--

DROP TABLE IF EXISTS `media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `media` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) NOT NULL,
  `filepath` varchar(500) NOT NULL,
  `mimetype` varchar(100) DEFAULT NULL,
  `size_bytes` int(11) DEFAULT NULL,
  `uploaded_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `uploaded_by` (`uploaded_by`),
  CONSTRAINT `media_ibfk_1` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media`
--

LOCK TABLES `media` WRITE;
/*!40000 ALTER TABLE `media` DISABLE KEYS */;
INSERT INTO `media` VALUES (1,'Mr.Beast’s (1).png','/uploads/coach/coach_1776191044_69de8644054c5.png','image/png',1443457,NULL,'2026-04-14 18:24:04'),(2,'تصميم بدون عنوان.png','/uploads/media/media_1776239709_69df445d3b062.png','image/png',470075,NULL,'2026-04-15 07:55:09'),(3,'Gemini_Generated_Image_sck0q4sck0q4sck0.png','/uploads/media/media_1776239722_69df446ad698c.png','image/png',8093743,NULL,'2026-04-15 07:55:22'),(4,'تصميم بدون عنوان.png','/uploads/media/media_1776240129_69df46010cef8.png','image/png',470075,NULL,'2026-04-15 08:02:09'),(6,'Secret T.R. (1).png','/uploads/media/media_1776240891_69df48fb213e1.png','image/png',614796,NULL,'2026-04-15 08:14:51'),(9,'Screenshot 2025-08-21 153804.png','/uploads/media/media_1776287988_69e000f47452e.png','image/png',35159,NULL,'2026-04-15 21:19:48'),(11,'2025-10-11-68ea5890451c6.webp','/uploads/media/media_1776550677_69e403159fb34.webp','image/webp',20880,NULL,'2026-04-18 22:17:57'),(12,'573598294_904233272123835_5638616923923601732_n.png','/uploads/media/media_1776554090_69e4106a0ff36.png','image/png',43271,NULL,'2026-04-18 23:14:50'),(13,'573598294_904233272123835_5638616923923601732_n.png','/uploads/media/media_1776554095_69e4106f690c5.png','image/png',43271,NULL,'2026-04-18 23:14:55');
/*!40000 ALTER TABLE `media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_orders`
--

DROP TABLE IF EXISTS `payment_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payment_orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `service_id` int(11) DEFAULT NULL,
  `customer_name` varchar(150) NOT NULL,
  `customer_email` varchar(255) NOT NULL,
  `customer_phone` varchar(50) DEFAULT NULL,
  `payment_method` varchar(50) NOT NULL,
  `amount` decimal(10,2) DEFAULT 0.00,
  `screenshot_url` varchar(500) DEFAULT NULL,
  `status` varchar(30) DEFAULT 'pending',
  `redirect_url` varchar(500) DEFAULT NULL,
  `admin_note` text DEFAULT NULL,
  `verified_at` datetime DEFAULT NULL,
  `verified_by` varchar(150) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_product_id` (`product_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_orders`
--

LOCK TABLES `payment_orders` WRITE;
/*!40000 ALTER TABLE `payment_orders` DISABLE KEYS */;
INSERT INTO `payment_orders` VALUES (1,1,NULL,'شس','ahmed@gmail.com','010955','vodafone_cash',100.00,NULL,'pending','https://t.me/huntertrading',NULL,NULL,NULL,'2026-04-18 21:49:09','2026-04-18 21:49:09');
/*!40000 ALTER TABLE `payment_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `results`
--

DROP TABLE IF EXISTS `results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `results` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `image_url` varchar(500) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `profit_amount` decimal(15,2) DEFAULT 0.00,
  `loss_amount` decimal(15,2) DEFAULT 0.00,
  `win_rate` decimal(5,2) DEFAULT 0.00,
  `total_trades` int(11) DEFAULT 0,
  `profitable_trades` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `results`
--

LOCK TABLES `results` WRITE;
/*!40000 ALTER TABLE `results` DISABLE KEYS */;
INSERT INTO `results` VALUES (1,NULL,NULL,12500.00,0.00,88.50,45,0,'2026-04-02 18:12:57'),(2,NULL,NULL,8200.00,0.00,85.20,38,0,'2026-04-02 18:12:57'),(3,NULL,NULL,15800.00,0.00,90.10,52,0,'2026-04-02 18:12:57'),(4,NULL,NULL,5400.00,0.00,78.50,32,0,'2026-04-02 18:12:57');
/*!40000 ALTER TABLE `results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `section_settings`
--

DROP TABLE IF EXISTS `section_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `section_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `section_key` varchar(100) NOT NULL,
  `title_en` varchar(255) DEFAULT NULL,
  `title_ar` varchar(255) DEFAULT NULL,
  `subtitle_en` text DEFAULT NULL,
  `subtitle_ar` text DEFAULT NULL,
  `body_en` longtext DEFAULT NULL,
  `body_ar` longtext DEFAULT NULL,
  `cta_label_en` varchar(100) DEFAULT NULL,
  `cta_label_ar` varchar(100) DEFAULT NULL,
  `cta_url` varchar(500) DEFAULT NULL,
  `secondary_cta_label_en` varchar(100) DEFAULT NULL,
  `secondary_cta_label_ar` varchar(100) DEFAULT NULL,
  `secondary_cta_url` varchar(500) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `stats_json` longtext DEFAULT NULL,
  `settings_json` longtext DEFAULT NULL,
  `is_visible` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `section_key` (`section_key`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `section_settings`
--

LOCK TABLES `section_settings` WRITE;
/*!40000 ALTER TABLE `section_settings` DISABLE KEYS */;
INSERT INTO `section_settings` VALUES (1,'hero','Trade with structure, not noise','تداول بخطة واضحة وليس بعشوائية','Funded accounts, VIP plans, scalp setups, courses, and limited offers managed from one place.','حسابات ممولة وباقات VIP وخدمات سكالب ودورات وعروض محدودة كلها بإدارة موحدة.',NULL,NULL,'Join Telegram','انضم لتيليجرام',NULL,'View Services','اعرض الخدمات',NULL,NULL,'[{\"value\":\"10000+\",\"label_en\":\"Students\",\"label_ar\":\"طالب\"},{\"value\":\"8+\",\"label_en\":\"Years\",\"label_ar\":\"سنوات خبرة\"},{\"value\":\"87%\",\"label_en\":\"Win Rate\",\"label_ar\":\"معدل نجاح\"}]','[]',1,1,'2026-05-05 17:51:49'),(2,'funded','Funded Accounts','الحسابات الممولة','Sell funded account packages with clear pricing, features, and requirements.','اعرض الحسابات الممولة بتسعير واضح ومزايا ومتطلبات وخطوات.',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]','[]',1,2,'2026-04-19 15:01:44'),(3,'vip','VIP Plans','باقات VIP','Private trading recommendations with clear package comparisons and direct checkout.','توصيات خاصة مع مقارنة واضحة بين الباقات وربط مباشر بصفحة الشراء.',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]','[]',1,3,'2026-04-19 15:01:44'),(4,'scalp','Scalp','Scalp','Fast-execution service offers with direct CTA and onboarding details.','خدمات سكالب بتنفيذ سريع وروابط مباشرة وتفاصيل واضحة.',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]','[]',1,4,'2026-04-19 15:01:44'),(5,'courses','Courses','الدورات التعليمية','Educational products with modules, lessons, and direct purchase.','منتجات تعليمية مع منهج وخطوات واضحة وشراء مباشر.',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]','[]',1,5,'2026-04-19 15:01:44'),(6,'offers','Limited Offers','العروض المحدودة','Time-limited offers with badges, countdowns, and automatic expiry.','عروض مؤقتة مع بادجات وعد تنازلي واختفاء تلقائي عند الانتهاء.',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]','[]',1,6,'2026-04-19 15:01:44'),(7,'testimonials','Student Reviews','آراء الطلاب','Real public proof controlled by moderation and ordering.','تجارب حقيقية قابلة للمراجعة والترتيب والإظهار من لوحة التحكم.',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]','[]',1,7,'2026-04-19 15:01:44'),(8,'market','Market Follow-up','تابع السوق','Managed market analysis, updates, and follow-up from one source.','تحليلات وتحديثات ومتابعة للسوق من نظام واحد مُدار.',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]','[]',1,8,'2026-04-19 15:01:44'),(9,'coach','Coach','المدرب',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]','[]',1,9,'2026-04-19 15:01:44'),(10,'navigation','Main Navigation','القائمة الرئيسية',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]','{\"menu_items\":[{\"id\":\"funded\",\"label_en\":\"Funded Accounts\",\"label_ar\":\"الحسابات الممولة\",\"href\":\"#funded\",\"is_visible\":true,\"new_tab\":false,\"sort_order\":1},{\"id\":\"vip\",\"label_en\":\"VIP\",\"label_ar\":\"VIP\",\"href\":\"#vip\",\"is_visible\":true,\"new_tab\":false,\"sort_order\":2},{\"id\":\"scalp\",\"label_en\":\"Scalp\",\"label_ar\":\"Scalp\",\"href\":\"#scalp\",\"is_visible\":true,\"new_tab\":false,\"sort_order\":3},{\"id\":\"courses\",\"label_en\":\"Courses\",\"label_ar\":\"الدورات التعليمية\",\"href\":\"#courses\",\"is_visible\":true,\"new_tab\":false,\"sort_order\":4},{\"id\":\"offers\",\"label_en\":\"Offers\",\"label_ar\":\"العروض\",\"href\":\"#offers\",\"is_visible\":true,\"new_tab\":false,\"sort_order\":5},{\"label_en\":\"ers\",\"label_ar\":\"ers\",\"href\":\"#ers\",\"is_visible\":true,\"new_tab\":false,\"sort_order\":6}]}',0,90,'2026-04-19 15:11:31'),(11,'footer','Footer','الفوتر',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'[]','{\"quick_links\":[{\"label_en\":\"Home\",\"label_ar\":\"الرئيسية\",\"href\":\"#home\",\"is_visible\":true,\"new_tab\":false,\"sort_order\":1},{\"label_en\":\"Funded Accounts\",\"label_ar\":\"الحسابات الممولة\",\"href\":\"#funded\",\"is_visible\":true,\"new_tab\":false,\"sort_order\":2},{\"label_en\":\"VIP\",\"label_ar\":\"VIP\",\"href\":\"#vip\",\"is_visible\":true,\"new_tab\":false,\"sort_order\":3},{\"label_en\":\"Offers\",\"label_ar\":\"العروض\",\"href\":\"#offers\",\"is_visible\":true,\"new_tab\":false,\"sort_order\":4}],\"legal_links\":[{\"label_en\":\"Privacy Policy\",\"label_ar\":\"سياسة الخصوصية\",\"href\":\"\\/privacy-policy\",\"is_visible\":true,\"new_tab\":false,\"sort_order\":1},{\"label_en\":\"Terms & Conditions\",\"label_ar\":\"الشروط والأحكام\",\"href\":\"\\/terms-and-conditions\",\"is_visible\":true,\"new_tab\":false,\"sort_order\":2},{\"label_en\":\"Risk Disclaimer\",\"label_ar\":\"إخلاء المسؤولية\",\"href\":\"\\/risk-disclaimer\",\"is_visible\":true,\"new_tab\":false,\"sort_order\":3}]}',0,91,'2026-04-19 15:01:44');
/*!40000 ALTER TABLE `section_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_faqs`
--

DROP TABLE IF EXISTS `service_faqs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `service_faqs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `service_id` int(11) NOT NULL,
  `question_en` varchar(255) NOT NULL,
  `question_ar` varchar(255) DEFAULT NULL,
  `answer_en` text DEFAULT NULL,
  `answer_ar` text DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `service_id` (`service_id`),
  CONSTRAINT `service_faqs_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_faqs`
--

LOCK TABLES `service_faqs` WRITE;
/*!40000 ALTER TABLE `service_faqs` DISABLE KEYS */;
/*!40000 ALTER TABLE `service_faqs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_features`
--

DROP TABLE IF EXISTS `service_features`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `service_features` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `service_id` int(11) NOT NULL,
  `label_en` varchar(255) NOT NULL,
  `label_ar` varchar(255) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `service_id` (`service_id`),
  CONSTRAINT `service_features_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_features`
--

LOCK TABLES `service_features` WRITE;
/*!40000 ALTER TABLE `service_features` DISABLE KEYS */;
INSERT INTO `service_features` VALUES (1,1,'Funded challenge package','باقة حساب ممول',1),(2,2,'Private recommendations','توصيات خاصة',1),(3,3,'Beginner to advanced course','كورس من البداية للاحتراف',1),(4,4,'Limited-time VIP offer','عرض VIP لفترة محدودة',1),(5,5,'Fast execution and broker onboarding','تنفيذ سريع وربط مباشر',1);
/*!40000 ALTER TABLE `service_features` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_media`
--

DROP TABLE IF EXISTS `service_media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `service_media` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `service_id` int(11) NOT NULL,
  `media_url` varchar(500) NOT NULL,
  `media_type` varchar(50) DEFAULT 'image',
  `alt_text_en` varchar(255) DEFAULT NULL,
  `alt_text_ar` varchar(255) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `service_id` (`service_id`),
  CONSTRAINT `service_media_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_media`
--

LOCK TABLES `service_media` WRITE;
/*!40000 ALTER TABLE `service_media` DISABLE KEYS */;
/*!40000 ALTER TABLE `service_media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_steps`
--

DROP TABLE IF EXISTS `service_steps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `service_steps` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `service_id` int(11) NOT NULL,
  `title_en` varchar(255) DEFAULT NULL,
  `title_ar` varchar(255) DEFAULT NULL,
  `description_en` text DEFAULT NULL,
  `description_ar` text DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `service_id` (`service_id`),
  CONSTRAINT `service_steps_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_steps`
--

LOCK TABLES `service_steps` WRITE;
/*!40000 ALTER TABLE `service_steps` DISABLE KEYS */;
/*!40000 ALTER TABLE `service_steps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(50) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `title_en` varchar(255) NOT NULL,
  `title_ar` varchar(255) NOT NULL,
  `subtitle_en` varchar(255) DEFAULT NULL,
  `subtitle_ar` varchar(255) DEFAULT NULL,
  `short_description_en` text DEFAULT NULL,
  `short_description_ar` text DEFAULT NULL,
  `full_description_en` longtext DEFAULT NULL,
  `full_description_ar` longtext DEFAULT NULL,
  `price` decimal(10,2) DEFAULT 0.00,
  `compare_price` decimal(10,2) DEFAULT NULL,
  `currency` varchar(10) DEFAULT 'USD',
  `cta_label_en` varchar(100) DEFAULT 'Buy Now',
  `cta_label_ar` varchar(100) DEFAULT 'اشتر الآن',
  `cta_url` varchar(500) DEFAULT NULL,
  `badge_text_en` varchar(100) DEFAULT NULL,
  `badge_text_ar` varchar(100) DEFAULT NULL,
  `thumbnail_url` varchar(500) DEFAULT NULL,
  `cover_url` varchar(500) DEFAULT NULL,
  `cover_media_type` enum('image','video','embed') DEFAULT 'image',
  `cover_video_poster_url` varchar(500) DEFAULT NULL,
  `card_media_type` enum('image','video','embed') DEFAULT 'image',
  `card_media_url` varchar(500) DEFAULT NULL,
  `card_video_poster_url` varchar(500) DEFAULT NULL,
  `card_video_autoplay` tinyint(1) DEFAULT 0,
  `card_video_muted` tinyint(1) DEFAULT 1,
  `card_video_loop` tinyint(1) DEFAULT 1,
  `offer_starts_at` datetime DEFAULT NULL,
  `offer_ends_at` datetime DEFAULT NULL,
  `cta_action` enum('checkout','details','external','referral','whatsapp','telegram') DEFAULT 'checkout',
  `referral_url` varchar(500) DEFAULT NULL,
  `broker_name` varchar(150) DEFAULT NULL,
  `broker_url` varchar(500) DEFAULT NULL,
  `terms_title_en` varchar(255) DEFAULT NULL,
  `terms_title_ar` varchar(255) DEFAULT NULL,
  `terms_content_en` longtext DEFAULT NULL,
  `terms_content_ar` longtext DEFAULT NULL,
  `risk_warning_en` text DEFAULT NULL,
  `risk_warning_ar` text DEFAULT NULL,
  `important_links_json` longtext DEFAULT NULL,
  `details_button_label_en` varchar(100) DEFAULT NULL,
  `details_button_label_ar` varchar(100) DEFAULT NULL,
  `final_cta_label_en` varchar(100) DEFAULT NULL,
  `final_cta_label_ar` varchar(100) DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT 0,
  `is_visible` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `metadata_json` longtext DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_services_type` (`type`),
  KEY `idx_services_visible` (`is_visible`),
  KEY `idx_services_offer_ends` (`offer_ends_at`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,'funded','funded-100k','Funded 100K','حساب ممول 100K',NULL,NULL,'Funded challenge package','باقة حساب ممول','Funded challenge package','باقة حساب ممول',100.00,NULL,'USD','Buy Now','اشتر الآن',NULL,'100K','100K',NULL,NULL,'image',NULL,'image',NULL,NULL,0,1,1,NULL,NULL,'checkout',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,1,0,NULL,'2026-04-19 14:22:38','2026-04-19 14:22:38'),(2,'vip','vip-monthly','VIP Monthly','VIP شهري',NULL,NULL,'Private recommendations','توصيات خاصة','Private recommendations','توصيات خاصة',69.00,NULL,'USD','Buy Now','اشتر الآن',NULL,'Popular','Popular',NULL,NULL,'image',NULL,'image',NULL,NULL,0,1,1,NULL,NULL,'checkout',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,1,0,NULL,'2026-04-19 14:22:38','2026-04-19 14:22:38'),(3,'courses','course-price-action','Price Action Course','كورس برايس أكشن',NULL,NULL,'Beginner to advanced course','كورس من البداية للاحتراف','Beginner to advanced course','كورس من البداية للاحتراف',149.00,NULL,'USD','Buy Now','اشتر الآن',NULL,'Course','Course',NULL,NULL,'image',NULL,'image',NULL,NULL,0,1,1,NULL,NULL,'checkout',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,1,0,NULL,'2026-04-19 14:22:38','2026-04-19 14:22:38'),(4,'offers','offer-vip-quarter','VIP Quarter Offer','عرض VIP ثلاثة شهور',NULL,NULL,'Limited-time VIP offer','عرض VIP لفترة محدودة','Limited-time VIP offer','عرض VIP لفترة محدودة',179.00,NULL,'USD','Buy Now','اشتر الآن',NULL,'Limited','Limited',NULL,NULL,'image',NULL,'image',NULL,NULL,0,1,1,NULL,NULL,'checkout',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,1,0,NULL,'2026-04-19 14:22:38','2026-04-19 14:22:38'),(5,'scalp','scalp-onboarding','Scalp Setup','خدمة سكالب',NULL,NULL,'Fast execution and broker onboarding','تنفيذ سريع وربط مباشر','Fast execution and broker onboarding','تنفيذ سريع وربط مباشر',0.00,NULL,'USD','Buy Now','اشتر الآن',NULL,'Scalp','Scalp',NULL,NULL,'image',NULL,'image',NULL,NULL,0,1,1,NULL,NULL,'checkout',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,1,0,NULL,'2026-04-19 14:22:38','2026-04-19 14:22:38');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_settings`
--

DROP TABLE IF EXISTS `site_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `site_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_settings`
--

LOCK TABLES `site_settings` WRITE;
/*!40000 ALTER TABLE `site_settings` DISABLE KEYS */;
INSERT INTO `site_settings` VALUES (1,'website_name','Hunter Trading','2026-04-02 18:40:38'),(2,'broker_referral_url','https://example.com/open-account','2026-04-18 22:17:57'),(3,'telegram_url','https://t.me/hunter_tradeing','2026-04-18 22:17:57'),(4,'free_telegram_url','https://t.me/hunter_tradeing','2026-04-18 22:17:57'),(5,'courses_page_url','https://example.com/courses','2026-04-02 18:40:38'),(6,'support_email','support@hunter_tradeing.com','2026-04-18 22:17:57'),(7,'location','Dubai, UAE','2026-04-18 22:17:57'),(8,'default_theme','dark','2026-04-02 18:41:05'),(25,'homepage_sections','[{\"id\":\"hero\",\"enabled\":true,\"order\":1},{\"id\":\"funded\",\"enabled\":true,\"order\":2},{\"id\":\"coach\",\"enabled\":true,\"order\":3},{\"id\":\"testimonials\",\"enabled\":false,\"order\":4},{\"id\":\"signals\",\"enabled\":true,\"order\":5},{\"id\":\"affiliate\",\"enabled\":true,\"order\":6},{\"id\":\"courses\",\"enabled\":true,\"order\":7},{\"id\":\"blog\",\"enabled\":true,\"order\":8}]','2026-04-18 21:43:45'),(26,'instagram_url','https://instagram.com/hunter_tradeing','2026-04-18 22:17:57'),(27,'youtube_url','https://youtube.com/@hunter_tradeing','2026-04-18 22:17:57'),(28,'tiktok_url','https://tiktok.com/@hunter_tradeing','2026-04-18 22:17:57'),(29,'facebook_url','https://facebook.com/hunter_tradeing','2026-04-18 22:17:57'),(30,'twitter_url','https://x.com/hunter_tradeing','2026-04-18 22:17:57'),(31,'whatsapp_url','https://wa.me/201000000000','2026-04-18 22:17:57'),(32,'privacy_policy_url','','2026-04-14 18:20:11'),(33,'terms_url','','2026-04-14 18:20:11'),(34,'risk_disclaimer_url','','2026-04-14 18:20:11'),(35,'primary_color','#0033ff','2026-04-19 15:04:08'),(36,'primary_color_strong','#c900cc','2026-04-19 15:04:32'),(37,'accent_blue','#0066ff','2026-04-14 18:20:11'),(38,'accent_orange','#ff6b35','2026-04-18 22:17:57'),(39,'accent_orange_strong','#ff8c42','2026-04-18 22:17:57'),(40,'background_dark','#0a0a0f','2026-04-14 18:20:11'),(41,'card_dark','#12121a','2026-04-14 18:20:11'),(42,'text_dark','#ffffff','2026-04-14 18:20:11'),(43,'text_muted_dark','#8a8a9a','2026-04-14 18:20:11'),(44,'privacy_policy_title','سياسة الخصوصية','2026-04-15 08:00:28'),(45,'privacy_policy_content','نحترم خصوصيتك ونتعامل مع بياناتك بحرص. قد نقوم بجمع بيانات مثل الاسم والبريد الإلكتروني ووسائل التواصل عند التسجيل أو التواصل معنا، ويتم استخدام هذه البيانات لتحسين الخدمة والتواصل معك وتقديم المحتوى المناسب. نحن لا نبيع بياناتك لأي طرف ثالث، وقد نستخدم مزودي خدمات موثوقين للمساعدة في تشغيل الموقع. باستخدامك للموقع فإنك توافق على هذه السياسة.','2026-04-15 08:00:28'),(46,'terms_title','الشروط والأحكام','2026-04-15 08:00:28'),(47,'terms_content','باستخدامك لهذا الموقع فأنت توافق على الالتزام بشروط الاستخدام. جميع المواد التعليمية والمعلومات المنشورة لأغراض تعليمية وإعلامية فقط، ولا تمثل نصيحة استثمارية مباشرة. يمنع إعادة نشر المحتوى أو نسخه دون إذن. يحق لإدارة الموقع تحديث المحتوى أو الخدمات أو الشروط في أي وقت.','2026-04-15 08:00:28'),(48,'risk_disclaimer_title','تحذير المخاطر','2026-04-15 08:00:28'),(49,'risk_disclaimer_content','التداول في الفوركس والأسهم والسلع والأدوات المالية ينطوي على مخاطر مرتفعة وقد لا يكون مناسبًا لجميع المستثمرين. يمكن أن تعمل الرافعة المالية لصالحك أو ضدك. يجب أن تتأكد من فهمك الكامل للمخاطر قبل اتخاذ أي قرار مالي، ولا تستثمر أموالًا لا يمكنك تحمل خسارتها.','2026-04-15 08:00:28'),(50,'footer_description','هانتر تريدنغ - طريقك إلى الحرية المالية من خلال تعليم التداول الخبير والاستراتيجيات المثبتة.','2026-04-15 08:00:28'),(51,'risk_warning_title','تحذير المخاطر','2026-04-15 08:00:28'),(52,'risk_warning_content','التداول في الفوركس والأسهم والسلع والأدوات المالية ينطوي على مخاطر مرتفعة وقد لا يكون مناسبًا لجميع المستثمرين. يمكن أن تعمل الرافعة المالية لصالحك أو ضدك. يجب أن تتأكد من فهمك الكامل للمخاطر قبل اتخاذ أي قرار مالي، ولا تستثمر أموالًا لا يمكنك تحمل خسارتها. هانتر تريدنج ليس مستشارًا ماليًا، وكل الإشارات والمحتوى التعليمي لأغراض معلوماتية فقط.','2026-04-15 08:00:28'),(53,'site_logo','/uploads/media/media_1776550677_69e403159fb34.webp','2026-04-18 22:17:57'),(54,'broker_gtc_url','https://example.com/gtc','2026-04-18 22:17:57'),(55,'instapay_number','','2026-04-19 15:04:08'),(56,'vodafone_cash_number','','2026-04-19 15:04:08');
/*!40000 ALTER TABLE `site_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `testimonials`
--

DROP TABLE IF EXISTS `testimonials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `testimonials` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `location` varchar(100) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `video_url` varchar(500) DEFAULT NULL,
  `content_en` text NOT NULL,
  `content_ar` text DEFAULT NULL,
  `rating` int(11) DEFAULT 5,
  `service_type` varchar(50) DEFAULT NULL,
  `service_id` int(11) DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT 0,
  `is_approved` tinyint(1) DEFAULT 1,
  `is_visible` tinyint(1) DEFAULT 1,
  `order_index` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testimonials`
--

LOCK TABLES `testimonials` WRITE;
/*!40000 ALTER TABLE `testimonials` DISABLE KEYS */;
INSERT INTO `testimonials` VALUES (1,'معاذ','مصر','/uploads/media/media_1776287988_69e000f47452e.png',NULL,'Hunter Trading completely changed my approach to forex. The structured courses and real-time signals helped me achieve consistent profits. I went from losing money to making $3,000+ monthly.','غيّر هانتر تريدنغ نهجتي تجاه الفوركس تماماً. ساعدتني الدورات المنظمة والإشارات الفورية على تحقيق أرباح ثابتة.',5,NULL,NULL,0,1,1,7,'2026-04-02 18:12:57'),(2,'Sarah K.','United Kingdom','/uploads/media/media_1776554095_69e4106f690c5.png',NULL,'The mentorship program is exceptional. Ahmed doesn\'t just teach strategies; he teaches you how to think like a professional trader. My win rate improved from 45% to 82% in just 3 months.','برنامج التوجيه استثنائي. أحمد لا يعلم الاستراتيجيات فحسب؛ بل يعلمك كيف تفكر كمتداول محترف. تحسن معدل ربحي من 45% إلى 82% في 3 أشهر فقط.',5,NULL,NULL,0,1,1,2,'2026-04-02 18:12:57'),(3,'John D.','United States','/uploads/media/media_1776550677_69e403159fb34.webp',NULL,'I\'ve tried many trading courses before, but Hunter Trading is different. The community support and the quality of education are unmatched. Best investment I\'ve made in my trading career.','جربت العديد من دورات التداول من قبل، لكن هانتر تريدنغ مختلفة. دعم المجتمع وجودية التعليم لا مثيل لهما.',5,NULL,NULL,0,1,1,3,'2026-04-02 18:12:57');
/*!40000 ALTER TABLE `testimonials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','moderator') DEFAULT 'moderator',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin@huntertrading.com','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','admin','2026-04-02 18:12:57');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-05 21:43:55
