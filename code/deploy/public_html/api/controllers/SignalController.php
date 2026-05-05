<?php
/**
 * Signal Controller
 * Handles trading signals management
 */

require_once __DIR__ . '/../config/database.php';

class SignalController {
    
    /**
     * Get signals with optional status filter
     */
    public function getSignals($status = null) {
        try {
            $sql = "SELECT * FROM signals";
            $params = [];
            
            if ($status) {
                $sql .= " WHERE status = ?";
                $params[] = $status;
            }
            
            $sql .= " ORDER BY created_at DESC LIMIT 50";
            
            $signals = fetchAll($sql, $params);
            
            // Calculate stats
            $totalPips = 0;
            $profitableCount = 0;
            $totalClosed = 0;
            
            foreach ($signals as $signal) {
                if ($signal['status'] !== 'active') {
                    $totalClosed++;
                    if ($signal['result_pips'] > 0) {
                        $profitableCount++;
                    }
                }
                $totalPips += $signal['result_pips'] ?? 0;
            }
            
            $winRate = $totalClosed > 0 ? round(($profitableCount / $totalClosed) * 100, 1) : 0;
            
            return json_encode([
                'success' => true,
                'data' => [
                    'signals' => $signals,
                    'stats' => [
                        'total_pips' => $totalPips,
                        'win_rate' => $winRate,
                        'total_signals' => count($signals),
                        'active_signals' => count(array_filter($signals, fn($s) => $s['status'] === 'active'))
                    ]
                ]
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Failed to fetch signals'
            ]);
        }
    }
    
    /**
     * Create new signal (Admin only)
     */
    public function createSignal($data) {
        try {
            $required = ['type', 'pair', 'entry_price', 'take_profit', 'stop_loss'];
            foreach ($required as $field) {
                if (!isset($data[$field])) {
                    http_response_code(400);
                    return json_encode([
                        'success' => false,
                        'error' => "Missing required field: $field"
                    ]);
                }
            }
            
            $id = insert(
                "INSERT INTO signals (type, pair, entry_price, take_profit, stop_loss, status) 
                 VALUES (?, ?, ?, ?, ?, ?)",
                [
                    $data['type'],
                    $data['pair'],
                    $data['entry_price'],
                    $data['take_profit'],
                    $data['stop_loss'],
                    'active'
                ]
            );
            
            return json_encode([
                'success' => true,
                'data' => ['id' => $id]
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Failed to create signal'
            ]);
        }
    }
    
    /**
     * Update signal (Admin only)
     */
    public function updateSignal($data) {
        try {
            if (empty($data['id'])) {
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'error' => 'Signal ID required'
                ]);
            }
            
            $fields = [];
            $params = [];
            
            $allowedFields = ['status', 'result_pips'];
            foreach ($allowedFields as $field) {
                if (isset($data[$field])) {
                    $fields[] = "$field = ?";
                    $params[] = $data[$field];
                }
            }
            
            if (empty($fields)) {
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'error' => 'No fields to update'
                ]);
            }
            
            $params[] = $data['id'];
            $sql = "UPDATE signals SET " . implode(', ', $fields) . " WHERE id = ?";
            
            modify($sql, $params);
            
            return json_encode([
                'success' => true,
                'message' => 'Signal updated successfully'
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Failed to update signal'
            ]);
        }
    }
}
