<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../lib/PlatformBootstrap.php';

class AdminController
{
    public function getDashboard()
    {
        try {
            PlatformBootstrap::ensure();

            $today = date('Y-m-d');
            $stats = [
                'total_leads' => fetchOne("SELECT COUNT(*) AS count FROM leads")['count'] ?? 0,
                'total_services' => fetchOne("SELECT COUNT(*) AS count FROM services")['count'] ?? 0,
                'active_services' => fetchOne("SELECT COUNT(*) AS count FROM services WHERE is_visible = 1")['count'] ?? 0,
                'total_market_updates' => fetchOne("SELECT COUNT(*) AS count FROM market_updates")['count'] ?? 0,
                'pending_orders' => fetchOne("SELECT COUNT(*) AS count FROM payment_orders WHERE status = 'pending'")['count'] ?? 0,
                'approved_testimonials' => fetchOne("SELECT COUNT(*) AS count FROM testimonials WHERE is_approved = 1 AND is_visible = 1")['count'] ?? 0,
                'total_users' => fetchOne("SELECT COUNT(*) AS count FROM users")['count'] ?? 0,
                'leads_today' => fetchOne("SELECT COUNT(*) AS count FROM leads WHERE DATE(created_at) = ?", [$today])['count'] ?? 0,
            ];

            $recentLeads = fetchAll("SELECT * FROM leads ORDER BY created_at DESC LIMIT 10");
            $recentOrders = fetchAll("
                SELECT o.id, o.customer_name, o.status, o.amount, o.created_at, s.title_en, s.title_ar
                FROM payment_orders o
                LEFT JOIN services s ON s.id = o.service_id
                ORDER BY o.created_at DESC
                LIMIT 10
            ");

            return json_encode([
                'success' => true,
                'data' => [
                    'stats' => $stats,
                    'recent_leads' => $recentLeads,
                    'recent_orders' => $recentOrders,
                ],
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode(['success' => false, 'error' => 'Failed to fetch dashboard']);
        }
    }
}
