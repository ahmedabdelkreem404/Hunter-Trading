<?php
/**
 * Environment loader helpers
 */

if (!function_exists('loadEnvFile')) {
    function loadEnvFile($path, $override = true) {
        if (!file_exists($path)) {
            return;
        }

        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if (!$lines) {
            return;
        }

        foreach ($lines as $line) {
            $trimmed = trim($line);
            if ($trimmed === '' || str_starts_with($trimmed, '#') || !str_contains($trimmed, '=')) {
                continue;
            }

            [$key, $value] = explode('=', $trimmed, 2);
            $key = trim($key);
            $value = trim($value);

            if ($key !== '' && ($override || getenv($key) === false)) {
                putenv("{$key}={$value}");
                $_ENV[$key] = $value;
            }
        }
    }
}

loadEnvFile(__DIR__ . '/../../.env');
loadEnvFile(__DIR__ . '/../../.env.local');
