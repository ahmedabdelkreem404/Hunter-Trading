SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
START TRANSACTION;

SET @logo := '/uploads/media/media_1777401505_69f0fea11a1c4.png';
SET @img1 := '/uploads/media/media_1776239709_69df445d3b062.png';
SET @img2 := '/uploads/media/media_1776239722_69df446ad698c.png';
SET @img3 := '/uploads/media/media_1776240129_69df46010cef8.png';
SET @img4 := '/uploads/media/media_1776240891_69df48fb213e1.png';
SET @img5 := '/uploads/media/media_1776263302_69dfa08673062.webp';
SET @img6 := '/uploads/media/media_1776287988_69e000f47452e.png';
SET @img7 := '/uploads/media/media_1777588575_69f3d95f6a806.png';
SET @coach_img := '/uploads/coach/coach_1777401897_69f10029a36ed.jpg';

/* Global website settings */
INSERT INTO site_settings (setting_key, setting_value) VALUES
('website_name', 'Hunter Trading'),
('site_logo', @logo),
('site_description_en', 'A client-owned trading services website for funded accounts, VIP, scalp, offers, and courses.'),
('site_description_ar', 'موقع خدمات تداول مملوك للعميل للحسابات الممولة و VIP والسكالب والعروض والدورات.'),
('contact_email', 'support@huntertrading.com'),
('contact_phone', '+201000000000'),
('whatsapp_url', 'https://wa.me/201000000000'),
('telegram_url', 'https://t.me/MezoRostom'),
('facebook_url', 'https://www.facebook.com/share/1JxgBuyYV4/'),
('instagram_url', 'https://www.instagram.com/hunter_tradeing?igsh=MTVkdjZmZHA4MjExdQ=='),
('youtube_url', 'https://youtube.com/@hunter_tradeing'),
('tiktok_url', 'https://www.tiktok.com/@hunter_tradeing?_r=1&_t=ZS-95eR5pPgPTB'),
('social_whatsapp_enabled', '1'),
('social_telegram_enabled', '1'),
('social_facebook_enabled', '1'),
('social_instagram_enabled', '1'),
('social_youtube_enabled', '1'),
('social_tiktok_enabled', '1'),
('instapay_number', 'huntertrading@instapay'),
('instapay_account_name', 'Hunter Trading'),
('vodafone_cash_number', '01000000000'),
('vodafone_cash_account_name', 'Hunter Trading'),
('bank_transfer_details', 'Account name: Hunter Trading - Bank transfer details are updated from the dashboard before real launch.'),
('payment_instructions_en', 'Send the transfer screenshot from the checkout page. The team reviews the order and sends the access link after verification.'),
('payment_instructions_ar', 'ارفع صورة التحويل من صفحة الدفع. يتم مراجعة الطلب وإرسال رابط الوصول بعد التأكد من الدفع.'),
('payment_success_message_ar', 'تم استلام طلبك بنجاح. سيتم التأكد من الدفع والتواصل معك قريبًا.'),
('payment_success_message_en', 'Your request was received. Payment will be verified and the team will contact you shortly.'),
('risk_warning_en', 'Trading involves risk. Results are not guaranteed and every client is responsible for their own decisions.'),
('risk_warning_ar', 'التداول يحتوي على مخاطر. النتائج غير مضمونة وكل عميل مسؤول عن قراراته.'),
('footer_copyright_ar', 'جميع الحقوق محفوظة Hunter Trading'),
('footer_copyright_en', 'All rights reserved Hunter Trading')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = CURRENT_TIMESTAMP;

/* Section settings and ordering */
INSERT INTO section_settings
(section_key, title_en, title_ar, subtitle_en, subtitle_ar, body_en, body_ar, cta_label_en, cta_label_ar, cta_url, stats_json, settings_json, is_visible, sort_order)
VALUES
('hero', 'Trade with structure, not noise', 'تداول بخطة واضحة وليس بعشوائية', 'Funded accounts, VIP guidance, scalp broker onboarding, offers, and practical trading courses.', 'حسابات ممولة، متابعة VIP، سكالب عبر منصات موثوقة، عروض، ودورات تداول عملية.', 'Choose the path that fits your experience level and follow a clear journey from learning to execution.', 'اختار المسار المناسب لمستواك واتحرك بخطوات واضحة من التعلم للتنفيذ.', 'Explore services', 'استكشف الخدمات', '#funded', '[{"label_en":"Students","label_ar":"متدرب","value":"1200+"},{"label_en":"Experience","label_ar":"خبرة","value":"6+ سنوات"},{"label_en":"Support","label_ar":"دعم","value":"24/7"}]', CONCAT('{"hero_video_url":"","hero_mobile_video_url":"","hero_video_poster_url":"', @img2, '","hero_fallback_image_url":"', @img2, '","hero_video_autoplay":true,"hero_video_muted":true,"hero_video_loop":true,"hero_video_controls":false}'), 1, 1),
('funded', 'Funded Accounts', 'الحسابات الممولة', 'Choose a funded account path with clear rules, steps, and support.', 'اختار مسار الحساب الممول بقواعد واضحة وخطوات متابعة منظمة.', '', '', 'View funded accounts', 'شوف الحسابات الممولة', '#funded', '[]', '{}', 1, 2),
('vip', 'VIP Trading', 'VIP', 'Daily follow-up, educational ideas, and structured trade planning.', 'متابعة يومية وأفكار تعليمية وخطة تداول منظمة.', '', '', 'Join VIP', 'اشترك الآن', '#vip', '[]', '{}', 1, 3),
('scalp', 'Scalp Platforms', 'السكالب', 'Open a broker account through the referral links after reading the details and terms.', 'افتح حساب على المنصات من روابط الريفرال بعد قراءة الشرح والشروط.', '', '', 'View scalp details', 'عرض الشرح', '#scalp', '[]', '{}', 1, 4),
('courses', 'Courses', 'الدورات', 'Practical courses for price action, risk management, and execution discipline.', 'دورات عملية في البرايس أكشن وإدارة المخاطر والانضباط في التنفيذ.', '', '', 'Browse courses', 'تصفح الدورات', '#courses', '[]', '{}', 1, 5),
('offers', 'Offers', 'العروض', 'Limited offers for VIP, funded account preparation, and learning bundles.', 'عروض محدودة للـ VIP وتجهيز الحسابات الممولة وباقات التعلم.', '', '', 'See offers', 'شوف العروض', '#offers', '[]', '{}', 1, 6),
('coach', 'Coach & Social', 'المدرب والسوشيال', 'Follow the coach updates and official social channels from one trusted place.', 'تابع تحديثات المدرب وروابط السوشيال الرسمية من مكان واحد.', '', '', 'Contact us', 'تواصل معنا', '#coach', '[]', '{}', 1, 7),
('testimonials', 'Client Feedback', 'آراء العملاء', 'Real feedback from clients who used the website services.', 'آراء عملاء استخدموا خدمات الموقع.', '', '', '', '', '', '[]', '{}', 1, 8),
('market', 'Market Updates', 'متابعة السوق', 'Short updates and useful market notes.', 'تحديثات مختصرة وملاحظات مهمة عن السوق.', '', '', '', '', '', '[]', '{}', 1, 9),
('navigation', 'Navigation', 'القائمة', '', '', '', '', '', '', '', '[]', '{"menu_items":[{"label_en":"Home","label_ar":"الرئيسية","href":"#home","sort_order":1},{"label_en":"Funded","label_ar":"الحسابات الممولة","href":"#funded","sort_order":2},{"label_en":"Scalp","label_ar":"Scalp","href":"#scalp","sort_order":3},{"label_en":"VIP","label_ar":"VIP","href":"#vip","sort_order":4},{"label_en":"Offers","label_ar":"العروض","href":"#offers","sort_order":5},{"label_en":"Courses","label_ar":"الدورات","href":"#courses","sort_order":6}]}', 0, 0),
('footer', 'Footer', 'الفوتر', '', '', '', '', '', '', '', '[]', '{"quick_links":[{"label_en":"Funded Accounts","label_ar":"الحسابات الممولة","href":"#funded"},{"label_en":"VIP","label_ar":"VIP","href":"#vip"},{"label_en":"Scalp","label_ar":"Scalp","href":"#scalp"},{"label_en":"Offers","label_ar":"العروض","href":"#offers"},{"label_en":"Courses","label_ar":"الدورات","href":"#courses"}]}', 1, 10)
ON DUPLICATE KEY UPDATE
title_en = VALUES(title_en),
title_ar = VALUES(title_ar),
subtitle_en = VALUES(subtitle_en),
subtitle_ar = VALUES(subtitle_ar),
body_en = VALUES(body_en),
body_ar = VALUES(body_ar),
cta_label_en = VALUES(cta_label_en),
cta_label_ar = VALUES(cta_label_ar),
cta_url = VALUES(cta_url),
stats_json = VALUES(stats_json),
settings_json = VALUES(settings_json),
is_visible = VALUES(is_visible),
sort_order = VALUES(sort_order),
updated_at = CURRENT_TIMESTAMP;

/* Hide the old generic Scalp card so the public Scalp section focuses on GTC and Valtex only. */
UPDATE services SET is_visible = 0 WHERE slug = 'scalp-onboarding';
UPDATE section_settings SET is_visible = 0 WHERE section_key = 'navbar';

/* Services and products */
INSERT INTO services
(type, slug, title_en, title_ar, subtitle_en, subtitle_ar, short_description_en, short_description_ar, full_description_en, full_description_ar, price, compare_price, currency, cta_label_en, cta_label_ar, cta_url, badge_text_en, badge_text_ar, thumbnail_url, cover_url, cover_media_type, card_media_type, card_media_url, card_video_autoplay, card_video_muted, card_video_loop, offer_starts_at, offer_ends_at, cta_action, referral_url, broker_name, broker_url, terms_title_en, terms_title_ar, terms_content_en, terms_content_ar, risk_warning_en, risk_warning_ar, important_links_json, details_button_label_en, details_button_label_ar, final_cta_label_en, final_cta_label_ar, is_featured, is_visible, sort_order)
VALUES
('funded','funded-50k-starter','Funded 50K Starter','حساب ممول 50K','Starter plan for traders preparing for a funded account.','خطة بداية للمتداولين اللي بيجهزوا لحساب ممول.','Rules, checklist, and follow-up before applying.','قواعد، تشيك ليست، ومتابعة قبل التقديم.','A guided funded-account preparation service with risk rules, evaluation checklist, and practical support until the client is ready to apply.','خدمة تجهيز للحسابات الممولة تشمل قواعد المخاطرة، تشيك ليست التقييم، ومتابعة عملية حتى يكون العميل جاهز للتقديم.',1500,2000,'EGP','Start checkout','ابدأ الطلب',NULL,'Starter','بداية',@img1,@img1,'image','image',@img1,0,1,1,NULL,NULL,'checkout',NULL,NULL,NULL,'Service terms','شروط الخدمة','Payment confirms the client has read the rules. Access is delivered after payment verification.','الدفع يعني أن العميل قرأ الشروط. يتم إرسال تفاصيل الوصول بعد التأكد من الدفع.','Trading and funded challenges involve risk.','التداول وتحديات الحسابات الممولة بها مخاطر.','[]','Details','التفاصيل','Complete order','إتمام الطلب',0,1,1),
('funded','funded-100k','Funded 100K Pro','حساب ممول 100K برو','Advanced preparation for larger funded accounts.','تجهيز متقدم للحسابات الممولة الأكبر.','A structured path for serious funded-account applicants.','مسار منظم للمتقدمين الجادين للحسابات الممولة.','Includes account rules, drawdown planning, trading checklist, and support through the preparation period.','يشمل قواعد الحساب، خطة السحب، تشيك ليست التداول، ومتابعة خلال فترة التجهيز.',2500,3200,'EGP','Start checkout','ابدأ الطلب',NULL,'Popular','الأكثر طلبًا',@img2,@img2,'image','image',@img2,0,1,1,NULL,NULL,'checkout',NULL,NULL,NULL,'Service terms','شروط الخدمة','The client must follow risk rules and confirm all account conditions before applying.','يلتزم العميل بقواعد المخاطرة والتأكد من شروط الحساب قبل التقديم.','No result is guaranteed.','لا يوجد ضمان للنتائج.','[]','Details','التفاصيل','Complete order','إتمام الطلب',1,1,2),
('funded','funded-200k-elite','Funded 200K Elite','حساب ممول 200K Elite','Premium preparation for high-capital funded accounts.','تجهيز احترافي للحسابات الممولة الكبيرة.','For traders who need a stricter execution plan.','للمتداولين اللي محتاجين خطة تنفيذ أكثر انضباطًا.','Elite preparation includes deeper risk mapping, trade review, and guided account selection.','يشمل تجهيز Elite خريطة مخاطرة أعمق، مراجعة صفقات، واختيار حساب مناسب.',4200,5000,'EGP','Start checkout','ابدأ الطلب',NULL,'Elite','احترافي',@img3,@img3,'image','image',@img3,0,1,1,NULL,NULL,'checkout',NULL,NULL,NULL,'Service terms','شروط الخدمة','This service is advisory and preparation based only.','هذه الخدمة استشارية وتجهيزية فقط.','High capital trading has higher risk exposure.','التداول برأس مال كبير يزيد درجة المخاطرة.','[]','Details','التفاصيل','Complete order','إتمام الطلب',0,1,3),
('vip','vip-monthly','VIP Monthly','VIP شهري','Monthly VIP follow-up and trading guidance.','متابعة VIP شهرية وإرشاد تداول.','Daily ideas, market notes, and disciplined follow-up.','أفكار يومية وملاحظات سوق ومتابعة منضبطة.','A monthly VIP service for clients who want structured trade ideas, education notes, and support.','خدمة VIP شهرية للعملاء الباحثين عن أفكار منظمة وملاحظات تعليمية ومتابعة.',1200,1500,'EGP','Subscribe now','اشترك الآن',NULL,'Popular','الأكثر طلبًا',@img4,@img4,'image','image',@img4,0,1,1,NULL,NULL,'checkout',NULL,NULL,NULL,'VIP terms','شروط VIP','VIP content is educational and should not be treated as guaranteed profit.','محتوى VIP تعليمي ولا يعتبر ضمانًا للربح.','Signals and market ideas involve risk.','الأفكار والإشارات بها مخاطر.','[]','Details','التفاصيل','Subscribe','اشترك',1,1,1),
('vip','vip-quarterly','VIP Quarterly','VIP ربع سنوي','Three months of VIP access with a better price.','ثلاث شهور VIP بسعر أفضل.','Longer access for consistent follow-up.','اشتراك أطول لمتابعة مستمرة.','Quarterly VIP access with structured market follow-up, education notes, and priority support.','اشتراك VIP ربع سنوي مع متابعة سوق وملاحظات تعليمية ودعم أولوية.',3000,3600,'EGP','Subscribe now','اشترك الآن',NULL,'Best Value','أفضل قيمة',@img5,@img5,'image','image',@img5,0,1,1,NULL,NULL,'checkout',NULL,NULL,NULL,'VIP terms','شروط VIP','VIP access starts after payment verification.','يبدأ تفعيل VIP بعد التأكد من الدفع.','Trading decisions remain the client responsibility.','قرارات التداول مسؤولية العميل.','[]','Details','التفاصيل','Subscribe','اشترك',0,1,2),
('scalp','scalp-gtc','GTC Scalp Account','فتح حساب GTC','Open a GTC account through the referral link after reading the guide.','افتح حساب GTC من خلال رابط الريفرال بعد قراءة الشرح.','No payment is collected here. The client only opens an external broker account.','لا يتم تحصيل أي مبلغ هنا. العميل يفتح حساب على منصة خارجية فقط.','This page explains how to open the account, what to check before depositing, and which support links to use.','الصفحة دي بتشرح طريقة فتح الحساب، النقاط المهمة قبل الإيداع، وروابط الدعم المطلوبة.',0,NULL,'USD','View details','عرض الشرح',NULL,'Referral','ريفرال',@img6,@img6,'image','image',@img6,0,1,1,NULL,NULL,'details','https://gtc.example.com/ref/hunter','GTC','https://gtc.example.com','Before opening an account','قبل فتح الحساب','Read the broker conditions, check your country availability, and only deposit after you understand the risks. Hunter Trading does not collect money for this service.','اقرأ شروط المنصة، تأكد من توفر الخدمة في بلدك، ولا تقم بالإيداع إلا بعد فهم المخاطر. Hunter Trading لا يحصل منك على أي أموال في هذه الخدمة.','Scalping and leveraged trading can cause fast losses. Start with an amount you can afford to lose.','السكالب والتداول بالرافعة قد يسبب خسائر سريعة. ابدأ بمبلغ تتحمل خسارته.','[{"label_en":"Open GTC account","label_ar":"فتح حساب GTC","url":"https://gtc.example.com/ref/hunter","new_tab":true,"sort_order":1}]','Info','معلومات','Open GTC Account','فتح حساب في GTC',1,1,1),
('scalp','scalp-valtex','Valtex Scalp Account','فتح حساب Valtex','Open a Valtex account through the referral link after reading the guide.','افتح حساب Valtex من خلال رابط الريفرال بعد قراءة الشرح.','No payment is collected here. The final action is an external referral link.','لا يتم تحصيل أي مبلغ هنا. الإجراء النهائي هو رابط ريفرال خارجي.','This page explains the steps, broker data, important links, and risk notes before opening Valtex.','الصفحة دي بتعرض الخطوات وبيانات المنصة والروابط المهمة وملاحظات المخاطرة قبل فتح Valtex.',0,NULL,'USD','View details','عرض الشرح',NULL,'Referral','ريفرال',@img7,@img7,'image','image',@img7,0,1,1,NULL,NULL,'details','https://valtex.example.com/ref/hunter','Valtex','https://valtex.example.com','Before opening an account','قبل فتح الحساب','The user should read all platform terms and verify support channels before depositing. Hunter Trading does not process payments for this flow.','يجب قراءة شروط المنصة والتأكد من قنوات الدعم قبل الإيداع. Hunter Trading لا يعالج أي مدفوعات في هذا المسار.','High-speed execution can amplify gains and losses. Manage risk carefully.','التنفيذ السريع قد يضاعف الأرباح والخسائر. التزم بإدارة المخاطر.','[{"label_en":"Open Valtex account","label_ar":"فتح حساب Valtex","url":"https://valtex.example.com/ref/hunter","new_tab":true,"sort_order":1}]','Info','معلومات','Open Valtex Account','فتح حساب في Valtex',1,1,2),
('courses','course-price-action','Price Action Course','دورة البرايس أكشن','Learn market structure, entries, and risk planning.','اتعلم هيكل السوق والدخول وإدارة المخاطر.','Practical lessons for clean execution.','دروس عملية لتنفيذ أوضح.','A practical course focused on price action, market structure, risk planning, and trade review.','دورة عملية تركز على البرايس أكشن، هيكل السوق، إدارة المخاطر، ومراجعة الصفقات.',1800,2500,'EGP','Enroll now','اشترك الآن',NULL,'Course','دورة',@img2,@img2,'image','image',@img2,0,1,1,NULL,NULL,'checkout',NULL,NULL,NULL,'Course terms','شروط الدورة','Access is sent after payment verification.','يتم إرسال الوصول بعد التأكد من الدفع.','Educational content does not guarantee trading results.','المحتوى التعليمي لا يضمن نتائج التداول.','[]','Details','التفاصيل','Enroll','اشترك',1,1,1),
('courses','course-risk-management','Risk Management Course','دورة إدارة المخاطر','Build a plan that protects your capital.','ابنِ خطة تحافظ على رأس مالك.','Position sizing, drawdown control, and psychology basics.','حجم الصفقة، التحكم في السحب، وأساسيات النفسية.','A focused course that helps traders control risk, avoid over-trading, and follow repeatable rules.','دورة مركزة تساعد المتداول على التحكم في المخاطرة وتجنب الإفراط في التداول واتباع قواعد قابلة للتكرار.',1400,1900,'EGP','Enroll now','اشترك الآن',NULL,'New','جديد',@img3,@img3,'image','image',@img3,0,1,1,NULL,NULL,'checkout',NULL,NULL,NULL,'Course terms','شروط الدورة','Course access is personal and cannot be shared.','الوصول للدورة شخصي ولا يمكن مشاركته.','Risk management reduces exposure but does not remove risk.','إدارة المخاطر تقلل التعرض ولا تلغي المخاطر.','[]','Details','التفاصيل','Enroll','اشترك',0,1,2),
('offers','offer-vip-quarter','VIP Quarterly Offer','عرض VIP ربع سنوي','Quarterly VIP access with a limited discount.','اشتراك VIP ربع سنوي بخصم محدود.','Best value for clients who want consistent follow-up.','أفضل قيمة لمن يريد متابعة مستمرة.','A limited-time offer for three months of VIP access, including market notes and support.','عرض لفترة محدودة على اشتراك VIP لمدة ثلاثة أشهر يشمل ملاحظات سوق ودعم.',2600,3600,'EGP','Get offer','احصل على العرض',NULL,'Limited','لفترة محدودة',@img4,@img4,'image','image',@img4,0,1,1,'2026-05-01 00:00:00','2026-08-31 23:59:59','checkout',NULL,NULL,NULL,'Offer terms','شروط العرض','Offer price is available until the end date or while capacity is available.','سعر العرض متاح حتى تاريخ الانتهاء أو نفاد الأماكن.','VIP remains educational and risk-based.','VIP محتوى تعليمي وتوجد مخاطر.','[]','Details','التفاصيل','Get offer','احصل على العرض',1,1,1),
('offers','offer-funded-bundle','Funded Preparation Bundle','باقة تجهيز الحسابات الممولة','A limited bundle for funded-account preparation.','باقة محدودة لتجهيز الحسابات الممولة.','Save on funded preparation and risk planning.','وفر في تجهيز الحسابات وإدارة المخاطر.','Bundle includes preparation checklist, rules review, and focused risk planning.','الباقة تشمل تشيك ليست تجهيز، مراجعة القواعد، وخطة مخاطرة مركزة.',3200,4300,'EGP','Get offer','احصل على العرض',NULL,'Bundle','باقة',@img5,@img5,'image','image',@img5,0,1,1,'2026-05-01 00:00:00','2026-08-31 23:59:59','checkout',NULL,NULL,NULL,'Offer terms','شروط العرض','The bundle is activated after payment verification.','يتم تفعيل الباقة بعد التأكد من الدفع.','Funded account results are not guaranteed.','نتائج الحسابات الممولة غير مضمونة.','[]','Details','التفاصيل','Get offer','احصل على العرض',0,1,2)
ON DUPLICATE KEY UPDATE
type=VALUES(type), title_en=VALUES(title_en), title_ar=VALUES(title_ar),
subtitle_en=VALUES(subtitle_en), subtitle_ar=VALUES(subtitle_ar),
short_description_en=VALUES(short_description_en), short_description_ar=VALUES(short_description_ar),
full_description_en=VALUES(full_description_en), full_description_ar=VALUES(full_description_ar),
price=VALUES(price), compare_price=VALUES(compare_price), currency=VALUES(currency),
cta_label_en=VALUES(cta_label_en), cta_label_ar=VALUES(cta_label_ar), cta_url=VALUES(cta_url),
badge_text_en=VALUES(badge_text_en), badge_text_ar=VALUES(badge_text_ar),
thumbnail_url=VALUES(thumbnail_url), cover_url=VALUES(cover_url), cover_media_type=VALUES(cover_media_type),
card_media_type=VALUES(card_media_type), card_media_url=VALUES(card_media_url),
card_video_autoplay=VALUES(card_video_autoplay), card_video_muted=VALUES(card_video_muted), card_video_loop=VALUES(card_video_loop),
offer_starts_at=VALUES(offer_starts_at), offer_ends_at=VALUES(offer_ends_at),
cta_action=VALUES(cta_action), referral_url=VALUES(referral_url), broker_name=VALUES(broker_name), broker_url=VALUES(broker_url),
terms_title_en=VALUES(terms_title_en), terms_title_ar=VALUES(terms_title_ar),
terms_content_en=VALUES(terms_content_en), terms_content_ar=VALUES(terms_content_ar),
risk_warning_en=VALUES(risk_warning_en), risk_warning_ar=VALUES(risk_warning_ar),
important_links_json=VALUES(important_links_json),
details_button_label_en=VALUES(details_button_label_en), details_button_label_ar=VALUES(details_button_label_ar),
final_cta_label_en=VALUES(final_cta_label_en), final_cta_label_ar=VALUES(final_cta_label_ar),
is_featured=VALUES(is_featured), is_visible=VALUES(is_visible), sort_order=VALUES(sort_order),
updated_at=CURRENT_TIMESTAMP;

/* Service details: features, steps, FAQs, and gallery */
DELETE sf FROM service_features sf JOIN services s ON s.id = sf.service_id WHERE s.slug IN ('funded-50k-starter','funded-100k','funded-200k-elite','vip-monthly','vip-quarterly','scalp-gtc','scalp-valtex','course-price-action','course-risk-management','offer-vip-quarter','offer-funded-bundle');
DELETE ss FROM service_steps ss JOIN services s ON s.id = ss.service_id WHERE s.slug IN ('funded-50k-starter','funded-100k','funded-200k-elite','vip-monthly','vip-quarterly','scalp-gtc','scalp-valtex','course-price-action','course-risk-management','offer-vip-quarter','offer-funded-bundle');
DELETE fq FROM service_faqs fq JOIN services s ON s.id = fq.service_id WHERE s.slug IN ('funded-50k-starter','funded-100k','funded-200k-elite','vip-monthly','vip-quarterly','scalp-gtc','scalp-valtex','course-price-action','course-risk-management','offer-vip-quarter','offer-funded-bundle');
DELETE sm FROM service_media sm JOIN services s ON s.id = sm.service_id WHERE s.slug IN ('funded-50k-starter','funded-100k','funded-200k-elite','vip-monthly','vip-quarterly','scalp-gtc','scalp-valtex','course-price-action','course-risk-management','offer-vip-quarter','offer-funded-bundle');

INSERT INTO service_features (service_id, label_en, label_ar, sort_order)
SELECT id, 'Clear rules checklist', 'تشيك ليست قواعد واضحة', 1 FROM services WHERE slug IN ('funded-50k-starter','funded-100k','funded-200k-elite')
UNION ALL SELECT id, 'Risk planning support', 'دعم في خطة المخاطرة', 2 FROM services WHERE slug IN ('funded-50k-starter','funded-100k','funded-200k-elite')
UNION ALL SELECT id, 'Daily market notes', 'ملاحظات سوق يومية', 1 FROM services WHERE slug IN ('vip-monthly','vip-quarterly')
UNION ALL SELECT id, 'Priority support', 'دعم أولوية', 2 FROM services WHERE slug IN ('vip-monthly','vip-quarterly')
UNION ALL SELECT id, 'No payment on website', 'لا يوجد دفع داخل الموقع', 1 FROM services WHERE slug IN ('scalp-gtc','scalp-valtex')
UNION ALL SELECT id, 'External referral account opening', 'فتح حساب خارجي عبر الريفرال', 2 FROM services WHERE slug IN ('scalp-gtc','scalp-valtex')
UNION ALL SELECT id, 'Practical lessons', 'دروس عملية', 1 FROM services WHERE slug IN ('course-price-action','course-risk-management')
UNION ALL SELECT id, 'Lifetime notes access', 'وصول دائم للملاحظات', 2 FROM services WHERE slug IN ('course-price-action','course-risk-management')
UNION ALL SELECT id, 'Limited price', 'سعر محدود', 1 FROM services WHERE slug IN ('offer-vip-quarter','offer-funded-bundle')
UNION ALL SELECT id, 'Fast activation after review', 'تفعيل سريع بعد المراجعة', 2 FROM services WHERE slug IN ('offer-vip-quarter','offer-funded-bundle');

INSERT INTO service_steps (service_id, title_en, title_ar, description_en, description_ar, sort_order)
SELECT id, 'Read the details', 'اقرأ التفاصيل', 'Review service terms and decide if it fits your needs.', 'راجع شروط الخدمة وحدد هل تناسبك أم لا.', 1 FROM services WHERE slug IN ('funded-50k-starter','funded-100k','funded-200k-elite','vip-monthly','vip-quarterly','course-price-action','course-risk-management','offer-vip-quarter','offer-funded-bundle')
UNION ALL SELECT id, 'Complete checkout', 'أكمل الطلب', 'Send your payment data and screenshot for verification.', 'أرسل بيانات الدفع وصورة التحويل للمراجعة.', 2 FROM services WHERE slug IN ('funded-50k-starter','funded-100k','funded-200k-elite','vip-monthly','vip-quarterly','course-price-action','course-risk-management','offer-vip-quarter','offer-funded-bundle')
UNION ALL SELECT id, 'Choose the broker', 'اختار المنصة', 'Read the broker notes and important links before opening the account.', 'اقرأ ملاحظات المنصة والروابط المهمة قبل فتح الحساب.', 1 FROM services WHERE slug IN ('scalp-gtc','scalp-valtex')
UNION ALL SELECT id, 'Open from referral link', 'افتح من رابط الريفرال', 'Use the final external button after understanding the risks.', 'استخدم الزر الخارجي النهائي بعد فهم المخاطر.', 2 FROM services WHERE slug IN ('scalp-gtc','scalp-valtex');

INSERT INTO service_faqs (service_id, question_en, question_ar, answer_en, answer_ar, sort_order)
SELECT id, 'Is profit guaranteed?', 'هل الربح مضمون؟', 'No. Trading results are never guaranteed.', 'لا. نتائج التداول غير مضمونة.', 1 FROM services WHERE slug IN ('funded-50k-starter','funded-100k','funded-200k-elite','vip-monthly','vip-quarterly','course-price-action','course-risk-management','offer-vip-quarter','offer-funded-bundle')
UNION ALL SELECT id, 'Do I pay Hunter Trading for Scalp?', 'هل أدفع لـ Hunter Trading في السكالب؟', 'No. Scalp pages only explain broker account opening through referral links.', 'لا. صفحات السكالب تشرح فقط فتح حساب خارجي من روابط الريفرال.', 1 FROM services WHERE slug IN ('scalp-gtc','scalp-valtex');

INSERT INTO service_media (service_id, media_url, media_type, alt_text_en, alt_text_ar, sort_order)
SELECT id, thumbnail_url, 'image', title_en, title_ar, 1 FROM services WHERE slug IN ('funded-50k-starter','funded-100k','funded-200k-elite','vip-monthly','vip-quarterly','scalp-gtc','scalp-valtex','course-price-action','course-risk-management','offer-vip-quarter','offer-funded-bundle');

/* Coach profile */
INSERT INTO coach_profile
(id, name_en, name_ar, title_en, title_ar, bio_en, bio_ar, image_url, experience_years, students_count, profit_shared, telegram_url)
VALUES
(1, 'Mezo Rostom', 'ميزو رستم', 'Trading Coach', 'مدرب تداول', 'Trading coach focused on structure, risk, and practical execution.', 'مدرب تداول يركز على الخطة وإدارة المخاطر والتنفيذ العملي.', @coach_img, 6, 1200, '$2M+', 'https://t.me/MezoRostom')
ON DUPLICATE KEY UPDATE
name_en=VALUES(name_en), name_ar=VALUES(name_ar), title_en=VALUES(title_en), title_ar=VALUES(title_ar),
bio_en=VALUES(bio_en), bio_ar=VALUES(bio_ar), image_url=VALUES(image_url),
experience_years=VALUES(experience_years), students_count=VALUES(students_count), profit_shared=VALUES(profit_shared),
telegram_url=VALUES(telegram_url);

DELETE FROM coach_social_links WHERE platform IN ('telegram','whatsapp','instagram','youtube','facebook','tiktok');
INSERT INTO coach_social_links (platform, label, url, sort_order, is_enabled)
VALUES
('telegram', 'Telegram', 'https://t.me/MezoRostom', 1, 1),
('whatsapp', 'WhatsApp', 'https://wa.me/201000000000', 2, 1),
('instagram', 'Instagram', 'https://www.instagram.com/hunter_tradeing?igsh=MTVkdjZmZHA4MjExdQ==', 3, 1),
('youtube', 'YouTube', 'https://youtube.com/@hunter_tradeing', 4, 1),
('facebook', 'Facebook', 'https://www.facebook.com/share/1JxgBuyYV4/', 5, 1),
('tiktok', 'TikTok', 'https://www.tiktok.com/@hunter_tradeing?_r=1&_t=ZS-95eR5pPgPTB', 6, 1);

/* Testimonials */
DELETE FROM testimonials WHERE name IN ('Ahmed M.', 'Sara K.', 'Omar H.', 'Mona A.');
INSERT INTO testimonials (name, location, image_url, video_url, content_en, content_ar, rating, service_type, is_featured, is_approved, is_visible, order_index)
VALUES
('Ahmed M.', 'VIP Client', @img1, NULL, 'The VIP follow-up helped me trade with clearer rules.', 'متابعة VIP ساعدتني ألتزم بقواعد أوضح في التداول.', 5, 'vip', 1, 1, 1, 1),
('Sara K.', 'Course Student', @img2, NULL, 'The course made risk management much easier to apply.', 'الدورة خلت إدارة المخاطر أسهل في التطبيق.', 5, 'courses', 1, 1, 1, 2),
('Omar H.', 'Funded Account Client', @img3, NULL, 'The funded account checklist saved me from common mistakes.', 'تشيك ليست الحساب الممول جنبتني أخطاء متكررة.', 5, 'funded', 0, 1, 1, 3),
('Mona A.', 'Scalp User', @img4, NULL, 'The broker steps were clear before opening my account.', 'خطوات فتح حساب المنصة كانت واضحة قبل التسجيل.', 5, 'scalp', 0, 1, 1, 4);

/* Market updates */
DELETE FROM market_updates WHERE title_en LIKE 'Client Preview:%';
INSERT INTO market_updates (title_en, title_ar, summary_en, summary_ar, content_en, content_ar, category, image_url, is_visible, published_at)
VALUES
('Client Preview: Gold Watch', 'معاينة العميل: متابعة الذهب', 'Gold is near a key liquidity area. Wait for confirmation before execution.', 'الذهب قريب من منطقة سيولة مهمة. انتظر تأكيد قبل التنفيذ.', 'Short educational note for public preview data.', 'ملاحظة تعليمية قصيرة لبيانات المعاينة.', 'analysis', @img5, 1, NOW()),
('Client Preview: Risk Note', 'معاينة العميل: ملاحظة مخاطرة', 'Keep risk fixed and avoid moving stop loss during fast sessions.', 'ثبّت المخاطرة وتجنب تحريك وقف الخسارة أثناء الجلسات السريعة.', 'Short risk reminder for visitors.', 'تذكير قصير بإدارة المخاطر للزوار.', 'risk', @img6, 1, NOW());

/* Demo leads and orders for admin screens */
DELETE FROM leads WHERE email LIKE '%@clientpreview.local';
INSERT INTO leads (name, email, phone, source, telegram_joined)
VALUES
('عميل مهتم بالحسابات الممولة', 'funded@clientpreview.local', '01011111111', 'funded-section', 1),
('عميل مهتم بالـ VIP', 'vip@clientpreview.local', '01022222222', 'vip-section', 1),
('عميل مهتم بالسكالب', 'scalp@clientpreview.local', '01033333333', 'scalp-section', 0);

DELETE FROM payment_orders WHERE customer_email LIKE '%@clientpreview.local';
INSERT INTO payment_orders
(service_id, product_id, customer_name, customer_email, customer_phone, payment_method, amount, screenshot_url, status, redirect_url, admin_note)
SELECT id, id, 'عميل دفع قيد المراجعة', 'pending@clientpreview.local', '01044444444', 'vodafone_cash', price, @img1, 'pending', NULL, 'طلب تجريبي للمراجعة'
FROM services WHERE slug = 'vip-monthly'
UNION ALL
SELECT id, id, 'عميل تم تأكيده', 'approved@clientpreview.local', '01055555555', 'instapay', price, @img2, 'verified', '/services/course-price-action', 'تم التأكيد تجريبيًا'
FROM services WHERE slug = 'course-price-action'
UNION ALL
SELECT id, id, 'عميل يحتاج متابعة', 'review@clientpreview.local', '01066666666', 'bank_transfer', price, @img3, 'pending', NULL, 'تأكد من بيانات التحويل'
FROM services WHERE slug = 'funded-100k';

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
