<?php
/**
 * Auth Controller
 * Handles authentication
 */

require_once __DIR__ . '/../config/database.php';

class AuthController {
    private $sessionPrefix = 'hunter_admin_';
    private int $maxLoginAttempts = 8;
    private int $loginWindowSeconds = 600;
    
    /**
     * Login
     */
    public function login($data) {
        try {
            if (empty($data['email']) || empty($data['password'])) {
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'error' => 'Email and password required'
                ]);
            }

            $rateLimit = $this->checkLoginRateLimit($data['email']);
            if (!$rateLimit['allowed']) {
                http_response_code(429);
                return json_encode([
                    'success' => false,
                    'error' => 'Too many login attempts. Please try again later.'
                ]);
            }
            
            $user = fetchOne(
                "SELECT * FROM users WHERE email = ? AND role = 'admin'",
                [$data['email']]
            );
            
            if (!$user || !password_verify($data['password'], $user['password_hash'])) {
                $this->recordFailedLogin($data['email']);
                http_response_code(401);
                return json_encode([
                    'success' => false,
                    'error' => 'Invalid credentials'
                ]);
            }
            
            session_regenerate_id(true);
            $this->clearFailedLogins($data['email']);

            $_SESSION[$this->sessionPrefix . 'id'] = $user['id'];
            $_SESSION[$this->sessionPrefix . 'email'] = $user['email'];
            $_SESSION[$this->sessionPrefix . 'role'] = $user['role'];
            $_SESSION[$this->sessionPrefix . 'csrf'] = bin2hex(random_bytes(32));
            
            return json_encode([
                'success' => true,
                'data' => [
                    'user' => [
                        'id' => $user['id'],
                        'email' => $user['email'],
                        'role' => $user['role']
                    ]
                ]
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Login failed'
            ]);
        }
    }
    
    /**
     * Logout
     */
    public function logout() {
        try {
            session_destroy();
            return json_encode([
                'success' => true,
                'message' => 'Logged out successfully'
            ]);
        } catch (Exception $e) {
            return json_encode([
                'success' => true,
                'message' => 'Logged out'
            ]);
        }
    }
    
    /**
     * Check authentication status
     */
    public function check() {
        if ($this->isAuthenticated()) {
            return json_encode([
                'success' => true,
                'data' => [
                    'authenticated' => true,
                    'user' => [
                        'id' => $_SESSION[$this->sessionPrefix . 'id'],
                        'email' => $_SESSION[$this->sessionPrefix . 'email'],
                        'role' => $_SESSION[$this->sessionPrefix . 'role']
                    ]
                ]
            ]);
        }
        
        return json_encode([
            'success' => true,
            'data' => ['authenticated' => false]
        ]);
    }

    /**
     * Return a CSRF token for authenticated admin requests.
     */
    public function csrf() {
        if (!$this->isAuthenticated()) {
            http_response_code(401);
            return json_encode([
                'success' => false,
                'error' => 'Unauthorized'
            ]);
        }

        if (empty($_SESSION[$this->sessionPrefix . 'csrf'])) {
            $_SESSION[$this->sessionPrefix . 'csrf'] = bin2hex(random_bytes(32));
        }

        return json_encode([
            'success' => true,
            'data' => [
                'csrf_token' => $_SESSION[$this->sessionPrefix . 'csrf']
            ]
        ]);
    }
    
    /**
     * Check if user is authenticated
     */
    public function isAuthenticated() {
        return isset($_SESSION[$this->sessionPrefix . 'id']);
    }

    public function validateCsrfToken(?string $token): bool {
        $sessionToken = $_SESSION[$this->sessionPrefix . 'csrf'] ?? '';
        return $sessionToken !== '' && is_string($token) && hash_equals($sessionToken, $token);
    }
    
    /**
     * Hash password
     */
    public static function hashPassword($password) {
        return password_hash($password, PASSWORD_BCRYPT);
    }

    private function loginRateLimitKey(string $email): string {
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        return hash('sha256', strtolower(trim($email)) . '|' . $ip);
    }

    private function loginRateLimitPath(string $email): string {
        return sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'hunter_login_' . $this->loginRateLimitKey($email) . '.json';
    }

    private function readLoginAttempts(string $email): array {
        $path = $this->loginRateLimitPath($email);
        if (!file_exists($path)) {
            return [];
        }

        $data = json_decode((string) file_get_contents($path), true);
        return is_array($data) ? $data : [];
    }

    private function writeLoginAttempts(string $email, array $attempts): void {
        file_put_contents($this->loginRateLimitPath($email), json_encode(array_values($attempts)));
    }

    private function checkLoginRateLimit(string $email): array {
        $now = time();
        $attempts = array_filter(
            $this->readLoginAttempts($email),
            fn($timestamp) => is_numeric($timestamp) && ($now - (int) $timestamp) < $this->loginWindowSeconds
        );

        $this->writeLoginAttempts($email, $attempts);
        return ['allowed' => count($attempts) < $this->maxLoginAttempts];
    }

    private function recordFailedLogin(string $email): void {
        $attempts = $this->readLoginAttempts($email);
        $attempts[] = time();
        $this->writeLoginAttempts($email, $attempts);
    }

    private function clearFailedLogins(string $email): void {
        $path = $this->loginRateLimitPath($email);
        if (file_exists($path)) {
            @unlink($path);
        }
    }
}
