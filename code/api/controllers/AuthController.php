<?php
/**
 * Auth Controller
 * Handles authentication
 */

require_once __DIR__ . '/../config/database.php';

class AuthController {
    private $sessionPrefix = 'hunter_admin_';
    
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
            
            $user = fetchOne(
                "SELECT * FROM users WHERE email = ? AND role = 'admin'",
                [$data['email']]
            );
            
            if (!$user || !password_verify($data['password'], $user['password_hash'])) {
                http_response_code(401);
                return json_encode([
                    'success' => false,
                    'error' => 'Invalid credentials'
                ]);
            }
            
            // Set session
            $_SESSION[$this->sessionPrefix . 'id'] = $user['id'];
            $_SESSION[$this->sessionPrefix . 'email'] = $user['email'];
            $_SESSION[$this->sessionPrefix . 'role'] = $user['role'];
            
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
     * Check if user is authenticated
     */
    public function isAuthenticated() {
        return isset($_SESSION[$this->sessionPrefix . 'id']);
    }
    
    /**
     * Hash password
     */
    public static function hashPassword($password) {
        return password_hash($password, PASSWORD_BCRYPT);
    }
}
