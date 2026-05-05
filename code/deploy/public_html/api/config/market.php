<?php
/**
 * Live market data configuration
 */

require_once __DIR__ . '/env.php';

define('MARKET_DATA_API_KEY', getenv('TWELVE_DATA_API_KEY') ?: '');
define('MARKET_DATA_BASE_URL', 'https://api.twelvedata.com');
define('MARKET_DATA_CACHE_TTL', 10);

function getMarketSymbols() {
    return [
        'EUR/USD',
        'GBP/USD',
        'USD/JPY',
        'XAU/USD',
    ];
}
