<?php
require_once __DIR__ . '/../config/database.php';

class ResultController {
    public function getResults() {
        try {
            $results = fetchAll("SELECT * FROM results ORDER BY created_at DESC LIMIT 20");
            
            // Calculate totals
            $totalProfit = 0;
            $totalTrades = 0;
            $totalWon = 0;
            
            foreach ($results as $r) {
                $totalProfit += $r['profit_amount'] ?? 0;
                $totalTrades += $r['total_trades'] ?? 0;
                if (isset($r['win_rate'])) {
                    $totalWon += ($r['win_rate'] * $r['total_trades']) / 100;
                }
            }
            
            $overallWinRate = $totalTrades > 0 ? round(($totalWon / $totalTrades) * 100, 1) : 0;
            
            return json_encode([
                'success' => true,
                'data' => [
                    'results' => $results,
                    'stats' => [
                        'total_profit' => $totalProfit,
                        'total_trades' => $totalTrades,
                        'win_rate' => $overallWinRate,
                        'avg_monthly' => $totalProfit / 12
                    ]
                ]
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode(['success' => false, 'error' => 'Failed to fetch results']);
        }
    }
}
