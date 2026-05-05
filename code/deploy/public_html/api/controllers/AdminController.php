<?php
require_once __DIR__ . '/../config/database.php';

class AdminController {
    public function getDashboard() {
        try {
            $stats = [
                'total_leads' => fetchOne("SELECT COUNT(*) as count FROM leads")['count'],
                'total_courses' => fetchOne("SELECT COUNT(*) as count FROM courses")['count'],
                'total_signals' => fetchOne("SELECT COUNT(*) as count FROM signals")['count'],
                'active_signals' => fetchOne("SELECT COUNT(*) as count FROM signals WHERE status = 'active'")['count'],
                'total_users' => fetchOne("SELECT COUNT(*) as count FROM users")['count'],
            ];
            
            // Today's stats
            $today = date('Y-m-d');
            $stats['leads_today'] = fetchOne(
                "SELECT COUNT(*) as count FROM leads WHERE DATE(created_at) = ?",
                [$today]
            )['count'];
            
            $stats['clicks_today'] = fetchOne(
                "SELECT COUNT(*) as count FROM affiliate_clicks WHERE DATE(created_at) = ?",
                [$today]
            )['count'];
            
            // Recent leads
            $recent_leads = fetchAll("SELECT * FROM leads ORDER BY created_at DESC LIMIT 10");
            
            return json_encode([
                'success' => true,
                'data' => [
                    'stats' => $stats,
                    'recent_leads' => $recent_leads
                ]
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode(['success' => false, 'error' => 'Failed to fetch dashboard']);
        }
    }
}
