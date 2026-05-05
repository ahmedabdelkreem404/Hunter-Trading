# Hunter Trading

موقع عميل لبيع وتسويق خدمات التداول، مبني بواجهة `React + Vite` مع API مبني بـ `PHP` وقاعدة بيانات `MySQL`.

المشروع مملوك لعميل واحد وليس منصة متعددة العملاء أو منتج اشتراكات. لوحة التحكم مخصصة لإدارة محتوى الموقع الظاهر للزوار: الخدمات، العروض، الكورسات، روابط الإحالة، المدفوعات، السوشيال، والمحتوى القانوني.

## مكان المشروع

الكود الفعلي داخل مجلد `code/`.

## المتطلبات

- `Node.js`
- `PHP 8.2+`
- `MySQL`
- `XAMPP` مناسب جدًا في هذه النسخة

## تشغيل المشروع

افتح طرفية واحدة داخل `code/`.

### 1. تشغيل الـ API والفرونت معًا

قبل تشغيل الـ API لو عايز `Trading Signals` تكون حية من الفوركس والذهب، حدد مفتاح Twelve Data:

```powershell
$env:TWELVE_DATA_API_KEY="YOUR_TWELVE_DATA_KEY"
```

ثم شغل المشروع:

```powershell
npm run dev
```

الفرونت اند هيعمل على:

```text
http://127.0.0.1:5173
```

والـ API هيعمل على:

```text
http://127.0.0.1:8000
```

الأمر `npm run dev` بينظف أي dev servers قديمة من نفس المشروع، ثم يشغل الـ API والفرونت معًا.

### 2. تشغيل كل جزء لوحده عند الحاجة

```powershell
npm run dev:api
npm run dev:web
```

الـ Vite proxy متضبط بحيث أي طلب إلى `/api` يروح تلقائيًا إلى `http://127.0.0.1:8000`.

## بيانات الدخول

لوحة الأدمن:

```text
http://127.0.0.1:5173/admin/login
```

الحساب الافتراضي:

```text
Email: admin@huntertrading.com
Password: password
```

مهم: هذه كلمة مرور مؤقتة للتشغيل الأول فقط. غيّر كلمة مرور الأدمن فور الدخول قبل استخدام الموقع في production.

## قاعدة البيانات

إعدادات الاتصال موجودة في:

```text
code/api/config/database.php
```

الإعدادات الحالية:

```text
Host: localhost
Database: hunter_trading
User: root
Password:
```

ملف الـ schema موجود هنا:

```text
code/database/schema.sql
```

مهم:
- قاعدة البيانات موجودة ومفعلة بالفعل في البيئة الحالية.
- لو احتجت إعادة إنشائها يدويًا، نفّذ الـ schema بحذر لأن بعض الجداول قد تكون موجودة مسبقًا.

## أوامر مهمة

بناء نسخة production:

```powershell
cd code
npm run build
```

الناتج يطلع داخل:

```text
code/dist
```

تجهيز نسخة الرفع داخل `code/deploy/public_html`:

```powershell
cd code
powershell -ExecutionPolicy Bypass -File scripts\prepare-public-html.ps1
```

## خطوات النشر

1. ارفع محتويات `code/deploy/public_html` إلى `public_html` في الاستضافة.
2. لو قاعدة البيانات جديدة، استورد `code/deploy/schema.sql`. لو قاعدة البيانات موجودة بالفعل، شغّل ملفات `code/deploy/migrations` بالترتيب.
3. انسخ `code/deploy/.env.production.example` إلى `.env` بجوار مجلد `api` أو في جذر المشروع المرفوع، ثم اضبط `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`, و`TWELVE_DATA_API_KEY`.
4. اضبط `CORS_ALLOWED_ORIGINS` في `.env` على دومين الموقع الفعلي عند الحاجة، مثل `https://example.com`.
5. ادخل لوحة الأدمن بالحساب المؤقت وغيّر كلمة المرور فورًا قبل تسليم الموقع.
6. تأكد من حدود الرفع في الاستضافة (`upload_max_filesize` و`post_max_size`) بحيث تناسب صور وفيديوهات الموقع، وأن مجلد `uploads` قابل للكتابة.
7. راجع أن `uploads/.htaccess` موجود لمنع تنفيذ ملفات PHP داخل مجلد الرفع.

## ما تم تجهيزه

- تشغيل API محليًا عن طريق `router.php`
- تفعيل الـ session للأدمن
- ربط أجزاء الواجهة الأساسية بالباك اند بدل البيانات الثابتة
- إضافة `Live Market Feed` لقسم `Trading Signals` عبر `Twelve Data` مع تحديث تلقائي كل 15 ثانية
- تنظيف ملفات debug/test/build القديمة غير المستخدمة
- التأكد أن `npm run build` ينجح

## هيكل سريع

```text
Hunter Trading/
├── README.md
├── code/
│   ├── api/
│   ├── database/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── router.php
├── hunter-trading.zip
└── pasted-text-2026-04-01T16-56-05.txt
```

## ملاحظات

- يوجد تحذير فقط أثناء `build` بخصوص حجم الـ bundle، لكنه لا يمنع التشغيل.
- لو هتنقل المشروع لسيرفر خارجي، تأكد من تحديث إعدادات قاعدة البيانات و`vite.config.js` حسب البيئة الجديدة.
