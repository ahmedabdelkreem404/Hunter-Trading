$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$deployRoot = Join-Path $projectRoot 'deploy'
$publicHtml = Join-Path $deployRoot 'public_html'
$zipPath = Join-Path $deployRoot 'public_html.zip'

if (Test-Path $publicHtml) {
  Remove-Item -LiteralPath $publicHtml -Recurse -Force
}

if (Test-Path $zipPath) {
  Remove-Item -LiteralPath $zipPath -Force
}

Push-Location $projectRoot
try {
  npm run build

  New-Item -ItemType Directory -Path $publicHtml | Out-Null

  Copy-Item -Path (Join-Path $projectRoot 'dist\*') -Destination $publicHtml -Recurse -Force
  Copy-Item -Path (Join-Path $projectRoot 'api') -Destination (Join-Path $publicHtml 'api') -Recurse -Force
  Copy-Item -Path (Join-Path $projectRoot 'uploads') -Destination (Join-Path $publicHtml 'uploads') -Recurse -Force
  Copy-Item -Path (Join-Path $projectRoot 'database\schema.sql') -Destination (Join-Path $deployRoot 'schema.sql') -Force
  Copy-Item -Path (Join-Path $projectRoot 'database\migrations') -Destination (Join-Path $deployRoot 'migrations') -Recurse -Force
  Copy-Item -Path (Join-Path $projectRoot '.env.production.example') -Destination (Join-Path $deployRoot '.env.production.example') -Force

  @'
Options -Indexes
DirectoryIndex index.html

<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /

RewriteRule ^api/ - [L]
RewriteRule ^uploads/ - [L]

RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

RewriteRule . /index.html [L]
</IfModule>
'@ | Set-Content -Path (Join-Path $publicHtml '.htaccess') -Encoding UTF8

  @'
Options -Indexes
DirectoryIndex index.php

<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /api/

RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

RewriteRule . index.php [QSA,L]
</IfModule>
'@ | Set-Content -Path (Join-Path $publicHtml 'api\.htaccess') -Encoding UTF8

  @'
# Hunter Trading Deployment

ارفع محتويات مجلد `public_html` إلى `public_html` في الاستضافة.

الخطوات:
1. استورد ملف `schema.sql` في قاعدة البيانات.
2. انسخ `.env.production.example` إلى `.env` داخل `public_html/api/../../` أو داخل جذر المشروع المرفوع بجوار `api` واملأ بيانات قاعدة البيانات.
3. تأكد أن PHP و MySQL مفعّلان على الاستضافة.
4. تأكد أن مجلد `uploads` قابل للكتابة.

محتويات الرفع:
- `public_html/` : ملفات الموقع والـ API والرفع.
- `schema.sql` : إنشاء الجداول.
- `migrations/` : تحديثات يدوية آمنة لقواعد البيانات الموجودة.
- `.env.production.example` : مثال إعدادات الإنتاج.
'@ | Set-Content -Path (Join-Path $deployRoot 'README-DEPLOY.txt') -Encoding UTF8

  @'
# Allow access to uploaded files
<FilesMatch "\.(?i:jpg|jpeg|png|gif|webp|mp4|webm|mov)$">
    Order Allow,Deny
    Allow from all
</FilesMatch>

# Prevent direct PHP execution
<IfModule mod_php.c>
php_flag engine off
</IfModule>
RemoveHandler .php .phtml .php3 .php4 .php5 .php7 .php8

<FilesMatch "\.(?i:php|phtml|php3|php4|php5|php7|php8)$">
    Order Deny,Allow
    Deny from all
</FilesMatch>
'@ | Set-Content -Path (Join-Path $publicHtml 'uploads\.htaccess') -Encoding UTF8

  $zipItems = Get-ChildItem -Path $publicHtml -Force
  Compress-Archive -Path $zipItems.FullName -DestinationPath $zipPath -Force
}
finally {
  Pop-Location
}

Write-Output "Prepared deployment at: $publicHtml"
Write-Output "Zip package: $zipPath"
