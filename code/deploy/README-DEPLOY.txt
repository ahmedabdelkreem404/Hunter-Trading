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
