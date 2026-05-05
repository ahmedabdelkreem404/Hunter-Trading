<?php
/**
 * Hunter Trading API - Entry Point
 */

require_once __DIR__ . '/config/cors.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/config/market.php';

// Parse request URI
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Remove base path and query string
$basePath = '/api';
$path = parse_url($requestUri, PHP_URL_PATH);
$path = str_replace($basePath, '', $path);
$path = trim($path, '/');

// Route the request
try {
    switch ($path) {
        // Public Routes - Content
        case '':
        case 'content/home':
            require_once __DIR__ . '/controllers/ContentController.php';
            $controller = new ContentController();
            echo $controller->getHomeContent();
            break;
            
        // Courses
        case 'courses':
            require_once __DIR__ . '/controllers/CourseController.php';
            $controller = new CourseController();
            echo $controller->getCourses();
            break;
            
        // Signals
        case 'signals':
            require_once __DIR__ . '/controllers/SignalController.php';
            $controller = new SignalController();
            $status = $_GET['status'] ?? null;
            echo $controller->getSignals($status);
            break;

        case 'market/live-signals':
            require_once __DIR__ . '/controllers/MarketController.php';
            $controller = new MarketController();
            echo $controller->getLiveSignals();
            break;
            
        // Testimonials
        case 'testimonials':
            require_once __DIR__ . '/controllers/TestimonialController.php';
            $controller = new TestimonialController();
            echo $controller->getTestimonials();
            break;
            
        // Results
        case 'results':
            require_once __DIR__ . '/controllers/ResultController.php';
            $controller = new ResultController();
            echo $controller->getResults();
            break;
            
        // Blog
        case 'blog':
            require_once __DIR__ . '/controllers/BlogController.php';
            $controller = new BlogController();
            echo $controller->getPosts();
            break;

        case 'settings/public':
            require_once __DIR__ . '/controllers/SettingsController.php';
            $controller = new SettingsController();
            echo $controller->getSettings();
            break;

        case 'coach':
            require_once __DIR__ . '/controllers/SettingsController.php';
            $controller = new SettingsController();
            echo $controller->getCoachProfile();
            break;
            
        case 'blog/' . basename($path):
            if (strpos($path, 'blog/') === 0) {
                $slug = substr($path, 5);
                require_once __DIR__ . '/controllers/BlogController.php';
                $controller = new BlogController();
                echo $controller->getPost($slug);
            }
            break;
            
        // Leads
        case 'leads':
            require_once __DIR__ . '/controllers/LeadController.php';
            $controller = new LeadController();
            if ($requestMethod === 'POST') {
                $data = json_decode(file_get_contents('php://input'), true);
                echo $controller->createLead($data);
            }
            break;
            
        // Analytics
        case 'analytics/track':
            require_once __DIR__ . '/controllers/AnalyticsController.php';
            $controller = new AnalyticsController();
            $data = json_decode(file_get_contents('php://input'), true);
            echo $controller->track($data);
            break;
            
        // Affiliate
        case 'affiliate/click':
            require_once __DIR__ . '/controllers/AffiliateController.php';
            $controller = new AffiliateController();
            $data = json_decode(file_get_contents('php://input'), true);
            echo $controller->trackClick($data);
            break;
            
        // Auth
        case 'auth/login':
            require_once __DIR__ . '/controllers/AuthController.php';
            $controller = new AuthController();
            $data = json_decode(file_get_contents('php://input'), true);
            echo $controller->login($data);
            break;
            
        case 'auth/logout':
            require_once __DIR__ . '/controllers/AuthController.php';
            $controller = new AuthController();
            echo $controller->logout();
            break;
            
        case 'auth/check':
            require_once __DIR__ . '/controllers/AuthController.php';
            $controller = new AuthController();
            echo $controller->check();
            break;
            
        // Admin Routes
        default:
            if (strpos($path, 'admin/') === 0) {
                // Admin routes require authentication
                require_once __DIR__ . '/controllers/AuthController.php';
                $auth = new AuthController();
                if (!$auth->isAuthenticated()) {
                    http_response_code(401);
                    echo json_encode(['error' => 'Unauthorized']);
                    break;
                }
                
                $adminPath = substr($path, 6);
                
                switch ($adminPath) {
                    case 'dashboard':
                        require_once __DIR__ . '/controllers/AdminController.php';
                        $controller = new AdminController();
                        echo $controller->getDashboard();
                        break;
                        
                    case 'content':
                        require_once __DIR__ . '/controllers/ContentController.php';
                        $controller = new ContentController();
                        if ($requestMethod === 'PUT') {
                            $data = json_decode(file_get_contents('php://input'), true);
                            echo $controller->updateContent($data);
                        }
                        break;
                        
                    case 'courses':
                        require_once __DIR__ . '/controllers/CourseController.php';
                        $controller = new CourseController();
                        if ($requestMethod === 'POST') {
                            $data = json_decode(file_get_contents('php://input'), true);
                            echo $controller->createCourse($data);
                        } elseif ($requestMethod === 'PUT') {
                            $data = json_decode(file_get_contents('php://input'), true);
                            echo $controller->updateCourse($data);
                        } elseif ($requestMethod === 'DELETE') {
                            $id = $_GET['id'] ?? null;
                            echo $controller->deleteCourse($id);
                        }
                        break;
                        
                    case 'signals':
                        require_once __DIR__ . '/controllers/SignalController.php';
                        $controller = new SignalController();
                        if ($requestMethod === 'POST') {
                            $data = json_decode(file_get_contents('php://input'), true);
                            echo $controller->createSignal($data);
                        } elseif ($requestMethod === 'PUT') {
                            $data = json_decode(file_get_contents('php://input'), true);
                            echo $controller->updateSignal($data);
                        }
                        break;

                    case 'testimonials':
                        require_once __DIR__ . '/controllers/TestimonialController.php';
                        $controller = new TestimonialController();
                        if ($requestMethod === 'GET') {
                            echo $controller->getTestimonials();
                        } elseif ($requestMethod === 'POST') {
                            $data = json_decode(file_get_contents('php://input'), true);
                            echo $controller->createTestimonial($data);
                        } elseif ($requestMethod === 'PUT') {
                            $data = json_decode(file_get_contents('php://input'), true);
                            echo $controller->updateTestimonial($data);
                        } elseif ($requestMethod === 'DELETE') {
                            $id = $_GET['id'] ?? null;
                            echo $controller->deleteTestimonial($id);
                        }
                        break;

                    case 'blog':
                        require_once __DIR__ . '/controllers/BlogController.php';
                        $controller = new BlogController();
                        if ($requestMethod === 'GET') {
                            echo $controller->getAdminPosts();
                        } elseif ($requestMethod === 'POST') {
                            $data = json_decode(file_get_contents('php://input'), true);
                            echo $controller->createPost($data);
                        } elseif ($requestMethod === 'PUT') {
                            $data = json_decode(file_get_contents('php://input'), true);
                            echo $controller->updatePost($data);
                        } elseif ($requestMethod === 'DELETE') {
                            $id = $_GET['id'] ?? null;
                            echo $controller->deletePost($id);
                        }
                        break;
                        
                    case 'leads':
                        require_once __DIR__ . '/controllers/LeadController.php';
                        $controller = new LeadController();
                        echo $controller->getLeads();
                        break;
                        
                    case 'settings':
                        require_once __DIR__ . '/controllers/SettingsController.php';
                        $controller = new SettingsController();
                        if ($requestMethod === 'GET') {
                            echo $controller->getSettings();
                        } elseif ($requestMethod === 'PUT') {
                            $data = json_decode(file_get_contents('php://input'), true);
                            echo $controller->batchUpdateSettings($data);
                        }
                        break;
                        
                    case 'settings/single':
                        require_once __DIR__ . '/controllers/SettingsController.php';
                        $controller = new SettingsController();
                        if ($requestMethod === 'PUT') {
                            $data = json_decode(file_get_contents('php://input'), true);
                            echo $controller->updateSetting($data);
                        } else {
                            $key = $_GET['key'] ?? '';
                            echo $controller->getSetting($key);
                        }
                        break;
                        
                    case 'coach':
                        require_once __DIR__ . '/controllers/SettingsController.php';
                        $controller = new SettingsController();
                        if ($requestMethod === 'GET') {
                            echo $controller->getCoachProfile();
                        } elseif ($requestMethod === 'PUT') {
                            $data = json_decode(file_get_contents('php://input'), true);
                            echo $controller->updateCoachProfile($data);
                        }
                        break;
                        
                    case 'coach/upload':
                        require_once __DIR__ . '/controllers/SettingsController.php';
                        $controller = new SettingsController();
                        echo $controller->uploadCoachImage();
                        break;
                        
                    case 'media':
                        require_once __DIR__ . '/controllers/SettingsController.php';
                        $controller = new SettingsController();
                        if ($requestMethod === 'POST') {
                            echo $controller->uploadMedia();
                        } else {
                            echo $controller->getMedia();
                        }
                        break;
                        
                    case 'media/delete':
                        require_once __DIR__ . '/controllers/SettingsController.php';
                        $controller = new SettingsController();
                        $id = $_GET['id'] ?? null;
                        echo $controller->deleteMedia($id);
                        break;
                        
                    default:
                        http_response_code(404);
                        echo json_encode(['error' => 'Endpoint not found']);
                }
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Endpoint not found']);
            }
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error', 'message' => $e->getMessage()]);
}
