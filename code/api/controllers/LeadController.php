<?php
/**
 * Lead Controller
 * Handles lead capture and management
 */

require_once __DIR__ . '/../config/database.php';

class LeadController {
    
    /**
     * Create new lead
     */
    public function createLead($data) {
        try {
            // Validate email
            if (empty($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'error' => 'Valid email is required'
                ]);
            }
            
            // Check for duplicate
            $existing = fetchOne(
                "SELECT id FROM leads WHERE email = ?",
                [$data['email']]
            );
            
            if ($existing) {
                return json_encode([
                    'success' => true,
                    'message' => 'Lead already registered',
                    'data' => ['id' => $existing['id']]
                ]);
            }
            
            $id = insert(
                "INSERT INTO leads (name, email, phone, source) VALUES (?, ?, ?, ?)",
                [
                    $data['name'] ?? null,
                    $data['email'],
                    $data['phone'] ?? null,
                    $data['source'] ?? 'website'
                ]
            );
            
            // Track analytics
            $this->trackLeadSource($data['source'] ?? 'website');
            
            return json_encode([
                'success' => true,
                'data' => ['id' => $id]
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Failed to create lead'
            ]);
        }
    }
    
    /**
     * Get all leads (Admin only)
     */
    public function getLeads() {
        try {
            $leads = fetchAll("
                SELECT * FROM leads 
                ORDER BY created_at DESC
            ");
            
            $stats = [
                'total' => count($leads),
                'today' => count(array_filter($leads, fn($l) => date('Y-m-d', strtotime($l['created_at'])) === date('Y-m-d'))),
                'telegram_joined' => count(array_filter($leads, fn($l) => $l['telegram_joined']))
            ];
            
            return json_encode([
                'success' => true,
                'data' => [
                    'leads' => $leads,
                    'stats' => $stats
                ]
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Failed to fetch leads'
            ]);
        }
    }
    
    /**
     * Track lead source
     */
    private function trackLeadSource($source) {
        try {
            insert(
                "INSERT INTO analytics (event_type, event_data) VALUES (?, ?)",
                ['lead_capture', json_encode(['source' => $source])]
            );
        } catch (Exception $e) {
            // Silently fail analytics
        }
    }
}
