<?php
require_once __DIR__ . '/../config/database.php';

class AffiliateController {
    public function trackClick($data) {
        try {
            insert(
                "INSERT INTO affiliate_clicks (broker_id, ip_address, user_agent) VALUES (?, ?, ?)",
                [
                    $data['broker_id'] ?? 'default',
                    $_SERVER['REMOTE_ADDR'] ?? '',
                    $_SERVER['HTTP_USER_AGENT'] ?? ''
                ]
            );
            
            // Also track in analytics
            insert(
                "INSERT INTO analytics (event_type, event_data) VALUES (?, ?)",
                ['affiliate_click', json_encode(['broker_id' => $data['broker_id'] ?? 'default'])]
            );
            
            return json_encode(['success' => true]);
        } catch (Exception $e) {
            return json_encode(['success' => false, 'error' => 'Tracking failed']);
        }
    }
}
