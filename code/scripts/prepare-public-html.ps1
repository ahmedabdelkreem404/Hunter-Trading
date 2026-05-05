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

This is a single-client trading services website for one business. It is not a multi-client platform or a subscription product.

Upload the contents of `public_html` to the hosting account's `public_html` directory.

Steps:
1. For a new database, import `schema.sql`.
2. For an existing database, run the files under `migrations/` in order before opening the website to visitors.
3. Copy `.env.production.example` to `.env` beside the uploaded `api` directory, then fill in `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`, and `TWELVE_DATA_API_KEY` if live market data is needed.
4. Set `CORS_ALLOWED_ORIGINS` to the real website domain, for example `https://example.com`.
5. Confirm PHP and MySQL are enabled on the hosting account.
6. Confirm `uploads` is writable and `uploads/.htaccess` exists to block PHP execution inside uploaded files.
7. Verify hosting upload limits such as `upload_max_filesize` and `post_max_size` are large enough for service images and videos.
8. Log in with the temporary admin account, then change the password immediately before client delivery or production use.

Package contents:
- `public_html/`: website files, API, and uploads.
- `schema.sql`: fresh database schema.
- `migrations/`: safe manual migrations for existing databases.
- `.env.production.example`: production env example with placeholder values only.
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
