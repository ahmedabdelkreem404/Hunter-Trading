<?php

require_once __DIR__ . '/../config/market.php';

class MarketController {
    public function getLiveSignals() {
        if (!MARKET_DATA_API_KEY) {
            http_response_code(503);
            return json_encode([
                'success' => false,
                'error' => 'Live market feed is not configured',
                'setup_required' => true,
            ]);
        }

        try {
            $cached = $this->readCache();
            if ($cached) {
                return json_encode([
                    'success' => true,
                    'cached' => true,
                    'data' => $cached,
                ]);
            }

            $signals = [];
            foreach (getMarketSymbols() as $symbol) {
                $candles = $this->fetchTimeSeries($symbol);

                if (!$candles) {
                    continue;
                }

                $latestCandle = $candles[0];
                $sessionCandles = array_reverse($candles);
                $sessionOpen = $this->toFloat($sessionCandles[0]['open'] ?? null);
                $price = $this->toFloat($latestCandle['close'] ?? null);
                $high = $this->toFloat($latestCandle['high'] ?? null);
                $low = $this->toFloat($latestCandle['low'] ?? null);
                $open = $this->toFloat($latestCandle['open'] ?? null);
                $change = ($sessionOpen !== null && $price !== null) ? ($price - $sessionOpen) : null;
                $percentChange = ($sessionOpen !== null && $sessionOpen != 0 && $change !== null)
                    ? (($change / $sessionOpen) * 100)
                    : null;

                if ($price === null) {
                    continue;
                }

                $signals[] = $this->buildTradeSignal($symbol, $candles, [
                    'price' => $price,
                    'change' => $change,
                    'percent_change' => $percentChange,
                    'open' => $open,
                    'high' => $high,
                    'low' => $low,
                ]);
            }

            $payload = [
                'provider' => 'Twelve Data',
                'disclaimer' => 'Signals use a short-term momentum strategy with EMA trend and candle volatility. They are educational and not financial advice.',
                'signals' => $signals,
                'updated_at' => gmdate('c'),
            ];

            $this->writeCache($payload);

            return json_encode([
                'success' => true,
                'cached' => false,
                'data' => $payload,
            ]);
            if (!$signals) {
                $stale = $this->readCache(true);
                if ($stale) {
                    return json_encode([
                        'success' => true,
                        'cached' => true,
                        'stale' => true,
                        'data' => $stale,
                    ]);
                }
            }
        } catch (Exception $e) {
            $stale = $this->readCache(true);
            if ($stale) {
                return json_encode([
                    'success' => true,
                    'cached' => true,
                    'stale' => true,
                    'data' => $stale,
                ]);
            }

            http_response_code(502);
            return json_encode([
                'success' => false,
                'error' => 'Failed to load live market data',
            ]);
        }
    }

    private function fetchTimeSeries($symbol) {
        $url = MARKET_DATA_BASE_URL . '/time_series?symbol=' . rawurlencode($symbol) . '&interval=15min&outputsize=20&apikey=' . rawurlencode(MARKET_DATA_API_KEY);
        $response = $this->httpGetJson($url);

        if (!$response || empty($response['values']) || (isset($response['status']) && $response['status'] === 'error')) {
            return null;
        }

        return $response['values'];
    }

    private function buildTradeSignal($symbol, $candles, $snapshot) {
        $candles = array_reverse($candles);
        $closes = array_map(fn($c) => $this->toFloat($c['close'] ?? null), $candles);
        $highs = array_map(fn($c) => $this->toFloat($c['high'] ?? null), $candles);
        $lows = array_map(fn($c) => $this->toFloat($c['low'] ?? null), $candles);

        $price = $snapshot['price'];
        $emaFast = $this->ema($closes, 5);
        $emaSlow = $this->ema($closes, 9);
        $lastClose = end($closes);
        $previousClose = count($closes) > 1 ? $closes[count($closes) - 2] : $lastClose;
        $lastHigh = end($highs);
        $lastLow = end($lows);
        $averageRange = $this->averageRange($highs, $lows, 10);
        $direction = ($emaFast >= $emaSlow) ? 'buy' : 'sell';
        $trendDelta = abs($emaFast - $emaSlow);
        $trendScore = $price > 0 ? ($trendDelta / $price) * 100 : 0;
        $confidence = $trendScore > 0.08 ? 'high' : ($trendScore > 0.03 ? 'medium' : 'normal');

        if ($direction === 'buy') {
            $stopLoss = min($lastLow ?? $price, $price - ($averageRange * 1.2));
            $risk = max($price - $stopLoss, $averageRange * 0.8);
            $takeProfit = $price + ($risk * 2);
            $reason = $lastClose >= $previousClose
                ? 'Fast EMA is above slow EMA and the latest candle closed stronger than the previous candle.'
                : 'Fast EMA remains above slow EMA, keeping the short-term trend bullish.';
        } else {
            $stopLoss = max($lastHigh ?? $price, $price + ($averageRange * 1.2));
            $risk = max($stopLoss - $price, $averageRange * 0.8);
            $takeProfit = $price - ($risk * 2);
            $reason = $lastClose <= $previousClose
                ? 'Fast EMA is below slow EMA and the latest candle closed weaker than the previous candle.'
                : 'Fast EMA remains below slow EMA, keeping the short-term trend bearish.';
        }

        return [
            'symbol' => $symbol,
            'type' => $direction,
            'strategy' => 'EMA 5/9 Momentum',
            'reason' => $reason,
            'confidence' => $confidence,
            'risk_reward' => '1:2',
            'entry_price' => $this->roundForSymbol($symbol, $price),
            'take_profit' => $this->roundForSymbol($symbol, $takeProfit),
            'stop_loss' => $this->roundForSymbol($symbol, $stopLoss),
            'price' => $this->roundForSymbol($symbol, $price),
            'change' => $snapshot['change'],
            'percent_change' => $snapshot['percent_change'],
            'open' => $this->roundForSymbol($symbol, $snapshot['open']),
            'high' => $this->roundForSymbol($symbol, $snapshot['high']),
            'low' => $this->roundForSymbol($symbol, $snapshot['low']),
            'updated_at' => $candles[count($candles) - 1]['datetime'] ?? gmdate('c'),
            'provider' => 'Twelve Data',
            'status' => 'active',
        ];
    }

    private function httpGetJson($url) {
        if (function_exists('curl_init')) {
            $ch = curl_init($url);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT => 10,
                CURLOPT_CONNECTTIMEOUT => 5,
                CURLOPT_SSL_VERIFYPEER => true,
            ]);
            $raw = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($raw === false || $httpCode >= 400) {
                return null;
            }

            return json_decode($raw, true);
        }

        $context = stream_context_create([
            'http' => [
                'timeout' => 10,
                'ignore_errors' => true,
            ],
        ]);

        $raw = @file_get_contents($url, false, $context);
        if ($raw === false) {
            return null;
        }

        return json_decode($raw, true);
    }

    private function getCachePath() {
        return sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'hunter_tradeing_live_signals_cache.json';
    }

    private function readCache($allowStale = false) {
        $path = $this->getCachePath();
        if (!file_exists($path)) {
            return null;
        }

        $raw = @file_get_contents($path);
        if (!$raw) {
            return null;
        }

        $cached = json_decode($raw, true);
        if (!$cached || empty($cached['stored_at']) || empty($cached['payload'])) {
            return null;
        }

        if (!$allowStale && (time() - (int)$cached['stored_at']) > MARKET_DATA_CACHE_TTL) {
            return null;
        }

        return $cached['payload'];
    }

    private function writeCache($payload) {
        $body = json_encode([
            'stored_at' => time(),
            'payload' => $payload,
        ]);
        @file_put_contents($this->getCachePath(), $body);
    }

    private function toFloat($value) {
        if ($value === null || $value === '') {
            return null;
        }

        return (float)$value;
    }

    private function ema($values, $period) {
        $multiplier = 2 / ($period + 1);
        $ema = null;

        foreach ($values as $value) {
            if ($value === null) {
                continue;
            }

            if ($ema === null) {
                $ema = $value;
                continue;
            }

            $ema = (($value - $ema) * $multiplier) + $ema;
        }

        return $ema ?? 0;
    }

    private function averageRange($highs, $lows, $period) {
        $ranges = [];
        $count = min(count($highs), count($lows));
        $start = max(0, $count - $period);

        for ($i = $start; $i < $count; $i++) {
            if ($highs[$i] === null || $lows[$i] === null) {
                continue;
            }
            $ranges[] = $highs[$i] - $lows[$i];
        }

        if (!$ranges) {
            return 0;
        }

        return array_sum($ranges) / count($ranges);
    }

    private function roundForSymbol($symbol, $value) {
        if ($value === null) {
            return null;
        }

        if ($symbol === 'XAU/USD') {
            return round($value, 2);
        }

        if ($symbol === 'USD/JPY') {
            return round($value, 3);
        }

        return round($value, 5);
    }
}
