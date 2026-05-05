<?php
require_once __DIR__ . '/../config/database.php';

class AnalyticsController {
    public function track($data) {
        try {
            insert(
                "INSERT INTO analytics (event_type, event_data, ip_address, user_agent) VALUES (?, ?, ?, ?)",
                [
                    $data['event_type'] ?? 'unknown',
                    json_encode($data),
                    $_SERVER['REMOTE_ADDR'] ?? '',
                    $_SERVER['HTTP_USER_AGENT'] ?? ''
                ]
            );
            return json_encode(['success' => true]);
        } catch (Exception $e) {
            return json_encode(['success' => false, 'error' => 'Tracking failed']);
        }
    }
}
