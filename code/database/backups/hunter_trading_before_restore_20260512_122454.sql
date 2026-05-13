-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: 127.0.0.1    Database: hunter_trading
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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `affiliate_clicks`
--

LOCK TABLES `affiliate_clicks` WRITE;
/*!40000 ALTER TABLE `affiliate_clicks` DISABLE KEYS */;
INSERT INTO `affiliate_clicks` VALUES (1,'affiliate_broker_1','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36','2026-04-14 09:57:35'),(2,'affiliate_valtex','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36','2026-04-15 20:50:37'),(3,'affiliate_gtc','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36','2026-04-15 20:50:40'),(4,'affiliate_valtex','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36','2026-04-15 21:08:31'),(5,'affiliate_gtc','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36','2026-04-15 21:08:50'),(6,'affiliate_valtex','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36','2026-04-15 21:08:53'),(7,'affiliate_valtex','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36','2026-04-18 21:52:48'),(8,'affiliate_gtc','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36','2026-04-18 21:52:51'),(9,'affiliate_gtc','127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36','2026-04-18 21:52:54'),(10,'affiliate_valtex','154.178.217.180','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36','2026-04-19 00:27:42'),(11,'affiliate_gtc','154.178.217.180','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36','2026-04-19 00:27:45'),(12,'affiliate_gtc','154.178.217.180','Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36','2026-04-19 00:27:49'),(13,'affiliate_valtex','196.133.108.61','Mozilla/5.0 (iPhone; CPU iPhone OS 18_7_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/147.0.7727.99 Mobile/15E148 Safari/604.1','2026-04-19 00:54:13'),(14,'affiliate_gtc','196.133.108.61','Mozilla/5.0 (iPhone; CPU iPhone OS 18_7_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/147.0.7727.99 Mobile/15E148 Safari/604.1','2026-04-19 00:54:47'),(15,'affiliate_valtex','196.137.32.82','Mozilla/5.0 (Linux; Android 16; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.7727.55 Mobile Safari/537.36','2026-04-27 10:20:32'),(16,'affiliate_gtc','2a09:bac1:3940:1198::10e:91','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36','2026-04-27 11:17:22'),(17,'affiliate_gtc','2a09:bac5:1e8b:2414::398:45','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36','2026-04-28 18:27:23'),(18,'affiliate_gtc','2a09:bac5:1e8d:282::40:5e','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36','2026-04-28 18:33:02'),(19,'affiliate_valtex','2a09:bac5:1e8d:282::40:5e','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36','2026-04-28 18:33:11'),(20,'affiliate_gtc','197.37.91.187','Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6.2 Mobile/22G100 Safari/604.1','2026-04-30 22:07:11');
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
  `event_type` varchar(100) NOT NULL,
  `event_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`event_data`)),
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_event_type` (`event_type`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `analytics`
--

LOCK TABLES `analytics` WRITE;
/*!40000 ALTER TABLE `analytics` DISABLE KEYS */;
INSERT INTO `analytics` VALUES (1,'affiliate_click','{\"broker_id\":\"affiliate_broker_1\"}',NULL,NULL,'2026-04-14 09:57:35'),(2,'affiliate_click','{\"broker_id\":\"affiliate_valtex\"}',NULL,NULL,'2026-04-15 20:50:37'),(3,'affiliate_click','{\"broker_id\":\"affiliate_gtc\"}',NULL,NULL,'2026-04-15 20:50:40'),(4,'affiliate_click','{\"broker_id\":\"affiliate_valtex\"}',NULL,NULL,'2026-04-15 21:08:31'),(5,'affiliate_click','{\"broker_id\":\"affiliate_gtc\"}',NULL,NULL,'2026-04-15 21:08:50'),(6,'affiliate_click','{\"broker_id\":\"affiliate_valtex\"}',NULL,NULL,'2026-04-15 21:08:53'),(7,'affiliate_click','{\"broker_id\":\"affiliate_valtex\"}',NULL,NULL,'2026-04-18 21:52:48'),(8,'affiliate_click','{\"broker_id\":\"affiliate_gtc\"}',NULL,NULL,'2026-04-18 21:52:51'),(9,'affiliate_click','{\"broker_id\":\"affiliate_gtc\"}',NULL,NULL,'2026-04-18 21:52:54'),(10,'affiliate_click','{\"broker_id\":\"affiliate_valtex\"}',NULL,NULL,'2026-04-19 00:27:42'),(11,'affiliate_click','{\"broker_id\":\"affiliate_gtc\"}',NULL,NULL,'2026-04-19 00:27:45'),(12,'affiliate_click','{\"broker_id\":\"affiliate_gtc\"}',NULL,NULL,'2026-04-19 00:27:49'),(13,'affiliate_click','{\"broker_id\":\"affiliate_valtex\"}',NULL,NULL,'2026-04-19 00:54:13'),(14,'affiliate_click','{\"broker_id\":\"affiliate_gtc\"}',NULL,NULL,'2026-04-19 00:54:47'),(15,'affiliate_click','{\"broker_id\":\"affiliate_valtex\"}',NULL,NULL,'2026-04-27 10:20:32'),(16,'affiliate_click','{\"broker_id\":\"affiliate_gtc\"}',NULL,NULL,'2026-04-27 11:17:22'),(17,'affiliate_click','{\"broker_id\":\"affiliate_gtc\"}',NULL,NULL,'2026-04-28 18:27:23'),(18,'affiliate_click','{\"broker_id\":\"affiliate_gtc\"}',NULL,NULL,'2026-04-28 18:33:02'),(19,'affiliate_click','{\"broker_id\":\"affiliate_valtex\"}',NULL,NULL,'2026-04-28 18:33:11'),(20,'affiliate_click','{\"broker_id\":\"affiliate_gtc\"}',NULL,NULL,'2026-04-30 22:07:11');
/*!40000 ALTER TABLE `analytics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blog_posts`
--

DROP TABLE IF EXISTS `blog_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blog_posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title_en` varchar(255) NOT NULL,
  `title_ar` varchar(255) DEFAULT NULL,
  `content_en` text DEFAULT NULL,
  `content_ar` text DEFAULT NULL,
  `excerpt_en` varchar(500) DEFAULT NULL,
  `excerpt_ar` varchar(500) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `slug` varchar(255) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `read_time_minutes` int(11) DEFAULT 5,
  `published` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_posts`
--

LOCK TABLES `blog_posts` WRITE;
/*!40000 ALTER TABLE `blog_posts` DISABLE KEYS */;
INSERT INTO `blog_posts` VALUES (1,'ففقغ','قفغ',NULL,NULL,'قفلاقفثا','قثفغقثفغ','/uploads/media/media_1776240891_69df48fb213e1.png','65','',5,1,'2026-04-15 08:14:51'),(2,'Test Offer 1776284949','عرض تجريبي 1776284949','Test content en','تجربة المحتوى','Test excerpt en','تحربة الملخص',NULL,'test-offer-1776284949',NULL,5,1,'2026-04-15 20:29:09');
/*!40000 ALTER TABLE `blog_posts` ENABLE KEYS */;
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
INSERT INTO `coach_profile` VALUES (1,'Mezo Rostom','ميزو رستم','Trading Coach','مدرب تداول','After losing a large part of my money in my first year of trading, I understood that the market is not luck. I started learning seriously, learning from my mistakes, and over time I developed my strategy and started seeing better results. Now I help other traders shorten the road and avoid the same mistakes.\n\nThe journey was not easy. I tested many strategies, followed educational content, and learned from experienced traders, but the real difference started when I built my own approach step by step and strengthened my foundations.\n\nAfter that first difficult year, I kept testing, learning, and improving my execution until the process became clearer and more practical.','بعد ما خسرت جزء كبير من فلوسي في أول سنة تداول، فهمت إن السوق مش حظ. بدأت أتعلم بجد، وأتعلم من أخطائي، مع الوقت طورت استراتيجيتي وبدأت أحقق نتائج أحسن. دلوقتي بساعد متداولين تانين يختصروا الطريق ويتجنبوا نفس الأخطاء.\n\nالرحلة ما كانتش سهلة. جربت استراتيجيات كتير، تابعت محتوى تعليمي، واتعلمت من ناس خبرة في المجال، لكن الحقيقة إن مفيش حاجة بدأت تفرق معايا غير لما بدأت أبني أسلوبي الخاص خطوة بخطوة وأقوي أساسياتي.\n\nبعد ما خسرت جزء كبير من فلوسي في أول سنة تداول، فهمت إن السوق مش حظ. بدأت أتعلم بجد، أجرب، وأتعلم من أخطائي. مع الوقت طورت استراتيجيتي وبدأت أحقق نتائج أحسن. دلوقتي بساعد متداولين تانين يختصروا الطريق ويتجنبوا نفس الأخطاء.','/uploads/coach/coach_1777401897_69f10029a36ed.jpg',5,10000,'$1M',NULL,NULL,'https://t.me/MezoRostom','2026-05-12 08:02:58');
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
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coach_social_links`
--

LOCK TABLES `coach_social_links` WRITE;
/*!40000 ALTER TABLE `coach_social_links` DISABLE KEYS */;
INSERT INTO `coach_social_links` VALUES (5,'twitter','X / Twitter','https://x.com/huntertrading',5,0,'2026-04-18 20:22:00','2026-04-18 23:55:18'),(9,'custom','Tiktok','https://www.tiktok.com/@hunter_tradeing?_r=1&_t=ZS-95v74rH4gRJ',5,1,'2026-04-28 16:37:50','2026-04-28 16:39:32'),(22,'telegram','Telegram','https://t.me/MezoRostom',1,1,'2026-05-11 07:05:54','2026-05-11 07:05:54'),(23,'whatsapp','WhatsApp','https://wa.me/201000000000',2,1,'2026-05-11 07:05:54','2026-05-11 07:05:54'),(24,'instagram','Instagram','https://www.instagram.com/hunter_tradeing?igsh=MTVkdjZmZHA4MjExdQ==',3,1,'2026-05-11 07:05:54','2026-05-11 07:05:54'),(25,'youtube','YouTube','https://youtube.com/@hunter_tradeing',4,1,'2026-05-11 07:05:54','2026-05-11 07:05:54'),(26,'facebook','Facebook','https://www.facebook.com/share/1JxgBuyYV4/',5,1,'2026-05-11 07:05:54','2026-05-11 07:05:54'),(27,'tiktok','TikTok','https://www.tiktok.com/@hunter_tradeing?_r=1&_t=ZS-95eR5pPgPTB',6,1,'2026-05-11 07:05:54','2026-05-11 07:05:54');
/*!40000 ALTER TABLE `coach_social_links` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_enrollments`
--

DROP TABLE IF EXISTS `course_enrollments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `course_enrollments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `course_id` int(11) NOT NULL,
  `user_email` varchar(255) DEFAULT NULL,
  `enrolled_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `course_enrollments_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_enrollments`
--

LOCK TABLES `course_enrollments` WRITE;
/*!40000 ALTER TABLE `course_enrollments` DISABLE KEYS */;
/*!40000 ALTER TABLE `course_enrollments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `courses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title_en` varchar(255) NOT NULL,
  `title_ar` varchar(255) NOT NULL,
  `description_en` text DEFAULT NULL,
  `description_ar` text DEFAULT NULL,
  `level` enum('beginner','intermediate','advanced') NOT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `button_url` varchar(500) DEFAULT NULL,
  `course_url` varchar(500) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `digital_products`
--

DROP TABLE IF EXISTS `digital_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `digital_products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category` varchar(50) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `title_en` varchar(255) NOT NULL,
  `title_ar` varchar(255) NOT NULL,
  `description_en` text DEFAULT NULL,
  `description_ar` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT 0.00,
  `button_label_en` varchar(100) DEFAULT 'Buy Now',
  `button_label_ar` varchar(100) DEFAULT 'اشتري الآن',
  `badge_text_en` varchar(100) DEFAULT NULL,
  `badge_text_ar` varchar(100) DEFAULT NULL,
  `payment_redirect_url` varchar(500) DEFAULT NULL,
  `offer_expires_at` datetime DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_enabled` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `digital_products`
--

LOCK TABLES `digital_products` WRITE;
/*!40000 ALTER TABLE `digital_products` DISABLE KEYS */;
INSERT INTO `digital_products` VALUES (1,'vip','vip-1-month','VIP 1 Month','VIP شهر','Private VIP access for one month.','اشتراك VIP لمدة شهر.\nاستوب لا يتخطى 60 بيب \nاهداف سوينج',NULL,100.00,'Buy Now','اشتري الآن',NULL,NULL,NULL,NULL,1,1,'2026-04-18 21:48:00','2026-04-30 22:33:44'),(2,'vip','vip-2-months','VIP 2 Months','VIP شهرين','Private VIP access for two months.','اشتراك VIP لمدة شهرين.',NULL,200.00,'Buy Now','اشتري الآن',NULL,NULL,NULL,NULL,2,1,'2026-04-18 21:48:00','2026-04-18 21:48:00'),(3,'vip','vip-3-months','VIP 3 Months','VIP 3 شهور','Private VIP access for three months.','اشتراك VIP لمدة 3 شهور.',NULL,250.00,'Buy Now','اشتري الآن',NULL,NULL,NULL,NULL,3,1,'2026-04-18 21:48:00','2026-04-18 21:48:00'),(4,'vip','vip-6-months','VIP 6 Months','VIP 6 شهور','Private VIP access for six months.','اشتراك VIP لمدة 6 شهور.',NULL,500.00,'Buy Now','اشتري الآن',NULL,NULL,NULL,NULL,4,1,'2026-04-18 21:48:00','2026-04-18 21:48:00'),(5,'vip','vip-1-year','VIP 1 Year','VIP سنة','Private VIP access for one year.','اشتراك VIP لمدة سنة.',NULL,700.00,'Buy Now','اشتري الآن',NULL,NULL,NULL,NULL,5,1,'2026-04-18 21:48:00','2026-04-18 21:48:00'),(6,'vip','vip-lifetime','VIP Lifetime','VIP دائم','Lifetime access to the VIP group.','اشتراك VIP دائم.',NULL,1000.00,'Buy Now','اشتري الآن',NULL,NULL,NULL,NULL,6,1,'2026-04-18 21:48:00','2026-04-18 21:48:00'),(7,'funded','temp-funded-100k','Funded 50K Challenge','حساب ممول 50K','حساب ممول 25K','حساب ممول 100K\nتسليم سريع\nدعم ومتابعة','/uploads/media/media_1777417206_69f13bf6124bf.png',340.00,'Buy Now','اشتر الآن','حساب ممول 50K','حساب ممول 50K','https://t.me/MezoRostom',NULL,3,1,'2026-04-18 22:37:19','2026-04-28 23:01:19'),(9,'courses','temp-course-price-action','Price Action Bootcamp','دورة برايس أكشن','Price action foundations\\nRecorded lessons\\nTelegram follow-up','أساسيات البرايس أكشن\nدروس مسجلة\nمتابعة على تيليجرام',NULL,59.00,'Enroll Now','اشتر الآن','Starter','مبتدئ','https://t.me/hunter_tradeing',NULL,1,1,'2026-04-18 22:37:19','2026-04-18 22:39:57'),(10,'courses','temp-course-gold-scalp','Gold Scalping Masterclass','دورة سكالب الذهب','Gold scalping system\\nTemplates included\\nPrivate support','نظام سكالب الذهب\nقوالب جاهزة\nدعم خاص',NULL,129.00,'Enroll Now','اشتر الآن','Best Seller','الأكثر طلباً','https://t.me/hunter_tradeing',NULL,2,1,'2026-04-18 22:37:19','2026-04-18 22:39:57'),(11,'offers','huhi','VIP Monthly Offer','عرض VIP الشهري','','اشتراك VIP شهري\nخصم محدود\nقناة خاصة','/uploads/media/media_1777588575_69f3d95f6a806.png',70.00,'Get Offer','احصل على العرض','100→ 70','70→ 100','https://t.me/hunter_tradeing','2026-05-04 00:37:00',1,1,'2026-04-18 22:37:19','2026-04-30 22:48:00'),(12,'offers','temp-offer-vip-quarterly','VIP Quarterly Offer','عرض VIP ثلاثة شهور','Quarterly VIP offer\\nBetter value\\nFast activation','عرض VIP لثلاثة شهور\nقيمة أفضل\nتفعيل سريع',NULL,179.00,'Get Offer','احصل على العرض','Flash Sale','فلاش سيل','https://t.me/hunter_tradeing','2026-04-24 00:37:19',2,1,'2026-04-18 22:37:19','2026-04-18 22:39:57'),(14,'funded','abc','حساب ممول 10K','حساب ممول 10K','سحب سريع ','حساب فوري من دون اختبارات شروط بسيطه للحفاظ على حسابك\n','/uploads/media/media_1777417131_69f13bab40248.png',130.00,'Buy Now','اشتر الآن','حساب ممول 10K','حساب ممول 10K','https://t.me/MezoRostom',NULL,0,1,'2026-04-28 20:08:35','2026-04-28 23:02:35'),(17,'funded','abd','حساب ممول 25K','حساب ممول 25K','حساب فوري من دون اختبارات شروط بسيطه للحفاظ على حسابك\n','حساب فوري من دون اختبارات شروط بسيطه للحفاظ على حسابك\n','/uploads/media/media_1777417067_69f13b6b3664d.png',190.00,'Buy Now','اشتر الآن','حساب ممول 25K','حساب ممول 25K','https://t.me/MezoRostom',NULL,3,1,'2026-04-28 22:57:47','2026-04-28 23:02:27'),(29,'funded','jabc','حساب ممول 100K','حساب ممول 100K','حساب ممول 100K\nتسليم سريع\nدعم ومتابعة','حساب ممول 100K\nتسليم سريع\n','/uploads/media/media_1777467602_69f200d2d39c7.png',500.00,'Buy Now','اشتر الآن','حساب ممول 100K','حساب ممول 100K','https://t.me/MezoRostom','2026-04-29 15:48:00',5,1,'2026-04-29 13:00:03','2026-04-29 13:00:17'),(30,'funded','kkl','حساب ممول 200K','حساب ممول 200K','حساب ممول 100K\nتسليم سريع\nدعم ومتابعة','حساب ممول 100K\nتسليم سريع\nدعم ومتابعة','',900.00,'Buy Now','اشتر الآن','حساب ممول 200K','حساب ممول 200K','https://t.me/MezoRostom','2026-04-29 16:02:00',6,1,'2026-04-29 13:02:56','2026-04-29 13:02:56'),(31,'funded','awe','حساب ممول 300K','حساب ممول 300K','حساب ممول 100K\nتسليم سريع\nدعم ومتابعة','حساب ممول 100K','',1350.00,'Buy Now','اشتر الآن','حساب ممول 300K','حساب ممول 300K','https://t.me/MezoRostom','2026-04-29 16:04:00',7,1,'2026-04-29 13:04:25','2026-04-29 13:04:25'),(32,'funded','qrr','حساب ممول 400K','حساب ممول 400K','حساب ممول 100K\nتسليم سريع\nدعم ومتابعة','حساب ممول 100K\nتسليم سريع\nدعم ومتابعة','',1500.00,'Buy Now','اشتر الآن','حساب ممول 400K','حساب ممول 400K','https://t.me/MezoRostom','2026-04-29 16:06:00',8,1,'2026-04-29 13:06:48','2026-04-29 13:06:48');
/*!40000 ALTER TABLE `digital_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `home_content`
--

DROP TABLE IF EXISTS `home_content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `home_content` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `section` varchar(50) NOT NULL,
  `field` varchar(100) NOT NULL,
  `value` text DEFAULT NULL,
  `language` enum('en','ar') DEFAULT 'en',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_content` (`section`,`field`,`language`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `home_content`
--

LOCK TABLES `home_content` WRITE;
/*!40000 ALTER TABLE `home_content` DISABLE KEYS */;
INSERT INTO `home_content` VALUES (1,'hero','title','Master the Art of Trading','en'),(2,'hero','subtitle','Join thousands of successful traders who transformed their financial future with proven strategies and expert mentorship.','en'),(3,'coach','name','Moaz','en'),(4,'coach','bio','After losing $50,000 in my first year of trading, I decided to dedicate my life to mastering the markets.','en'),(6,'hero','cta_signals','العروض','ar'),(7,'hero','badge','إشارات تداول مباشرة','ar'),(8,'hero','cta_telegram','Join Telegram','en'),(9,'hero','cta_signals','Offers','en'),(10,'hero','badge','Live Trading Signals','en'),(11,'coach','bio_struggle','الرحلة لم تكن سهلة. جربت استراتيجيات كتير، وتعلمت من مصادر مختلفة، وكنت بدوّر على الطريقة الصح. لكن مفيش حاجة فرقت فعلاً غير لما بدأت أبني منهجي الخاص خطوة بخطوة، بطريقة تناسبني أنا.\n','ar'),(12,'coach','bio_struggle','The journey wasn\'t easy. I studied hundreds of strategies, attended seminars, and learned from the biggest names in trading. But nothing worked until I developed my own systematic approach.','en'),(13,'coach','section_title','قابل مدربك في التداول','ar'),(14,'hero','title_suffix','إرشاد احترافي','ar'),(15,'hero','title_suffix','Expert Guidance','en'),(16,'hero','cta_telegram','انضم لتيليجرام','ar'),(17,'coach','section_title','Meet Your Trading Coach','en'),(18,'coach','experience_label','Years of Experience','en'),(19,'coach','profit_label','أرباح تم تحقيقها','ar'),(20,'coach','students_label','Students Trained','en'),(21,'testimonials','video_label','Watch Video','en'),(22,'testimonials','title','ماذا يقول طلابنا','ar'),(23,'testimonials','subtitle','Don\'t just take our word for it. Here\'s what real traders have to say about their journey with Hunter Trading.','en'),(24,'coach','profit_label','Profits Generated','en'),(25,'coach','experience_label','سنوات من الخبرة','ar'),(26,'testimonials','cta_enabled','true','en'),(27,'testimonials','cta_label','Follow Our Clients Profits Here','en'),(28,'testimonials','video_label','شاهد الفيديو','ar'),(29,'testimonials','subtitle','لا تأخذ كلمتنا فقط. إليك ما يقوله متداولون حقيقيون عن رحلتهم مع هانتر تريدنغ.','ar'),(30,'testimonials','cta_label','تابع أرباح عملائنا من هنا','ar'),(31,'testimonials','cta_url','https://t.me/hunter_tradeing','ar'),(32,'testimonials','title','What Our Students Say','en'),(33,'testimonials','cta_enabled','true','ar'),(34,'blog','all_articles_label','كل المقالات','ar'),(35,'blog','all_articles_label','All Articles','en'),(36,'blog','subtitle','اكتشف أفضل العروض والخصومات الحصرية على كورساتنا وخدماتنا.','ar'),(37,'signals','live_subtitle','احصل على إشارات تداول فورية مباشرة على جهازك. دقة عالية، نتائج شفافة.','ar'),(38,'signals','join_telegram_label','Join Telegram','en'),(39,'blog','subtitle','Discover our latest exclusive offers and discounts on our services.','en'),(40,'testimonials','cta_url','https://t.me/hunter_tradeing','en'),(41,'affiliate','title','Scalp','en'),(42,'affiliate','subtitle','ابدأ التداول مجانا باستراتيجيات سكالبينج احترافية تركّز على حركات سريعة بهدف واضح، مقابل وقف خسارة صغير بين 10 إلى 30 نقطة.\n','ar'),(43,'affiliate','title','Scalp','ar'),(44,'signals','live_subtitle','Get real-time trading signals delivered directly to your device. High accuracy, transparent results.','en'),(45,'blog','title','Latest Offers','en'),(46,'affiliate','cta','Open Account','en'),(47,'affiliate','cta','فتح حساب','ar'),(48,'blog','title','أحدث العروض','ar'),(49,'affiliate','steps_title','How to Start','en'),(50,'coach','students_label','طالب تم تدريبهم','ar'),(51,'signals','join_telegram_label','انضم لتيليجرام','ar'),(52,'affiliate','subtitle','Start trading free with professional scalping strategies that focus on quick moves with a clear objective, in exchange for a small stop loss of between 10 and 30 points.','en'),(53,'affiliate','benefit_1','Low spreads from 0.3 pips','en'),(54,'affiliate','steps_title','كيف تبدأ','ar'),(55,'affiliate','benefit_1','فروق أسعار منخفضة من 0.3 نقطة','ar'),(56,'affiliate','benefit_2','Fast execution under 50ms','en'),(57,'affiliate','benefit_3','وسيط مرخص وآمن','ar'),(58,'affiliate','benefit_3','Secure regulated broker','en'),(59,'affiliate','benefit_2','تنفيذ سريع أقل من 50 مللي ثانية','ar'),(60,'affiliate','benefit_4','24/7 customer support','en'),(61,'affiliate','benefit_4','دعم عملاء على مدار الساعة','ar'),(62,'affiliate','step_2','سجل بياناتك','ar'),(63,'affiliate','step_2','Register with your details','en'),(64,'affiliate','step_1','Choose your preferred broker','en'),(65,'affiliate','step_1','اختر البروكر الذي تفضله','ar'),(66,'affiliate','step_3','Deposit $100 into your account','en'),(67,'affiliate','step_3','قم  بالايداع في حسابك 100$ ','ar'),(68,'affiliate','step_4','Contact me and let me know you\'ve registered so you can join our free Scalp channel.','en'),(69,'affiliate','step_4','تواصل معي واخبرني انك قمت بالتسجيل لكي تنضم معنا مجانا في قناه الاسكالب','ar');
/*!40000 ALTER TABLE `home_content` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leads`
--

LOCK TABLES `leads` WRITE;
/*!40000 ALTER TABLE `leads` DISABLE KEYS */;
INSERT INTO `leads` VALUES (7,'عميل مهتم بالحسابات الممولة','funded@clientpreview.local','01011111111','funded-section',1,'2026-05-11 07:05:54'),(8,'عميل مهتم بالـ VIP','vip@clientpreview.local','01022222222','vip-section',1,'2026-05-11 07:05:54'),(9,'عميل مهتم بالسكالب','scalp@clientpreview.local','01033333333','scalp-section',0,'2026-05-11 07:05:54');
/*!40000 ALTER TABLE `leads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lessons`
--

DROP TABLE IF EXISTS `lessons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lessons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `course_id` int(11) NOT NULL,
  `title_en` varchar(255) NOT NULL,
  `title_ar` varchar(255) NOT NULL,
  `description_en` text DEFAULT NULL,
  `description_ar` text DEFAULT NULL,
  `video_url` varchar(500) DEFAULT NULL,
  `pdf_url` varchar(500) DEFAULT NULL,
  `order_index` int(11) DEFAULT 0,
  `duration_minutes` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `lessons_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lessons`
--

LOCK TABLES `lessons` WRITE;
/*!40000 ALTER TABLE `lessons` DISABLE KEYS */;
/*!40000 ALTER TABLE `lessons` ENABLE KEYS */;
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
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `market_updates`
--

LOCK TABLES `market_updates` WRITE;
/*!40000 ALTER TABLE `market_updates` DISABLE KEYS */;
INSERT INTO `market_updates` VALUES (1,'Gold intraday momentum watch','متابعة زخم الذهب اليومية','Watch price reaction around the nearest liquidity zone before entries.','تابع تفاعل السعر مع أقرب منطقة سيولة قبل الدخول.','Managed market updates now live in one source with ordering, visibility, and pinning.','تحديثات السوق الآن في نظام واحد مع ترتيب وإظهار وتثبيت.','analysis',NULL,'Hunter Trading',NULL,0,0,1,1,'2026-05-05 18:38:00','2026-05-05 18:38:19','2026-05-12 03:59:41'),(6,'Client Preview: Gold Watch','معاينة العميل: متابعة الذهب','Gold is near a key liquidity area. Wait for confirmation before execution.','الذهب قريب من منطقة سيولة مهمة. انتظر تأكيد قبل التنفيذ.','Short educational note for public preview data.','ملاحظة تعليمية قصيرة لبيانات المعاينة.','analysis','/uploads/media/media_1777590531_69f3e103a2edd.jpg',NULL,NULL,0,0,1,0,'2026-05-11 10:05:00','2026-05-11 07:05:54','2026-05-12 02:18:49'),(7,'Client Preview: Risk Note','معاينة العميل: ملاحظة مخاطرة','Keep risk fixed and avoid moving stop loss during fast sessions.','ثبّت المخاطرة وتجنب تحريك وقف الخسارة أثناء الجلسات السريعة.','Short risk reminder for visitors.','تذكير قصير بإدارة المخاطر للزوار.','risk','/uploads/media/media_1776287988_69e000f47452e.png',NULL,NULL,0,0,1,0,'2026-05-11 10:05:54','2026-05-11 07:05:54','2026-05-11 07:05:54');
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
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media`
--

LOCK TABLES `media` WRITE;
/*!40000 ALTER TABLE `media` DISABLE KEYS */;
INSERT INTO `media` VALUES (2,'تصميم بدون عنوان.png','/uploads/media/media_1776239709_69df445d3b062.png','image/png',470075,NULL,'2026-04-15 07:55:09'),(3,'Gemini_Generated_Image_sck0q4sck0q4sck0.png','/uploads/media/media_1776239722_69df446ad698c.png','image/png',8093743,NULL,'2026-04-15 07:55:22'),(6,'Secret T.R. (1).png','/uploads/media/media_1776240891_69df48fb213e1.png','image/png',614796,NULL,'2026-04-15 08:14:51'),(9,'Screenshot 2025-08-21 153804.png','/uploads/media/media_1776287988_69e000f47452e.png','image/png',35159,NULL,'2026-04-15 21:19:48'),(12,'573598294_904233272123835_5638616923923601732_n.png','/uploads/media/media_1776554090_69e4106a0ff36.png','image/png',43271,NULL,'2026-04-18 23:14:50');
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
  `service_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_product_id` (`product_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_orders`
--

LOCK TABLES `payment_orders` WRITE;
/*!40000 ALTER TABLE `payment_orders` DISABLE KEYS */;
INSERT INTO `payment_orders` VALUES (1,1,'شس','ahmed@gmail.com','010955','vodafone_cash',100.00,NULL,'pending','https://t.me/huntertrading',NULL,NULL,NULL,'2026-04-18 21:49:09','2026-04-18 21:49:09',NULL),(8,2,'عميل دفع قيد المراجعة','pending@clientpreview.local','01044444444','vodafone_cash',1200.00,'/uploads/media/media_1776239709_69df445d3b062.png','pending',NULL,'طلب تجريبي للمراجعة',NULL,NULL,'2026-05-11 07:05:54','2026-05-11 07:05:54',2),(9,3,'عميل تم تأكيده','approved@clientpreview.local','01055555555','instapay',1800.00,'/uploads/media/media_1776239722_69df446ad698c.png','verified','/services/course-price-action','تم التأكيد تجريبيًا',NULL,NULL,'2026-05-11 07:05:54','2026-05-11 07:05:54',3),(10,1,'عميل يحتاج متابعة','review@clientpreview.local','01066666666','bank_transfer',2500.00,'/uploads/media/media_1776240129_69df46010cef8.png','pending',NULL,'تأكد من بيانات التحويل',NULL,NULL,'2026-05-11 07:05:54','2026-05-11 07:05:54',1);
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
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `section_key` (`section_key`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `section_settings`
--

LOCK TABLES `section_settings` WRITE;
/*!40000 ALTER TABLE `section_settings` DISABLE KEYS */;
INSERT INTO `section_settings` VALUES (1,'hero','Trade with structure, not noiseشششششششششششش','تداول بخطة واضحة وليس بعشوائية','Funded accounts, VIP guidance, scalp broker onboarding, offers, and practical trading courses.','حسابات ممولة، متابعة VIP، سكالب عبر منصات موثوقة، عروض، ودورات تداول عملية.','Choose the path that fits your experience level and follow a clear journey from learning to execution.','اختار المسار المناسب لمستواك واتحرك بخطوات واضحة من التعلم للتنفيذ.','Explore services','استكشف الخدمات','#funded','View Services','اعرض الخدمات',NULL,NULL,'[{\"label_en\":\"Students\",\"label_ar\":\"متدرب\",\"value\":\"1500+\"},{\"label_en\":\"Experience\",\"label_ar\":\"خبرة\",\"value\":\"6+ سنوات\"},{\"label_en\":\"Support\",\"label_ar\":\"دعم\",\"value\":\"24\\/7\"}]','{\"hero_video_url\":\"https:\\/\\/gtcfx-bucket.s3.ap-southeast-1.amazonaws.com\\/videos\\/overlay-gtcfx.mp4\",\"hero_mobile_video_url\":\"https:\\/\\/gtcfx-bucket.s3.ap-southeast-1.amazonaws.com\\/videos\\/overlay-gtcfx.mp4\",\"hero_video_poster_url\":\"\",\"hero_fallback_image_url\":\"https:\\/\\/www.youtube.com\\/shorts\\/a3kkKfir-y8\",\"hero_video_autoplay\":true,\"hero_video_muted\":true,\"hero_video_loop\":true,\"hero_video_controls\":false,\"hero_overlay_strength\":10,\"hero_mobile_overlay_strength\":13}',1,1,'2026-05-12 09:22:10'),(2,'funded','Funded Accounts','الحسابات الممولة','Choose a funded account path with clear rules, steps, and support.','اختار مسار الحساب الممول بقواعد واضحة وخطوات متابعة منظمة.','','','View funded accounts','شوف الحسابات الممولة','#funded',NULL,NULL,NULL,NULL,'[]','[]',1,3,'2026-05-12 05:59:51'),(3,'vip','VIP Trading','VIP','Daily follow-up, educational ideas, and structured trade planning.','متابعة يومية وأفكار تعليمية وخطة تداول منظمة.','','','Join VIP','اشترك الآن','#vip',NULL,NULL,NULL,NULL,'[]','[]',1,4,'2026-05-12 05:59:47'),(4,'scalp','Scalp Platforms','السكالب','Open a broker account through the referral links after reading the details and terms.','افتح حساب على المنصات من روابط الريفرال بعد قراءة الشرح والشروط.','','','View scalp details','عرض الشرح','#scalp',NULL,NULL,NULL,NULL,'[]','[]',1,5,'2026-05-12 05:59:43'),(5,'courses','Courses','الدورات','Practical courses for price action, risk management, and execution discipline.','دورات عملية في البرايس أكشن وإدارة المخاطر والانضباط في التنفيذ.','','','Browse courses','تصفح الدورات','#courses',NULL,NULL,NULL,NULL,'[]','[]',1,6,'2026-05-12 05:59:40'),(6,'offers','Offers','العروض','Limited offers for VIP, funded account preparation, and learning bundles.','عروض محدودة للـ VIP وتجهيز الحسابات الممولة وباقات التعلم.','','','See offers','شوف العروض','#offers',NULL,NULL,NULL,NULL,'[]','[]',1,7,'2026-05-12 05:59:37'),(7,'testimonials','Client Feedback','آراء العملاء','Real feedback from clients who used the website services.','آراء عملاء استخدموا خدمات الموقع.','','','','','',NULL,NULL,NULL,NULL,'[]','[]',1,8,'2026-05-12 01:24:12'),(8,'market','Market Updates','متابعة السوق','Short updates and useful market notes.','تحديثات مختصرة وملاحظات مهمة عن السوق.','','','','','',NULL,NULL,NULL,NULL,'[]','[]',1,9,'2026-05-12 01:24:12'),(9,'coach','Coach','المدرب','Follow the coach updates and official social channels from one trusted place.','تابع تحديثات المدرب وروابط السوشيال الرسمية من مكان واحد.','','','Contact us','تواصل معنا','#coach',NULL,NULL,NULL,NULL,'[]','[]',1,2,'2026-05-12 08:02:58'),(10,'navigation','Navigation','القائمة','','','','','','','',NULL,NULL,NULL,NULL,'[]','{\"menu_items\":[{\"label_en\":\"Home\",\"label_ar\":\"الرئيسية\",\"href\":\"#home\",\"sort_order\":1},{\"label_en\":\"Funded\",\"label_ar\":\"الحسابات الممولة\",\"href\":\"#funded\",\"sort_order\":2},{\"label_en\":\"Scalp\",\"label_ar\":\"Scalp\",\"href\":\"#scalp\",\"sort_order\":3},{\"label_en\":\"VIP\",\"label_ar\":\"VIP\",\"href\":\"#vip\",\"sort_order\":4},{\"label_en\":\"Offers\",\"label_ar\":\"العروض\",\"href\":\"#offers\",\"sort_order\":5},{\"label_en\":\"Courses\",\"label_ar\":\"الدورات\",\"href\":\"#courses\",\"sort_order\":6}]}',0,0,'2026-05-11 07:05:54'),(11,'footer','Footer','الفوتر','','','','','','','',NULL,NULL,NULL,NULL,'[]','{\"quick_links\":[{\"label_en\":\"Funded Accounts\",\"label_ar\":\"الحسابات الممولة\",\"href\":\"#funded\"},{\"label_en\":\"VIP\",\"label_ar\":\"VIP\",\"href\":\"#vip\"},{\"label_en\":\"Scalp\",\"label_ar\":\"Scalp\",\"href\":\"#scalp\"},{\"label_en\":\"Offers\",\"label_ar\":\"العروض\",\"href\":\"#offers\"},{\"label_en\":\"Courses\",\"label_ar\":\"الدورات\",\"href\":\"#courses\"}],\"legal_links\":[]}',1,10,'2026-05-12 09:19:20'),(23,'navbar','Navigation','القائمة','','','','','','','',NULL,NULL,NULL,NULL,'[]','{\"items\":[{\"label_en\":\"Home\",\"label_ar\":\"الرئيسية\",\"href\":\"#home\"},{\"label_en\":\"Funded\",\"label_ar\":\"الحسابات الممولة\",\"href\":\"#funded\"},{\"label_en\":\"Scalp\",\"label_ar\":\"Scalp\",\"href\":\"#scalp\"},{\"label_en\":\"VIP\",\"label_ar\":\"VIP\",\"href\":\"#vip\"},{\"label_en\":\"Offers\",\"label_ar\":\"العروض\",\"href\":\"#offers\"},{\"label_en\":\"Courses\",\"label_ar\":\"الدورات\",\"href\":\"#courses\"}]}',0,0,'2026-05-11 07:02:08');
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
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_faqs`
--

LOCK TABLES `service_faqs` WRITE;
/*!40000 ALTER TABLE `service_faqs` DISABLE KEYS */;
INSERT INTO `service_faqs` VALUES (46,3,'Is profit guaranteed?','هل الربح مضمون؟','No. Trading results are never guaranteed.','لا. نتائج التداول غير مضمونة.',1),(47,22,'Is profit guaranteed?','هل الربح مضمون؟','No. Trading results are never guaranteed.','لا. نتائج التداول غير مضمونة.',1),(48,1,'Is profit guaranteed?','هل الربح مضمون؟','No. Trading results are never guaranteed.','لا. نتائج التداول غير مضمونة.',1),(49,18,'Is profit guaranteed?','هل الربح مضمون؟','No. Trading results are never guaranteed.','لا. نتائج التداول غير مضمونة.',1),(50,17,'Is profit guaranteed?','هل الربح مضمون؟','No. Trading results are never guaranteed.','لا. نتائج التداول غير مضمونة.',1),(51,23,'Is profit guaranteed?','هل الربح مضمون؟','No. Trading results are never guaranteed.','لا. نتائج التداول غير مضمونة.',1),(52,4,'Is profit guaranteed?','هل الربح مضمون؟','No. Trading results are never guaranteed.','لا. نتائج التداول غير مضمونة.',1),(53,2,'Is profit guaranteed?','هل الربح مضمون؟','No. Trading results are never guaranteed.','لا. نتائج التداول غير مضمونة.',1),(54,19,'Is profit guaranteed?','هل الربح مضمون؟','No. Trading results are never guaranteed.','لا. نتائج التداول غير مضمونة.',1),(61,20,'Do I pay inside the website?','هل أدفع داخل الموقع؟','No. This scalp page is only a guide and referral links; no payment is collected inside the website.','لا. السكالب هنا شرح وروابط ريفيرال فقط، ولا يوجد تحصيل دفع من العميل داخل الموقع.',1),(62,21,'Do I pay inside the website?','هل أدفع داخل الموقع؟','No. This scalp page is only a guide and referral links; no payment is collected inside the website.','لا. السكالب هنا شرح وروابط ريفيرال فقط، ولا يوجد تحصيل دفع من العميل داخل الموقع.',1);
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
) ENGINE=InnoDB AUTO_INCREMENT=138 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_features`
--

LOCK TABLES `service_features` WRITE;
/*!40000 ALTER TABLE `service_features` DISABLE KEYS */;
INSERT INTO `service_features` VALUES (5,5,'Fast execution and broker onboarding','تنفيذ سريع وربط مباشر',1),(99,1,'Clear rules checklist','تشيك ليست قواعد واضحة',1),(100,18,'Clear rules checklist','تشيك ليست قواعد واضحة',1),(101,17,'Clear rules checklist','تشيك ليست قواعد واضحة',1),(102,1,'Risk planning support','دعم في خطة المخاطرة',2),(103,18,'Risk planning support','دعم في خطة المخاطرة',2),(104,17,'Risk planning support','دعم في خطة المخاطرة',2),(105,2,'Daily market notes','ملاحظات سوق يومية',1),(106,19,'Daily market notes','ملاحظات سوق يومية',1),(107,2,'Priority support','دعم أولوية',2),(108,19,'Priority support','دعم أولوية',2),(113,3,'Practical lessons','دروس عملية',1),(114,22,'Practical lessons','دروس عملية',1),(115,3,'Lifetime notes access','وصول دائم للملاحظات',2),(116,22,'Lifetime notes access','وصول دائم للملاحظات',2),(117,23,'Limited price','سعر محدود',1),(118,4,'Limited price','سعر محدود',1),(119,23,'Fast activation after review','تفعيل سريع بعد المراجعة',2),(120,4,'Fast activation after review','تفعيل سريع بعد المراجعة',2),(130,20,'No payment inside the website','لا يوجد دفع داخل الموقع',1),(131,20,'Open through the official referral link','فتح الحساب من رابط الريفيرال الرسمي',2),(132,20,'Review platform terms before depositing','راجع شروط المنصة قبل الإيداع',3),(133,20,'Follow up through Telegram','تواصل عبر تليجرام للمتابعة',4),(134,21,'No payment inside the website','لا يوجد دفع داخل الموقع',1),(135,21,'Open through the official referral link','فتح الحساب من رابط الريفيرال الرسمي',2),(136,21,'Review platform terms before depositing','راجع شروط المنصة قبل الإيداع',3),(137,21,'Follow up through Telegram','تواصل عبر تليجرام للمتابعة',4);
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
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_media`
--

LOCK TABLES `service_media` WRITE;
/*!40000 ALTER TABLE `service_media` DISABLE KEYS */;
INSERT INTO `service_media` VALUES (46,1,'/uploads/media/media_1776239722_69df446ad698c.png','image','Funded 100K Pro','حساب ممول 100K برو',1),(47,2,'/uploads/media/media_1776240891_69df48fb213e1.png','image','VIP Monthly','VIP شهري',1),(48,3,'/uploads/media/media_1776239722_69df446ad698c.png','image','Price Action Course','دورة البرايس أكشن',1),(49,4,'/uploads/media/media_1776240891_69df48fb213e1.png','image','VIP Quarterly Offer','عرض VIP ربع سنوي',1),(50,17,'/uploads/media/media_1776239709_69df445d3b062.png','image','Funded 50K Starter','حساب ممول 50K',1),(51,18,'/uploads/media/media_1776240129_69df46010cef8.png','image','Funded 200K Elite','حساب ممول 200K Elite',1),(52,19,'/uploads/media/media_1776263302_69dfa08673062.webp','image','VIP Quarterly','VIP ربع سنوي',1),(55,22,'/uploads/media/media_1776240129_69df46010cef8.png','image','Risk Management Course','دورة إدارة المخاطر',1),(56,23,'/uploads/media/media_1776263302_69dfa08673062.webp','image','Funded Preparation Bundle','باقة تجهيز الحسابات الممولة',1);
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
) ENGINE=InnoDB AUTO_INCREMENT=131 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_steps`
--

LOCK TABLES `service_steps` WRITE;
/*!40000 ALTER TABLE `service_steps` DISABLE KEYS */;
INSERT INTO `service_steps` VALUES (94,3,'Read the details','اقرأ التفاصيل','Review service terms and decide if it fits your needs.','راجع شروط الخدمة وحدد هل تناسبك أم لا.',1),(95,22,'Read the details','اقرأ التفاصيل','Review service terms and decide if it fits your needs.','راجع شروط الخدمة وحدد هل تناسبك أم لا.',1),(96,1,'Read the details','اقرأ التفاصيل','Review service terms and decide if it fits your needs.','راجع شروط الخدمة وحدد هل تناسبك أم لا.',1),(97,18,'Read the details','اقرأ التفاصيل','Review service terms and decide if it fits your needs.','راجع شروط الخدمة وحدد هل تناسبك أم لا.',1),(98,17,'Read the details','اقرأ التفاصيل','Review service terms and decide if it fits your needs.','راجع شروط الخدمة وحدد هل تناسبك أم لا.',1),(99,23,'Read the details','اقرأ التفاصيل','Review service terms and decide if it fits your needs.','راجع شروط الخدمة وحدد هل تناسبك أم لا.',1),(100,4,'Read the details','اقرأ التفاصيل','Review service terms and decide if it fits your needs.','راجع شروط الخدمة وحدد هل تناسبك أم لا.',1),(101,2,'Read the details','اقرأ التفاصيل','Review service terms and decide if it fits your needs.','راجع شروط الخدمة وحدد هل تناسبك أم لا.',1),(102,19,'Read the details','اقرأ التفاصيل','Review service terms and decide if it fits your needs.','راجع شروط الخدمة وحدد هل تناسبك أم لا.',1),(103,3,'Complete checkout','أكمل الطلب','Send your payment data and screenshot for verification.','أرسل بيانات الدفع وصورة التحويل للمراجعة.',2),(104,22,'Complete checkout','أكمل الطلب','Send your payment data and screenshot for verification.','أرسل بيانات الدفع وصورة التحويل للمراجعة.',2),(105,1,'Complete checkout','أكمل الطلب','Send your payment data and screenshot for verification.','أرسل بيانات الدفع وصورة التحويل للمراجعة.',2),(106,18,'Complete checkout','أكمل الطلب','Send your payment data and screenshot for verification.','أرسل بيانات الدفع وصورة التحويل للمراجعة.',2),(107,17,'Complete checkout','أكمل الطلب','Send your payment data and screenshot for verification.','أرسل بيانات الدفع وصورة التحويل للمراجعة.',2),(108,23,'Complete checkout','أكمل الطلب','Send your payment data and screenshot for verification.','أرسل بيانات الدفع وصورة التحويل للمراجعة.',2),(109,4,'Complete checkout','أكمل الطلب','Send your payment data and screenshot for verification.','أرسل بيانات الدفع وصورة التحويل للمراجعة.',2),(110,2,'Complete checkout','أكمل الطلب','Send your payment data and screenshot for verification.','أرسل بيانات الدفع وصورة التحويل للمراجعة.',2),(111,19,'Complete checkout','أكمل الطلب','Send your payment data and screenshot for verification.','أرسل بيانات الدفع وصورة التحويل للمراجعة.',2),(125,20,'Review the GTC guide','راجع شرح GTC','Read the key notes and risk warning before using the referral link.','اقرأ النقاط المهمة والمخاطر قبل الضغط على رابط الريفيرال.',1),(126,20,'Open the account from the link','افتح الحساب من الرابط','Use the referral button below only after understanding the terms.','استخدم زر الريفيرال الظاهر أسفل الصفحة فقط بعد فهم الشروط.',2),(127,20,'Join Telegram if needed','انضم للتليجرام عند الحاجة','If Telegram is enabled, use it for follow-up or extra details.','لو زر التليجرام مفعّل، استخدمه للمتابعة أو طلب تفاصيل إضافية.',3),(128,21,'Review the Valtex guide','راجع شرح Valtex','Read the key notes and risk warning before using the referral link.','اقرأ النقاط المهمة والمخاطر قبل الضغط على رابط الريفيرال.',1),(129,21,'Open the account from the link','افتح الحساب من الرابط','Use the referral button below only after understanding the terms.','استخدم زر الريفيرال الظاهر أسفل الصفحة فقط بعد فهم الشروط.',2),(130,21,'Join Telegram if needed','انضم للتليجرام عند الحاجة','If Telegram is enabled, use it for follow-up or extra details.','لو زر التليجرام مفعّل، استخدمه للمتابعة أو طلب تفاصيل إضافية.',3);
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
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_services_type` (`type`),
  KEY `idx_services_visible` (`is_visible`),
  KEY `idx_services_offer_ends` (`offer_ends_at`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,'funded','funded-100k','Funded 100K Pro','حساب ممول 100K برو','Advanced preparation for larger funded accounts.','تجهيز متقدم للحسابات الممولة الأكبر.','A structured path for serious funded-account applicants.','مسار منظم للمتقدمين الجادين للحسابات الممولة.','Includes account rules, drawdown planning, trading checklist, and support through the preparation period.','يشمل قواعد الحساب، خطة السحب، تشيك ليست التداول، ومتابعة خلال فترة التجهيز.',2500.00,3200.00,'EGP','Start checkout','ابدأ الطلب',NULL,'Popular','الأكثر طلبًا','/uploads/media/media_1776239722_69df446ad698c.png','/uploads/media/media_1776239722_69df446ad698c.png','image',NULL,'image','/uploads/media/media_1776239722_69df446ad698c.png',NULL,0,1,1,NULL,NULL,'checkout',NULL,NULL,NULL,'Service terms','شروط الخدمة','The client must follow risk rules and confirm all account conditions before applying.','يلتزم العميل بقواعد المخاطرة والتأكد من شروط الحساب قبل التقديم.','No result is guaranteed.','لا يوجد ضمان للنتائج.','[]','Details','التفاصيل','Complete order','إتمام الطلب',1,1,2,NULL,'2026-05-05 18:38:19','2026-05-11 07:05:54'),(2,'vip','vip-monthly','VIP Monthly','VIP شهري','Monthly VIP follow-up and trading guidance.','متابعة VIP شهرية وإرشاد تداول.','Daily ideas, market notes, and disciplined follow-up.','أفكار يومية وملاحظات سوق ومتابعة منضبطة.','A monthly VIP service for clients who want structured trade ideas, education notes, and support.','خدمة VIP شهرية للعملاء الباحثين عن أفكار منظمة وملاحظات تعليمية ومتابعة.',1200.00,1500.00,'EGP','Subscribe now','اشترك الآن',NULL,'Popular','الأكثر طلبًا','/uploads/media/media_1776240891_69df48fb213e1.png','/uploads/media/media_1776240891_69df48fb213e1.png','image',NULL,'image','/uploads/media/media_1776240891_69df48fb213e1.png',NULL,0,1,1,NULL,NULL,'checkout',NULL,NULL,NULL,'VIP terms','شروط VIP','VIP content is educational and should not be treated as guaranteed profit.','محتوى VIP تعليمي ولا يعتبر ضمانًا للربح.','Signals and market ideas involve risk.','الأفكار والإشارات بها مخاطر.','[]','Details','التفاصيل','Subscribe','اشترك',1,1,1,NULL,'2026-05-05 18:38:19','2026-05-11 07:05:54'),(3,'courses','course-price-action','Price Action Course','دورة البرايس أكشن','Learn market structure, entries, and risk planning.','اتعلم هيكل السوق والدخول وإدارة المخاطر.','Practical lessons for clean execution.','دروس عملية لتنفيذ أوضح.','A practical course focused on price action, market structure, risk planning, and trade review.','دورة عملية تركز على البرايس أكشن، هيكل السوق، إدارة المخاطر، ومراجعة الصفقات.',1800.00,2500.00,'EGP','Enroll now','اشترك الآن',NULL,'Course','دورة','/uploads/media/media_1776239722_69df446ad698c.png','/uploads/media/media_1776239722_69df446ad698c.png','image',NULL,'image','/uploads/media/media_1776239722_69df446ad698c.png',NULL,0,1,1,NULL,NULL,'checkout',NULL,NULL,NULL,'Course terms','شروط الدورة','Access is sent after payment verification.','يتم إرسال الوصول بعد التأكد من الدفع.','Educational content does not guarantee trading results.','المحتوى التعليمي لا يضمن نتائج التداول.','[]','Details','التفاصيل','Enroll','اشترك',1,1,1,NULL,'2026-05-05 18:38:19','2026-05-11 07:05:54'),(4,'offers','offer-vip-quarter','VIP Quarterly Offer','عرض VIP ربع سنوي','Quarterly VIP access with a limited discount.','اشتراك VIP ربع سنوي بخصم محدود.','Best value for clients who want consistent follow-up.','أفضل قيمة لمن يريد متابعة مستمرة.','A limited-time offer for three months of VIP access, including market notes and support.','عرض لفترة محدودة على اشتراك VIP لمدة ثلاثة أشهر يشمل ملاحظات سوق ودعم.',2600.00,3600.00,'EGP','Get offer','احصل على العرض',NULL,'Limited','لفترة محدودة','/uploads/media/media_1776240891_69df48fb213e1.png','/uploads/media/media_1776240891_69df48fb213e1.png','image',NULL,'image','/uploads/media/media_1776240891_69df48fb213e1.png',NULL,0,1,1,'2026-05-01 00:00:00','2026-08-31 23:59:59','checkout',NULL,NULL,NULL,'Offer terms','شروط العرض','Offer price is available until the end date or while capacity is available.','سعر العرض متاح حتى تاريخ الانتهاء أو نفاد الأماكن.','VIP remains educational and risk-based.','VIP محتوى تعليمي وتوجد مخاطر.','[]','Details','التفاصيل','Get offer','احصل على العرض',1,1,1,NULL,'2026-05-05 18:38:19','2026-05-11 07:05:54'),(5,'scalp','scalp-onboarding','Scalp Setup','خدمة سكالب',NULL,NULL,'Fast execution and broker onboarding','تنفيذ سريع وربط مباشر','Fast execution and broker onboarding','تنفيذ سريع وربط مباشر',0.00,NULL,'USD','Choose Platform','اختار المنصة',NULL,'Scalp','Scalp',NULL,NULL,'image',NULL,'image',NULL,NULL,0,1,1,NULL,NULL,'details',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Details','التفاصيل','Choose Platform','اختار المنصة',0,0,0,NULL,'2026-05-05 18:38:19','2026-05-11 06:52:38'),(17,'funded','funded-50k-starter','Funded 50K Starter','حساب ممول 50K','Starter plan for traders preparing for a funded account.','خطة بداية للمتداولين اللي بيجهزوا لحساب ممول.','Rules, checklist, and follow-up before applying.','قواعد، تشيك ليست، ومتابعة قبل التقديم.','A guided funded-account preparation service with risk rules, evaluation checklist, and practical support until the client is ready to apply.','خدمة تجهيز للحسابات الممولة تشمل قواعد المخاطرة، تشيك ليست التقييم، ومتابعة عملية حتى يكون العميل جاهز للتقديم.',1500.00,2000.00,'EGP','Start checkout','ابدأ الطلب',NULL,'Starter','بداية','/uploads/media/media_1776239709_69df445d3b062.png','/uploads/media/media_1776239709_69df445d3b062.png','image',NULL,'image','/uploads/media/media_1776239709_69df445d3b062.png',NULL,0,1,1,NULL,NULL,'checkout',NULL,NULL,NULL,'Service terms','شروط الخدمة','Payment confirms the client has read the rules. Access is delivered after payment verification.','الدفع يعني أن العميل قرأ الشروط. يتم إرسال تفاصيل الوصول بعد التأكد من الدفع.','Trading and funded challenges involve risk.','التداول وتحديات الحسابات الممولة بها مخاطر.','[]','Details','التفاصيل','Complete order','إتمام الطلب',0,1,1,NULL,'2026-05-11 06:52:38','2026-05-11 07:05:54'),(18,'funded','funded-200k-elite','Funded 200K Elite','حساب ممول 200K Elite','Premium preparation for high-capital funded accounts.','تجهيز احترافي للحسابات الممولة الكبيرة.','For traders who need a stricter execution plan.','للمتداولين اللي محتاجين خطة تنفيذ أكثر انضباطًا.','Elite preparation includes deeper risk mapping, trade review, and guided account selection.','يشمل تجهيز Elite خريطة مخاطرة أعمق، مراجعة صفقات، واختيار حساب مناسب.',4200.00,5000.00,'EGP','Start checkout','ابدأ الطلب',NULL,'Elite','احترافي','/uploads/media/media_1776240129_69df46010cef8.png','/uploads/media/media_1776240129_69df46010cef8.png','image',NULL,'image','/uploads/media/media_1776240129_69df46010cef8.png',NULL,0,1,1,NULL,NULL,'checkout',NULL,NULL,NULL,'Service terms','شروط الخدمة','This service is advisory and preparation based only.','هذه الخدمة استشارية وتجهيزية فقط.','High capital trading has higher risk exposure.','التداول برأس مال كبير يزيد درجة المخاطرة.','[]','Details','التفاصيل','Complete order','إتمام الطلب',0,1,3,NULL,'2026-05-11 06:52:38','2026-05-11 07:05:54'),(19,'vip','vip-quarterly','VIP Quarterly','VIP ربع سنوي','Three months of VIP access with a better price.','ثلاث شهور VIP بسعر أفضل.','Longer access for consistent follow-up.','اشتراك أطول لمتابعة مستمرة.','Quarterly VIP access with structured market follow-up, education notes, and priority support.','اشتراك VIP ربع سنوي مع متابعة سوق وملاحظات تعليمية ودعم أولوية.',3000.00,3600.00,'EGP','Subscribe now','اشترك الآن',NULL,'Best Value','أفضل قيمة','/uploads/media/media_1776263302_69dfa08673062.webp','/uploads/media/media_1776263302_69dfa08673062.webp','image',NULL,'image','/uploads/media/media_1776263302_69dfa08673062.webp',NULL,0,1,1,NULL,NULL,'checkout',NULL,NULL,NULL,'VIP terms','شروط VIP','VIP access starts after payment verification.','يبدأ تفعيل VIP بعد التأكد من الدفع.','Trading decisions remain the client responsibility.','قرارات التداول مسؤولية العميل.','[]','Details','التفاصيل','Subscribe','اشترك',0,1,2,NULL,'2026-05-11 06:52:38','2026-05-11 07:05:54'),(20,'scalp','scalp-gtc','Open GTC Account','فتح حساب GTC','Open your GTC account through the referral link after reading the guide and platform terms.','افتح حسابك على GTC من رابط الريفيرال بعد قراءة الشرح ومراجعة شروط المنصة.','A quick guide to open a GTC account with no payment inside the website.','شرح سريع لفتح حساب GTC بدون دفع داخل الموقع.','This page explains how to open a GTC scalp account. No payment is collected inside the website; read the key notes, understand the risks, then open the account from the official referral link.','هذه الصفحة مخصصة لشرح طريقة فتح حساب GTC للسكالب. لا يتم تحصيل أي مبلغ داخل الموقع، وكل ما تحتاجه هو قراءة النقاط المهمة، مراجعة المخاطر، ثم فتح الحساب من رابط الريفيرال الرسمي.',0.00,NULL,'USD','View guide','عرض الشرح',NULL,'Referral','ريفرال','/uploads/media/media_1776287988_69e000f47452e.png','/uploads/media/media_1776287988_69e000f47452e.png','image',NULL,'image','/uploads/media/media_1776287988_69e000f47452e.png',NULL,0,1,1,NULL,NULL,'details','https://mygtcportal.com/getview?view=register&token=Aipqzoww82owwwww','GTC','https://mygtcportal.com/getview?view=register&token=Aipqzoww82owwwww','Before opening the account','قبل فتح الحساب','Make sure the platform fits your country and trading style before registration. Hunter Trading does not collect money for this scalp flow and does not guarantee profits. Depositing and trading decisions are fully your responsibility.','تأكد أن المنصة مناسبة لبلدك وطريقة تداولك قبل التسجيل. Hunter Trading لا يحصل منك على أي أموال في خدمة السكالب، ولا يضمن أرباحًا. قرار الإيداع والتداول مسؤوليتك بالكامل.','Scalping and leveraged trading can cause fast losses. Start with an amount you can afford to lose and use strict risk management.','السكالب والتداول بالرافعة قد يسبب خسائر سريعة. ابدأ بمبلغ تتحمل خسارته والتزم بإدارة المخاطر.','[{\"label_en\":\"Open GTC account\",\"is_visible\":true,\"new_tab\":true,\"label_ar\":\"فتح حساب GTC\",\"url\":\"https:\\/\\/mygtcportal.com\\/getview?view=register&token=Aipqzoww82owwwww\",\"sort_order\":1},{\"label_en\":\"Join Telegram channel\",\"is_visible\":true,\"new_tab\":true,\"label_ar\":\"انضم لقناة التليجرام\",\"url\":\"https:\\/\\/t.me\\/hunter_tradeing\",\"sort_order\":2}]','Info','معلومات','Open GTC account','فتح حساب GTC',1,1,1,NULL,'2026-05-11 06:52:38','2026-05-12 05:39:49'),(21,'scalp','scalp-valtex','Open Valtex Account','فتح حساب Valtex','Open your Valtex account through the referral link after reading the guide and platform terms.','افتح حسابك على Valtex من رابط الريفيرال بعد قراءة الشرح ومراجعة شروط المنصة.','A quick guide to open a Valtex account with no payment inside the website.','شرح سريع لفتح حساب Valtex بدون دفع داخل الموقع.','This page explains how to open a Valtex scalp account. No payment is collected inside the website; read the key notes, understand the risks, then open the account from the official referral link.','هذه الصفحة مخصصة لشرح طريقة فتح حساب Valtex للسكالب. لا يتم تحصيل أي مبلغ داخل الموقع، وكل ما تحتاجه هو قراءة النقاط المهمة، مراجعة المخاطر، ثم فتح الحساب من رابط الريفيرال الرسمي.',0.00,NULL,'USD','View guide','عرض الشرح',NULL,'Referral','ريفرال','/uploads/media/media_1777588575_69f3d95f6a806.png','/uploads/media/media_1777588575_69f3d95f6a806.png','image',NULL,'image','/uploads/media/media_1777588575_69f3d95f6a806.png',NULL,0,1,1,NULL,NULL,'details','https://ma.valetax.com/p/5414559','Valtex','https://ma.valetax.com/p/5414559','Before opening the account','قبل فتح الحساب','Make sure the platform fits your country and trading style before registration. Hunter Trading does not collect money for this scalp flow and does not guarantee profits. Depositing and trading decisions are fully your responsibility.','تأكد أن المنصة مناسبة لبلدك وطريقة تداولك قبل التسجيل. Hunter Trading لا يحصل منك على أي أموال في خدمة السكالب، ولا يضمن أرباحًا. قرار الإيداع والتداول مسؤوليتك بالكامل.','Scalping and leveraged trading can cause fast losses. Start with an amount you can afford to lose and use strict risk management.','السكالب والتداول بالرافعة قد يسبب خسائر سريعة. ابدأ بمبلغ تتحمل خسارته والتزم بإدارة المخاطر.','[{\"label_en\":\"Open Valtex account\",\"is_visible\":true,\"new_tab\":true,\"label_ar\":\"فتح حساب Valtex\",\"url\":\"https:\\/\\/ma.valetax.com\\/p\\/5414559\",\"sort_order\":1},{\"label_en\":\"Join Telegram channel\",\"is_visible\":true,\"new_tab\":true,\"label_ar\":\"انضم لقناة التليجرام\",\"url\":\"https:\\/\\/t.me\\/hunter_tradeing\",\"sort_order\":2}]','Info','معلومات','Open Valtex account','فتح حساب Valtex',1,1,2,NULL,'2026-05-11 06:52:38','2026-05-12 05:39:51'),(22,'courses','course-risk-management','Risk Management Course','دورة إدارة المخاطر','Build a plan that protects your capital.','ابنِ خطة تحافظ على رأس مالك.','Position sizing, drawdown control, and psychology basics.','حجم الصفقة، التحكم في السحب، وأساسيات النفسية.','A focused course that helps traders control risk, avoid over-trading, and follow repeatable rules.','دورة مركزة تساعد المتداول على التحكم في المخاطرة وتجنب الإفراط في التداول واتباع قواعد قابلة للتكرار.',1400.00,1900.00,'EGP','Enroll now','اشترك الآن',NULL,'New','جديد','/uploads/media/media_1776240129_69df46010cef8.png','/uploads/media/media_1776240129_69df46010cef8.png','image',NULL,'image','/uploads/media/media_1776240129_69df46010cef8.png',NULL,0,1,1,NULL,NULL,'checkout',NULL,NULL,NULL,'Course terms','شروط الدورة','Course access is personal and cannot be shared.','الوصول للدورة شخصي ولا يمكن مشاركته.','Risk management reduces exposure but does not remove risk.','إدارة المخاطر تقلل التعرض ولا تلغي المخاطر.','[]','Details','التفاصيل','Enroll','اشترك',0,1,2,NULL,'2026-05-11 06:52:38','2026-05-11 07:05:54'),(23,'offers','offer-funded-bundle','Funded Preparation Bundle','باقة تجهيز الحسابات الممولة','A limited bundle for funded-account preparation.','باقة محدودة لتجهيز الحسابات الممولة.','Save on funded preparation and risk planning.','وفر في تجهيز الحسابات وإدارة المخاطر.','Bundle includes preparation checklist, rules review, and focused risk planning.','الباقة تشمل تشيك ليست تجهيز، مراجعة القواعد، وخطة مخاطرة مركزة.',3200.00,4300.00,'EGP','Get offer','احصل على العرض',NULL,'Bundle','باقة','/uploads/media/media_1776263302_69dfa08673062.webp','/uploads/media/media_1776263302_69dfa08673062.webp','image',NULL,'image','/uploads/media/media_1776263302_69dfa08673062.webp',NULL,0,1,1,'2026-05-01 00:00:00','2026-08-31 23:59:59','checkout',NULL,NULL,NULL,'Offer terms','شروط العرض','The bundle is activated after payment verification.','يتم تفعيل الباقة بعد التأكد من الدفع.','Funded account results are not guaranteed.','نتائج الحسابات الممولة غير مضمونة.','[]','Details','التفاصيل','Get offer','احصل على العرض',0,1,2,NULL,'2026-05-11 06:52:38','2026-05-11 07:05:54');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `signals`
--

DROP TABLE IF EXISTS `signals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `signals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` enum('buy','sell') NOT NULL,
  `pair` varchar(20) NOT NULL,
  `entry_price` decimal(12,5) NOT NULL,
  `take_profit` decimal(12,5) NOT NULL,
  `stop_loss` decimal(12,5) NOT NULL,
  `status` enum('active','closed','profitable','loss') DEFAULT 'active',
  `result_pips` decimal(10,3) DEFAULT NULL,
  `closed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `signals`
--

LOCK TABLES `signals` WRITE;
/*!40000 ALTER TABLE `signals` DISABLE KEYS */;
INSERT INTO `signals` VALUES (1,'buy','EUR/USD',1.08950,1.09450,1.08650,'loss',50.000,'2026-04-02 16:12:57','2026-04-02 18:12:57'),(2,'sell','GBP/JPY',188.45000,187.85000,188.95000,'active',0.000,NULL,'2026-04-02 18:12:57'),(3,'buy','XAU/USD',2032.50000,2045.00000,2020.00000,'profitable',85.000,'2026-04-02 14:12:57','2026-04-02 18:12:57'),(4,'sell','USD/CAD',1.35200,1.34700,1.35500,'active',-30.000,'2026-04-02 12:12:57','2026-04-02 18:12:57'),(5,'buy','EUR/GBP',0.85650,0.86200,0.85300,'profitable',45.000,'2026-04-02 10:12:57','2026-04-02 18:12:57'),(11,'buy','',0.00000,0.00000,0.00000,'active',NULL,NULL,'2026-04-18 22:16:35'),(12,'buy','5435',345.00000,345.00000,34534.00000,'active',NULL,NULL,'2026-04-18 22:16:44');
/*!40000 ALTER TABLE `signals` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=221 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_settings`
--

LOCK TABLES `site_settings` WRITE;
/*!40000 ALTER TABLE `site_settings` DISABLE KEYS */;
INSERT INTO `site_settings` VALUES (1,'website_name','Hunter Trading','2026-05-11 07:05:54'),(2,'broker_referral_url','https://ma.valetax.com/p/5414559','2026-04-28 18:11:48'),(3,'telegram_url','https://t.me/MezoRostom','2026-05-11 07:05:54'),(4,'free_telegram_url','https://t.me/hunter_tradeing','2026-04-18 22:17:57'),(5,'courses_page_url','https://example.com/courses','2026-04-02 18:40:38'),(6,'support_email','support@hunter_tradeing.com','2026-04-18 22:17:57'),(7,'location','Dubai, EGY','2026-04-28 18:11:48'),(8,'default_theme','dark','2026-04-02 18:41:05'),(25,'homepage_sections','[{\"id\":\"hero\",\"enabled\":true,\"order\":1},{\"id\":\"coach\",\"enabled\":true,\"order\":2},{\"id\":\"funded\",\"enabled\":true,\"order\":3},{\"id\":\"affiliate\",\"enabled\":true,\"order\":4},{\"id\":\"vip\",\"enabled\":true,\"order\":5},{\"id\":\"blog\",\"enabled\":true,\"order\":6},{\"id\":\"courses\",\"enabled\":true,\"order\":7},{\"id\":\"testimonials\",\"enabled\":true,\"order\":8},{\"id\":\"signals\",\"enabled\":true,\"order\":9}]','2026-04-30 22:09:12'),(26,'instagram_url','https://www.instagram.com/hunter_tradeing?igsh=MTVkdjZmZHA4MjExdQ==','2026-05-11 07:05:54'),(27,'youtube_url','https://youtube.com/@hunter_tradeing','2026-05-11 07:05:54'),(28,'tiktok_url','https://www.tiktok.com/@hunter_tradeing?_r=1&_t=ZS-95eR5pPgPTB','2026-05-11 07:05:54'),(29,'facebook_url','https://www.facebook.com/share/1JxgBuyYV4/','2026-05-11 07:05:54'),(30,'twitter_url','https://www.tiktok.com/@hunter_tradeing?_r=1&_t=ZS-95eR5pPgPTB','2026-04-28 18:11:48'),(31,'whatsapp_url','https://wa.me/201000000000','2026-05-11 07:05:54'),(32,'privacy_policy_url','','2026-04-14 18:20:11'),(33,'terms_url','','2026-04-14 18:20:11'),(34,'risk_disclaimer_url','','2026-04-14 18:20:11'),(35,'primary_color','#ba24ff','2026-04-27 11:15:31'),(36,'primary_color_strong','#3d44ff','2026-05-12 09:16:59'),(37,'accent_blue','#3d44ff','2026-04-27 11:16:41'),(38,'accent_orange','#ff6b35','2026-04-18 22:17:57'),(39,'accent_orange_strong','#ff8c42','2026-04-18 22:17:57'),(40,'background_dark','#0a0a0f','2026-04-14 18:20:11'),(41,'card_dark','#12121a','2026-04-14 18:20:11'),(42,'text_dark','#ffffff','2026-04-14 18:20:11'),(43,'text_muted_dark','#8a8a9a','2026-04-14 18:20:11'),(44,'privacy_policy_title','سياسة الخصوصية','2026-04-15 08:00:28'),(45,'privacy_policy_content','نحترم خصوصيتك ونتعامل مع بياناتك بحرص. قد نقوم بجمع بيانات مثل الاسم والبريد الإلكتروني ووسائل التواصل عند التسجيل أو التواصل معنا، ويتم استخدام هذه البيانات لتحسين الخدمة والتواصل معك وتقديم المحتوى المناسب. نحن لا نبيع بياناتك لأي طرف ثالث، وقد نستخدم مزودي خدمات موثوقين للمساعدة في تشغيل الموقع. باستخدامك للموقع فإنك توافق على هذه السياسة.','2026-04-15 08:00:28'),(46,'terms_title','الشروط والأحكام','2026-04-15 08:00:28'),(47,'terms_content','باستخدامك لهذا الموقع فأنت توافق على الالتزام بشروط الاستخدام. جميع المواد التعليمية والمعلومات المنشورة لأغراض تعليمية وإعلامية فقط، ولا تمثل نصيحة استثمارية مباشرة. يمنع إعادة نشر المحتوى أو نسخه دون إذن. يحق لإدارة الموقع تحديث المحتوى أو الخدمات أو الشروط في أي وقت.','2026-04-15 08:00:28'),(48,'risk_disclaimer_title','تحذير المخاطر','2026-04-15 08:00:28'),(49,'risk_disclaimer_content','التداول في الفوركس والأسهم والسلع والأدوات المالية ينطوي على مخاطر مرتفعة وقد لا يكون مناسبًا لجميع المستثمرين. يمكن أن تعمل الرافعة المالية لصالحك أو ضدك. يجب أن تتأكد من فهمك الكامل للمخاطر قبل اتخاذ أي قرار مالي، ولا تستثمر أموالًا لا يمكنك تحمل خسارتها.','2026-04-15 08:00:28'),(50,'footer_description','هانتر تريدنغ - طريقك إلى الحرية المالية من خلال تعليم التداول الخبير والاستراتيجيات المثبتة.','2026-04-15 08:00:28'),(51,'risk_warning_title','تحذير المخاطر','2026-04-15 08:00:28'),(52,'risk_warning_content','التداول في الفوركس والأسهم والسلع والأدوات المالية ينطوي على مخاطر مرتفعة وقد لا يكون مناسبًا لجميع المستثمرين. يمكن أن تعمل الرافعة المالية لصالحك أو ضدك. يجب أن تتأكد من فهمك الكامل للمخاطر قبل اتخاذ أي قرار مالي، ولا تستثمر أموالًا لا يمكنك تحمل خسارتها. هانتر تريدنج ليس مستشارًا ماليًا، وكل الإشارات والمحتوى التعليمي لأغراض معلوماتية فقط.','2026-04-15 08:00:28'),(53,'site_logo','/uploads/media/media_1777401505_69f0fea11a1c4.png','2026-05-11 07:05:54'),(54,'broker_gtc_url','https://mygtcportal.com/getview?view=register&token=Aipqzoww82owwwww','2026-04-28 18:11:48'),(55,'tiktok_enabled','1','2026-05-12 09:16:59'),(57,'instapay_number','huntertrading@instapay','2026-05-11 07:05:54'),(58,'instapay_account_name','Hunter Trading','2026-05-11 07:05:54'),(59,'vodafone_cash_number','01000000000','2026-05-11 07:05:54'),(60,'vodafone_cash_account_name','Hunter Trading','2026-05-11 07:05:54'),(61,'bank_transfer_details','Account name: Hunter Trading - Bank transfer details are updated from the dashboard before real launch.','2026-05-11 07:05:54'),(62,'payment_instructions_ar','ارفع صورة التحويل من صفحة الدفع. يتم مراجعة الطلب وإرسال رابط الوصول بعد التأكد من الدفع.','2026-05-11 07:05:54'),(63,'payment_instructions_en','Send the transfer screenshot from the checkout page. The team reviews the order and sends the access link after verification.','2026-05-11 07:05:54'),(64,'linkedin_url','','2026-05-11 05:54:55'),(65,'telegram_enabled','','2026-05-11 05:54:55'),(66,'whatsapp_enabled','','2026-05-11 05:54:55'),(67,'instagram_enabled','1','2026-05-12 09:16:59'),(68,'youtube_enabled','0','2026-05-11 06:02:58'),(69,'facebook_enabled','1','2026-05-12 09:16:59'),(70,'twitter_enabled','0','2026-05-12 03:47:06'),(71,'linkedin_enabled','0','2026-05-12 03:47:06'),(72,'footer_description_ar','','2026-05-11 05:54:55'),(73,'footer_description_en','','2026-05-11 05:54:55'),(74,'privacy_policy_title_ar','','2026-05-11 05:54:55'),(75,'privacy_policy_title_en','','2026-05-11 05:54:55'),(76,'privacy_policy_content_ar','','2026-05-11 05:54:55'),(77,'privacy_policy_content_en','','2026-05-11 05:54:55'),(78,'terms_title_ar','','2026-05-11 05:54:55'),(79,'terms_title_en','','2026-05-11 05:54:55'),(80,'terms_content_ar','','2026-05-11 05:54:55'),(81,'terms_content_en','','2026-05-11 05:54:55'),(82,'risk_disclaimer_title_ar','','2026-05-11 05:54:55'),(83,'risk_disclaimer_title_en','','2026-05-11 05:54:55'),(84,'risk_disclaimer_content_ar','','2026-05-11 05:54:55'),(85,'risk_disclaimer_content_en','','2026-05-11 05:54:55'),(86,'risk_warning_title_ar','','2026-05-11 05:54:55'),(87,'risk_warning_title_en','','2026-05-11 05:54:55'),(88,'risk_warning_content_ar','','2026-05-11 05:54:55'),(89,'risk_warning_content_en','','2026-05-11 05:54:55'),(121,'site_description_en','A client-owned trading services website for funded accounts, VIP, scalp, offers, and courses.','2026-05-11 07:05:54'),(122,'site_description_ar','موقع خدمات تداول مملوك للعميل للحسابات الممولة و VIP والسكالب والعروض والدورات.','2026-05-11 07:05:54'),(123,'contact_email','support@huntertrading.com','2026-05-11 07:05:54'),(124,'contact_phone','+201000000000','2026-05-11 07:05:54'),(125,'social_whatsapp_enabled','1','2026-05-11 07:05:54'),(126,'social_telegram_enabled','1','2026-05-11 07:05:54'),(127,'social_facebook_enabled','1','2026-05-11 07:05:54'),(128,'social_instagram_enabled','1','2026-05-11 07:05:54'),(129,'social_youtube_enabled','1','2026-05-11 07:05:54'),(130,'social_tiktok_enabled','1','2026-05-11 07:05:54'),(131,'payment_success_message_ar','تم استلام طلبك بنجاح. سيتم التأكد من الدفع والتواصل معك قريبًا.','2026-05-11 07:05:54'),(132,'payment_success_message_en','Your request was received. Payment will be verified and the team will contact you shortly.','2026-05-11 07:05:54'),(133,'risk_warning_en','Trading involves risk. Results are not guaranteed and every client is responsible for their own decisions.','2026-05-11 07:05:54'),(134,'risk_warning_ar','التداول يحتوي على مخاطر. النتائج غير مضمونة وكل عميل مسؤول عن قراراته.','2026-05-11 07:05:54'),(135,'footer_copyright_ar','جميع الحقوق محفوظة Hunter Trading','2026-05-11 07:05:54'),(136,'footer_copyright_en','All rights reserved Hunter Trading','2026-05-11 07:05:54'),(214,'payment_methods_json','','2026-05-12 03:47:06'),(215,'product_card_shell_bg','#0a0a0f','2026-05-12 09:16:59'),(216,'product_card_surface_bg','#12121a','2026-05-12 09:16:59'),(217,'product_card_border_color','#2a2a36','2026-05-12 09:16:59'),(218,'product_card_title_color','#ffffff','2026-05-12 09:16:59'),(219,'product_card_body_color','#9ca3af','2026-05-12 09:16:59'),(220,'product_card_button_text_color','#050509','2026-05-12 09:16:59');
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
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testimonials`
--

LOCK TABLES `testimonials` WRITE;
/*!40000 ALTER TABLE `testimonials` DISABLE KEYS */;
INSERT INTO `testimonials` VALUES (1,'معاذ','مصر','/uploads/media/media_1776287988_69e000f47452e.png',NULL,'Hunter Trading completely changed my approach to forex. The structured courses and real-time signals helped me achieve consistent profits. I went from losing money to making $3,000+ monthly.','غيّر هانتر تريدنغ نهجتي تجاه الفوركس تماماً. ساعدتني الدورات المنظمة والإشارات الفورية على تحقيق أرباح ثابتة.',5,NULL,NULL,0,1,1,7,'2026-04-02 18:12:57'),(2,'Sarah K.','United Kingdom',NULL,NULL,'The mentorship program is exceptional. Ahmed doesn\'t just teach strategies; he teaches you how to think like a professional trader. My win rate improved from 45% to 82% in just 3 months.','برنامج التوجيه استثنائي. أحمد لا يعلم الاستراتيجيات فحسب؛ بل يعلمك كيف تفكر كمتداول محترف. تحسن معدل ربحي من 45% إلى 82% في 3 أشهر فقط.',5,NULL,NULL,0,1,1,2,'2026-04-02 18:12:57'),(3,'John D.','United States',NULL,NULL,'I\'ve tried many trading courses before, but Hunter Trading is different. The community support and the quality of education are unmatched. Best investment I\'ve made in my trading career.','جربت العديد من دورات التداول من قبل، لكن هانتر تريدنغ مختلفة. دعم المجتمع وجودية التعليم لا مثيل لهما.',5,NULL,NULL,0,1,1,3,'2026-04-02 18:12:57'),(15,'AA','VIP Client','/uploads/media/media_1776239709_69df445d3b062.png',NULL,'The VIP follow-up helped me trade with clearer rules.','متابعة VIP ساعدتني ألتزم بقواعد أوضح في التداول.',5,'vip',NULL,1,1,1,1,'2026-05-11 07:05:54'),(16,'Sara K.','Course Student','/uploads/media/media_1776239722_69df446ad698c.png',NULL,'The course made risk management much easier to apply.','الدورة خلت إدارة المخاطر أسهل في التطبيق.',5,'courses',NULL,1,1,1,2,'2026-05-11 07:05:54'),(17,'Omar H.','Funded Account Client','/uploads/media/media_1776240129_69df46010cef8.png',NULL,'The funded account checklist saved me from common mistakes.','تشيك ليست الحساب الممول جنبتني أخطاء متكررة.',5,'funded',NULL,0,1,1,3,'2026-05-11 07:05:54'),(18,'Mona A.','Scalp User','/uploads/media/media_1776240891_69df48fb213e1.png',NULL,'The broker steps were clear before opening my account.','خطوات فتح حساب المنصة كانت واضحة قبل التسجيل.',5,'scalp',NULL,0,1,1,4,'2026-05-11 07:05:54');
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
INSERT INTO `users` VALUES (1,'admin@huntertrading.com','$2y$10$rmcmz0oV0g5uA4961/JMtOYtJTQ93NGnBbr7jXyxG0EbWZgda6Nc6','admin','2026-04-02 18:12:57');
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

-- Dump completed on 2026-05-12 12:24:55
