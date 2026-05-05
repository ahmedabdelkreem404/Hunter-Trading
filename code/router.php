<?php

$requestPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$filePath = __DIR__ . $requestPath;

if ($requestPath !== '/' && file_exists($filePath) && !is_dir($filePath)) {
    return false;
}

if ($requestPath === '/' || $requestPath === '') {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'name' => 'Hunter Trading API',
        'status' => 'ok',
        'base_url' => 'http://localhost:8000/api'
    ]);
    return true;
}

if ($requestPath === '/favicon.ico') {
    http_response_code(204);
    return true;
}

if (strpos($requestPath, '/api') === 0) {
    require __DIR__ . '/api/index.php';
    return true;
}

http_response_code(404);
header('Content-Type: application/json; charset=utf-8');
echo json_encode(['error' => 'Not found']);
return true;
