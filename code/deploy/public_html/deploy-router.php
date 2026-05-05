<?php
/**
 * Fixed development router for built deployment folder
 */
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = urldecode($uri);
$filepath = __DIR__ . $uri;

// 1. If it's an existing file found on disk (like assets), let the server handle it
if ($uri !== '/' && $uri !== '/index.html' && file_exists($filepath) && !is_dir($filepath)) {
    return false;
}

// 2. Handle API requests
if (strpos($uri, '/api') === 0) {
    // Mimic the RewriteRule logic
    // Set SCRIPT_NAME to api/index.php so scripts inside can handle paths correctly
    $_SERVER['SCRIPT_NAME'] = '/api/index.php';
    require_once __DIR__ . '/api/index.php';
    exit;
}

// 3. Handle uploads directory (static files)
if (strpos($uri, '/uploads') === 0 && file_exists($filepath) && !is_dir($filepath)) {
    return false;
}

// 4. Default for SPA: Serve index.html
if (file_exists(__DIR__ . '/index.html')) {
    header('Content-Type: text/html; charset=utf-8');
    readfile(__DIR__ . '/index.html');
} else {
    http_response_code(404);
    echo "404 - index.html not found in deploy directory.";
}
exit;
