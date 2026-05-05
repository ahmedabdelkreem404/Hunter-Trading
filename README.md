# Hunter Trading

واجهة `React + Vite` مع API مبني بـ `PHP` وقاعدة بيانات `MySQL`.

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
