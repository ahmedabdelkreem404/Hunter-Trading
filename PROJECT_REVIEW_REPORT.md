# تقرير مراجعة مشروع Hunter Trading

تاريخ المراجعة: 2026-05-05  
نطاق المراجعة: بنية المشروع، الواجهة، لوحة الإدارة، PHP API، قاعدة البيانات، النشر، الأمان، الأداء، وقابلية الصيانة.

## 1. ملخص تنفيذي

المشروع عبارة عن منصة Trading Education / Services كاملة نسبيا، مبنية بواجهة React + Vite + Tailwind + Three.js، وواجهة خلفية PHP بسيطة تعتمد على MySQL وملفات controllers مباشرة بدون framework. الكود الحالي تطور من نموذج قديم فيه courses/signals/blog إلى نموذج موحد حول services بأنواع مثل funded و VIP و scalp و courses و offers.

الصورة العامة جيدة من ناحية المنتج: الصفحة الرئيسية ديناميكية، يوجد لوحة إدارة، إدارة خدمات ومنتجات، أوامر دفع، مكتبة وسائط، Testimonials، تحديثات سوق، إعدادات عامة، دعم عربي/إنجليزي، وثيم dark/light. البناء production ينجح، وملفات PHP الحالية لا تحتوي أخطاء syntax.

لكن توجد مخاطر مهمة قبل الاعتماد على المشروع في production:

- يوجد عدم تطابق واضح بين `database/schema.sql` واستعلامات API الحالية، خصوصا جداول `analytics` و `leads`.
- نسخة النشر داخل `code/deploy/public_html` قديمة وغير متزامنة مع الكود الحالي.
- `PlatformBootstrap` ينفذ تعديلات schema تلقائيا، وفيه حذف لجداول legacy عند زيارة endpoints عادية.
- بيانات دخول الأدمن في README لا تطابق seed الموجود في schema، وكلمة المرور المذكورة لا تعمل مع hash الموجود.
- نموذج Lead Magnet لا يرسل للـ API فعليا، بل يحاكي الطلب فقط.
- توجد ملاحظات أمنية حول CORS/session/CSRF ورفع الملفات.
- `npm audit` أظهر ثغرتين في dependencies، واحدة high في axios وواحدة moderate في follow-redirects.
- حجم bundle كبير جدا بسبب تحميل React Three/Fiber وThree.js ضمن الحزمة الرئيسية.

## 2. بنية المشروع

الهيكل الفعلي:

- `README.md`: تعليمات تشغيل عربية.
- `code/package.json`: مشروع Vite/React، scripts للتشغيل والبناء.
- `code/src`: واجهة React.
- `code/api`: PHP API الحالي.
- `code/database/schema.sql`: schema مبدئي.
- `code/router.php`: راوتر محلي للـ PHP built-in server.
- `code/deploy/public_html`: نسخة نشر جاهزة، لكنها تبدو قديمة مقارنة بالـ API الحالي.
- `code/scripts`: سكربتات تشغيل وتحضير نشر.

الستاك:

- Frontend: React 18, Vite 5, Tailwind, Framer Motion, React Router, i18next.
- 3D: Three.js, @react-three/fiber, @react-three/drei.
- Backend: PHP 8 style procedural helpers + controllers.
- Database: MySQL via PDO.
- Deployment: build static assets + نسخ API وuploads إلى public_html.

أوامر مهمة من `code/package.json`:

- `npm run dev`: يشغل سكربت `scripts/dev-stack.ps1`.
- `npm run dev:web`: Vite على `127.0.0.1:5173`.
- `npm run dev:api`: PHP server على `127.0.0.1:8000`.
- `npm run build`: Vite production build.

## 3. الواجهة الأمامية

### نقاط قوة

- استخدام React Router بشكل واضح للصفحة الرئيسية، صفحة الأدمن، صفحات العروض، checkout، والصفحات القانونية.
- دعم لغتين عبر `react-i18next` مع ضبط `dir` و `lang`.
- ThemeProvider بسيط ومفهوم، مع حفظ preference في localStorage.
- تقسيم الصفحة الرئيسية إلى sections قابلة للترتيب والإظهار من قاعدة البيانات.
- تصميم بصري غني ويستخدم Three.js في hero.
- مكونات الخدمات موحدة عبر `PremiumProductSection`، وهذا يقلل تكرار funded/vip/courses/offers/scalp.
- لوحة الإدارة تغطي أغلب احتياجات التشغيل اليومية.

### ملاحظات مهمة

1. كثافة polling عالية ومتكررة.

   يوجد `useApiData` يدعم `refreshInterval` عبر `window.setInterval` في `code/src/hooks/useApiData.js:39-40`. كثير من المكونات تستدعي نفس endpoints كل 10 أو 15 أو 30 ثانية، مثل:

   - `settingsAPI.getPublic` في `App`, `Hero`, `Navbar`, `Footer`, `Testimonials`, `Signals`, `TelegramFloating`.
   - `sectionSettingsAPI.getPublic` في `App`, `Hero`, `Coach`, `PremiumProductSection`, `Testimonials`, `Signals`.

   النتيجة المتوقعة: عدد طلبات مرتفع لكل زائر، خصوصا في الصفحة الرئيسية. الأفضل عمل shared cache/context للـ settings والـ sections أو استخدام SWR/React Query مع deduping.

2. الـ Lead Magnet لا يحفظ lead فعليا.

   في `code/src/components/ui/LeadMagnet.jsx:18-22` يوجد تعليق يقول إن الطلب simulated، والاستدعاء الحقيقي `axios.post('/api/leads', formData)` معلق. كذلك يوجد `import axios` غير مستخدم فعليا في `code/src/components/ui/LeadMagnet.jsx:5`. هذا يعني أن modal جمع البريد لن يسجل lead في قاعدة البيانات.

3. بعض صفحات العروض مسماة Blog.

   `BlogPage.jsx` و `BlogPostPage.jsx` يعرضان offers من `servicesAPI` وليس blog فعلي. هذا ليس خطأ تشغيل، لكنه يربك الصيانة ويجعل SPEC القديم غير مطابق.

4. Three.js داخل المسار الرئيسي.

   `Hero.jsx` يستورد `Canvas` و `TradingScene` مباشرة، و`TradingScene` نفسه يستخدم Three.js/Drei. نتيجة build أظهرت bundle JS بحجم تقريبي `1,457.24 kB` قبل gzip و `426.53 kB` gzip. الأفضل lazy-load للـ hero scene أو code splitting.

5. لا توجد scripts واضحة لـ lint أو test.

   `package.json` يحتوي build/dev/preview فقط. لا يوجد `lint`, `test`, أو e2e script رغم وجود dependency اسمها `playwright`.

## 4. لوحة الإدارة

لوحة الإدارة في `code/src/pages/admin/AdminApp.jsx` جيدة من ناحية نطاق الوظائف:

- Dashboard overview.
- Website content / sections.
- Services & Products.
- Payment Orders.
- Testimonials.
- Market Follow-up.
- Media Library.
- Coach & Social.
- Settings.
- Leads / Customers.

نقاط قوة:

- تحميل أولي شامل عبر `Promise.all`.
- معالجة Unauthorized بإرجاع المستخدم للـ login.
- UX مقبول للتنبيهات وحالات saving.
- فصل الموديولات تحت `src/pages/admin/modules`.

ملاحظات:

- كل وظائف الأدمن محمية بالجلسة فقط، بدون CSRF token.
- لا توجد صلاحيات متعددة حقيقية رغم وجود `role`.
- الحذف يتم مباشرة من UI بدون تأكيد واضح في الكود العام.
- بعض مسارات الحذف تستخدم endpoint غير RESTful مثل `coach/social-links/delete` و `media/delete`.

## 5. الواجهة الخلفية PHP API

### الصورة العامة

الـ API الحالي في `code/api/index.php` يستخدم route matching يدوي على `$path`. المسارات الرئيسية الحالية:

- `GET /api/sections`
- `GET /api/settings/public`
- `GET /api/coach`
- `GET /api/services`
- `GET /api/services/{slug}`
- `GET /api/market/updates`
- `GET /api/testimonials`
- `POST /api/checkout/orders`
- `POST /api/leads`
- `POST /api/analytics/track`
- Auth: login/logout/check
- Admin: dashboard/services/orders/sections/market/testimonials/leads/settings/coach/media

نقاط قوة:

- استخدام PDO prepared statements في helpers.
- `password_verify` مستخدم في login.
- فصل منطقي للcontrollers.
- `PlatformBootstrap` يحاول ترقية schema القديم تلقائيا.
- الملفات الحالية اجتازت `php -l`.

### مخاطر وملاحظات

1. عدم تطابق schema مع استعلامات API.

   `AnalyticsController` يكتب في أعمدة `event_type`, `event_data`, `ip_address`, `user_agent` في `code/api/controllers/AnalyticsController.php:8`. لكن `database/schema.sql` يعرف جدول `analytics` بأعمدة `event_name`, `event_data`, `created_at` فقط في `code/database/schema.sql:223-225`.

   كذلك `LeadController` يحسب `telegram_joined` في `code/api/controllers/LeadController.php:78`، لكن جدول `leads` في schema لا يحتوي هذا العمود. هذا سيؤدي إلى warnings/أخطاء حسب إعدادات PHP والبيانات.

2. `PlatformBootstrap` يقوم بحذف جداول legacy.

   في `code/api/lib/PlatformBootstrap.php:398-414` توجد دالة `removeLegacyArtifacts` تحذف جداول مثل `courses`, `blog_posts`, `signals`, `home_content`. ويتم استدعاؤها داخل `ensure()` عند endpoints متعددة. هذا خطر على أي قاعدة بيانات بها بيانات قديمة لم يتم ترحيلها بالكامل.

3. bootstrap يخلط بين migration وruntime.

   إنشاء/تعديل الجداول يحدث أثناء طلبات API عادية. هذا يسهل التطوير، لكنه غير مناسب للإنتاج لأنه يجعل أول request قادرا على تعديل schema أو إسقاط جداول. الأفضل نقلها إلى migration script صريح.

4. رفع الملفات يعتمد على MIME من العميل.

   في `SettingsController` و `PaymentOrderController` يتم فحص `$file['type']` فقط. هذا قابل للتلاعب. يجب استخدام `finfo_file` والتحقق من الامتداد والمحتوى. كذلك payment order upload لا يحتوي حد حجم مثل media upload.

5. معالجة الأخطاء تخفي تفاصيل مفيدة أحيانا وتعرضها أحيانا.

   بعض controllers ترجع رسالة عامة، وبعضها يضيف `getMessage()` للرد. في production الأفضل توحيد error logging والردود.

## 6. قاعدة البيانات

schema الحالي يغطي الجداول الأساسية:

- users
- site_settings
- media
- coach_profile
- coach_social_links
- section_settings
- services وعلاقاتها
- testimonials
- market_updates
- payment_orders
- leads
- analytics

لكن توجد مشاكل:

1. Seed الأدمن لا يطابق README.

   README يذكر:

   - email: `admin@huntertrading.com`
   - password: `password`

   بينما `database/schema.sql:230-231` يزرع `admin@huntertrading.local` وhash مختلف. اختبرت `password_verify('password', hash الموجود)` وكانت النتيجة false. هذا يعني أن تعليمات الدخول الحالية غالبا لن تعمل من schema وحده.

2. لا يوجد seed واضح لـ `coach_profile`.

   `SettingsController` يرجع profile افتراضي لو الجدول فارغ، لكن update يستخدم `UPDATE coach_profile ... LIMIT 1`، وupload يستخدم `WHERE id = 1`. لو الجدول فارغ، بعض عمليات التحديث لن تنشئ profile جديد.

3. نقص أعمدة مقارنة بالـ controllers.

   مثل `analytics.event_type` و `analytics.ip_address` و `analytics.user_agent` و `leads.telegram_joined`.

4. لا توجد migration versioning.

   يوجد schema كامل وPlatformBootstrap، لكن لا يوجد نظام migrations بإصدارات واضحة.

## 7. النشر Deployment

يوجد سكربت جيد نسبيا في `code/scripts/prepare-public-html.ps1`:

- يشغل `npm run build`.
- ينسخ `dist` إلى `deploy/public_html`.
- ينسخ `api`, `uploads`, `schema.sql`, و`.env.production.example`.
- ينشئ `.htaccess` للـ SPA والـ API.
- يضغط public_html إلى zip.

لكن النسخة الحالية داخل `code/deploy/public_html` غير متزامنة مع الكود الحالي:

- `code/deploy/public_html/api/index.php` يحتوي routes قديمة مثل `content/home`, `courses`, `signals`, `market/live-signals` في الأسطر `25`, `32`, `39`, `46`.
- `code/api/index.php` الحالي يحتوي routes جديدة مثل `checkout/orders` و `admin/services` في `code/api/index.php:85` و `code/api/index.php:142`.
- `code/deploy/public_html/api/controllers` يحتوي controllers قديمة غير موجودة في API الحالي مثل Course/Signal/Blog/Content/Affiliate.

هذا يعني أن رفع مجلد `deploy/public_html` الحالي بدون إعادة تشغيل prepare script قد ينشر نسخة قديمة من النظام.

ملاحظة أمنية: ملف `.env.production.example` يحتوي قيمة API key مملوءة وليست placeholder. حتى لو كان example، الأفضل تدوير المفتاح واستبداله بقيمة مثل `YOUR_TWELVE_DATA_API_KEY`.

## 8. الأمان

أهم الملاحظات:

1. CORS مفتوح.

   `code/api/config/cors.php:7` يرسل `Access-Control-Allow-Origin: *`، بينما الواجهة تستخدم `withCredentials: true` في `code/src/api/index.js:7`. مع الجلسات، الأفضل تحديد origins صريحة وإضافة `Access-Control-Allow-Credentials: true` عند الحاجة.

2. لا يوجد CSRF protection.

   الجلسة تبدأ في `code/api/config/cors.php:27`، والـ admin mutations تعتمد على session cookie. بدون CSRF token، أي موقع قادر على إرسال forms/requests قد يستهدف جلسة الأدمن حسب إعدادات المتصفح والسيرفر.

3. لا يوجد `session_regenerate_id` بعد login.

   `AuthController` يضع بيانات الجلسة مباشرة في `code/api/controllers/AuthController.php:38` بدون تدوير session ID. الأفضل استخدام `session_regenerate_id(true)` بعد نجاح الدخول.

4. لا توجد rate limiting أو lockout للـ login.

   AuthController يتحقق من email/password فقط. يجب إضافة rate limiting أو تأخير/قفل مؤقت.

5. رفع الملفات يحتاج تشديد.

   يجب استخدام `finfo_file`, حد حجم لكل uploads، أسماء آمنة، ومنع تنفيذ PHP داخل `uploads` على السيرفر.

6. مفاتيح وأسرار.

   `.env.production.example` يحتوي key فعلي الشكل. لا يجب تخزين أي مفاتيح حقيقية في repo.

## 9. الأداء

نتيجة `npm run build`:

- build ناجح.
- JS bundle الرئيسي: حوالي `1.46 MB`.
- gzip: حوالي `426 KB`.
- Vite أظهر warning لأن chunk أكبر من 500 kB.

الأسباب المحتملة:

- Three.js وReact Three/Fiber داخل الحزمة الرئيسية.
- لوحة الإدارة مدمجة مع bundle التطبيق العام.
- لا يوجد manualChunks أو lazy loading واضح للموديولات الثقيلة.

توصيات:

- lazy load للـ admin routes.
- lazy load لـ `TradingScene`.
- فصل vendor chunks: react, three, admin.
- تقليل polling أو استخدام cache.

## 10. جودة الاختبارات والفحوصات

تم تنفيذ:

- `npm run build`: نجح مع تحذير حجم bundle.
- `php -l` على ملفات PHP في `code/api` و `router.php`: بدون syntax errors.
- `npm audit --omit=dev --audit-level=moderate`: فشل بسبب vulnerabilities.

نتيجة audit:

- `axios` بإصدار مقفل `1.14.0` في `package-lock.json:1700-1706` عليه ثغرات high حسب audit.
- `follow-redirects` بإصدار `1.15.11` في `package-lock.json:2238-2240` عليه ثغرة moderate حسب audit.
- `npm audit fix` متاح.

لم يتم تشغيل اختبارات unit/e2e لأن المشروع لا يحتوي scripts واضحة لها.

## 11. ترتيب الأولويات المقترح

### أولوية عاجلة

1. إصلاح schema mismatch:
   - تحديث `analytics` ليحتوي `event_type`, `ip_address`, `user_agent` أو تعديل controllers لاستخدام `event_name`.
   - إضافة `telegram_joined` إلى leads أو إزالة الاعتماد عليه.

2. تعطيل حذف الجداول التلقائي:
   - إزالة `removeLegacyArtifacts()` من runtime.
   - عمل migration صريح وآمن للبيانات القديمة.

3. تحديث نسخة النشر:
   - تشغيل `scripts/prepare-public-html.ps1`.
   - التأكد أن `deploy/public_html/api` يطابق `code/api`.
   - عدم رفع النسخة القديمة الحالية.

4. إصلاح بيانات الأدمن:
   - توحيد README والـ schema والـ placeholder.
   - إنشاء hash صحيح لكلمة مرور مؤقتة أو إجبار تغيير كلمة المرور أول دخول.

5. تدوير أي API keys موجودة في ملفات example واستبدالها placeholders.

### أولوية عالية

6. تفعيل LeadMagnet API الحقيقي.

7. تقوية جلسات الأدمن:
   - `session_regenerate_id(true)`.
   - CSRF tokens.
   - cookie flags مثل HttpOnly/SameSite/Secure حسب البيئة.
   - rate limiting للـ login.

8. إصلاح `npm audit`.

9. تشديد رفع الملفات:
   - `finfo_file`.
   - حد حجم لكل endpoint.
   - منع تنفيذ scripts من uploads.

### أولوية متوسطة

10. تقليل bundle:
    - lazy-load admin و3D scene.
    - manualChunks.

11. تقليل polling:
    - cache للـ settings/sections.
    - invalidation من لوحة الإدارة بدل refresh كثيف.

12. إضافة scripts:
    - `lint`.
    - `test`.
    - `e2e` أو smoke tests.

13. إعادة تسمية صفحات Blog إلى Offers أو إضافة blog حقيقي إن كان مطلوبا.

## 12. الخلاصة

المشروع قابل للتطوير وفيه أساس جيد لمنتج تجاري: واجهة قوية، إدارة محتوى، منتجات وخدمات، checkout يدوي، ودعم لغتين. أكبر مشكلة ليست في شكل التطبيق، بل في الاتساق التشغيلي: schema، deploy، migration، والأمان.

قبل الإنتاج الحقيقي، أنصح بمعالجة البنود العاجلة أولا، ثم تشغيل smoke test كامل على بيئة fresh database:

1. import schema.
2. login admin.
3. create service.
4. view service on homepage.
5. submit checkout order with screenshot.
6. submit lead.
7. verify admin dashboard counts.
8. build and deploy from `prepare-public-html.ps1`.

بعد هذه الجولة، سيكون المشروع أقرب بكثير لنسخة production مستقرة وآمنة.
