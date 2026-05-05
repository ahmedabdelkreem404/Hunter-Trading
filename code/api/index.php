<?php

require_once __DIR__ . '/config/cors.php';
require_once __DIR__ . '/config/database.php';

$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

$path = parse_url($requestUri, PHP_URL_PATH);
$path = preg_replace('#^/api/?#', '', $path ?? '');
$path = trim($path, '/');

function jsonBody(): array
{
    return json_decode(file_get_contents('php://input'), true) ?? [];
}

function requireAdminAuth(): void
{
    require_once __DIR__ . '/controllers/AuthController.php';
    $auth = new AuthController();
    if (!$auth->isAuthenticated()) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
}

function requireAdminCsrf(): void
{
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        return;
    }

    require_once __DIR__ . '/controllers/AuthController.php';
    $auth = new AuthController();
    $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (!$auth->validateCsrfToken($token)) {
        http_response_code(403);
        echo json_encode(['error' => 'Invalid CSRF token']);
        exit;
    }
}

function endpointNotFound(): void
{
    http_response_code(404);
    echo json_encode(['error' => 'Endpoint not found']);
}

try {
    if ($path === '' || $path === 'sections') {
        require_once __DIR__ . '/controllers/SectionSettingsController.php';
        $controller = new SectionSettingsController();
        echo $controller->getAll();
        return;
    }

    if ($path === 'settings/public') {
        require_once __DIR__ . '/controllers/SettingsController.php';
        $controller = new SettingsController();
        echo $controller->getSettings();
        return;
    }

    if ($path === 'coach') {
        require_once __DIR__ . '/controllers/SettingsController.php';
        $controller = new SettingsController();
        echo $controller->getCoachProfile();
        return;
    }

    if ($path === 'services') {
        require_once __DIR__ . '/controllers/ServiceController.php';
        $controller = new ServiceController();
        echo $controller->getPublicServices($_GET['type'] ?? null);
        return;
    }

    if (str_starts_with($path, 'services/')) {
        require_once __DIR__ . '/controllers/ServiceController.php';
        $controller = new ServiceController();
        echo $controller->getServiceBySlug(substr($path, 9));
        return;
    }

    if ($path === 'market/updates') {
        require_once __DIR__ . '/controllers/MarketUpdateController.php';
        $controller = new MarketUpdateController();
        echo $controller->getPublicUpdates();
        return;
    }

    if ($path === 'testimonials') {
        require_once __DIR__ . '/controllers/TestimonialController.php';
        $controller = new TestimonialController();
        echo $controller->getTestimonials();
        return;
    }

    if ($path === 'checkout/orders') {
        require_once __DIR__ . '/controllers/PaymentOrderController.php';
        $controller = new PaymentOrderController();
        echo $controller->submitOrder();
        return;
    }

    if ($path === 'leads' && $requestMethod === 'POST') {
        require_once __DIR__ . '/controllers/LeadController.php';
        $controller = new LeadController();
        echo $controller->createLead(jsonBody());
        return;
    }

    if ($path === 'analytics/track' && $requestMethod === 'POST') {
        require_once __DIR__ . '/controllers/AnalyticsController.php';
        $controller = new AnalyticsController();
        echo $controller->track(jsonBody());
        return;
    }

    if ($path === 'auth/login' && $requestMethod === 'POST') {
        require_once __DIR__ . '/controllers/AuthController.php';
        $controller = new AuthController();
        echo $controller->login(jsonBody());
        return;
    }

    if ($path === 'auth/logout' && $requestMethod === 'POST') {
        require_once __DIR__ . '/controllers/AuthController.php';
        $controller = new AuthController();
        echo $controller->logout();
        return;
    }

    if ($path === 'auth/check') {
        require_once __DIR__ . '/controllers/AuthController.php';
        $controller = new AuthController();
        echo $controller->check();
        return;
    }

    if ($path === 'auth/csrf') {
        require_once __DIR__ . '/controllers/AuthController.php';
        $controller = new AuthController();
        echo $controller->csrf();
        return;
    }

    if (!str_starts_with($path, 'admin/')) {
        endpointNotFound();
        return;
    }

    requireAdminAuth();
    requireAdminCsrf();
    $adminPath = substr($path, 6);

    switch ($adminPath) {
        case 'dashboard':
            require_once __DIR__ . '/controllers/AdminController.php';
            $controller = new AdminController();
            echo $controller->getDashboard();
            break;

        case 'services':
            require_once __DIR__ . '/controllers/ServiceController.php';
            $controller = new ServiceController();
            if ($requestMethod === 'GET') {
                echo $controller->getAdminServices();
            } elseif ($requestMethod === 'POST') {
                echo $controller->createService(jsonBody());
            } elseif ($requestMethod === 'PUT') {
                echo $controller->updateService(jsonBody());
            } elseif ($requestMethod === 'DELETE') {
                echo $controller->deleteService($_GET['id'] ?? null);
            } else {
                endpointNotFound();
            }
            break;

        case 'orders':
            require_once __DIR__ . '/controllers/PaymentOrderController.php';
            $controller = new PaymentOrderController();
            if ($requestMethod === 'GET') {
                echo $controller->getOrders();
            } elseif ($requestMethod === 'PUT') {
                echo $controller->updateOrder(jsonBody());
            } else {
                endpointNotFound();
            }
            break;

        case 'sections':
            require_once __DIR__ . '/controllers/SectionSettingsController.php';
            $controller = new SectionSettingsController();
            if ($requestMethod === 'GET') {
                echo $controller->getAll();
            } elseif ($requestMethod === 'PUT') {
                echo $controller->updateBatch(jsonBody());
            } else {
                endpointNotFound();
            }
            break;

        case 'market':
            require_once __DIR__ . '/controllers/MarketUpdateController.php';
            $controller = new MarketUpdateController();
            if ($requestMethod === 'GET') {
                echo $controller->getAdminUpdates();
            } elseif ($requestMethod === 'POST') {
                echo $controller->createUpdate(jsonBody());
            } elseif ($requestMethod === 'PUT') {
                echo $controller->updateUpdate(jsonBody());
            } elseif ($requestMethod === 'DELETE') {
                echo $controller->deleteUpdate($_GET['id'] ?? null);
            } else {
                endpointNotFound();
            }
            break;

        case 'testimonials':
            require_once __DIR__ . '/controllers/TestimonialController.php';
            $controller = new TestimonialController();
            if ($requestMethod === 'GET') {
                echo $controller->getTestimonials();
            } elseif ($requestMethod === 'POST') {
                echo $controller->createTestimonial(jsonBody());
            } elseif ($requestMethod === 'PUT') {
                echo $controller->updateTestimonial(jsonBody());
            } elseif ($requestMethod === 'DELETE') {
                echo $controller->deleteTestimonial($_GET['id'] ?? null);
            } else {
                endpointNotFound();
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
                echo $controller->batchUpdateSettings(jsonBody());
            } else {
                endpointNotFound();
            }
            break;

        case 'coach':
            require_once __DIR__ . '/controllers/SettingsController.php';
            $controller = new SettingsController();
            if ($requestMethod === 'GET') {
                echo $controller->getCoachProfile();
            } elseif ($requestMethod === 'PUT') {
                echo $controller->updateCoachProfile(jsonBody());
            } else {
                endpointNotFound();
            }
            break;

        case 'coach/upload':
            require_once __DIR__ . '/controllers/SettingsController.php';
            $controller = new SettingsController();
            echo $controller->uploadCoachImage();
            break;

        case 'coach/social-links':
            require_once __DIR__ . '/controllers/SettingsController.php';
            $controller = new SettingsController();
            if ($requestMethod === 'GET') {
                echo $controller->getCoachSocialLinks();
            } elseif ($requestMethod === 'POST') {
                echo $controller->createCoachSocialLink(jsonBody());
            } elseif ($requestMethod === 'PUT') {
                echo $controller->updateCoachSocialLink(jsonBody());
            } else {
                endpointNotFound();
            }
            break;

        case 'coach/social-links/delete':
            require_once __DIR__ . '/controllers/SettingsController.php';
            $controller = new SettingsController();
            echo $controller->deleteCoachSocialLink($_GET['id'] ?? null);
            break;

        case 'media':
            require_once __DIR__ . '/controllers/SettingsController.php';
            $controller = new SettingsController();
            if ($requestMethod === 'POST') {
                echo $controller->uploadMedia();
            } elseif ($requestMethod === 'GET') {
                echo $controller->getMedia();
            } else {
                endpointNotFound();
            }
            break;

        case 'media/delete':
            require_once __DIR__ . '/controllers/SettingsController.php';
            $controller = new SettingsController();
            echo $controller->deleteMedia($_GET['id'] ?? null);
            break;

        default:
            endpointNotFound();
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error', 'message' => $e->getMessage()]);
}
