<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../lib/PlatformBootstrap.php';

class PaymentOrderController {
    private function ensureTable() {
        PlatformBootstrap::ensure();
    }

    private function storeUploadedFile(array $file) {
        $allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!in_array($file['type'], $allowedTypes, true)) {
            throw new Exception('Invalid file type');
        }

        $uploadDir = __DIR__ . '/../../uploads/payment-orders/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $filename = 'payment_' . time() . '_' . uniqid() . '.' . $extension;
        $filepath = $uploadDir . $filename;

        if (!move_uploaded_file($file['tmp_name'], $filepath)) {
            throw new Exception('Failed to upload screenshot');
        }

        $relativePath = '/uploads/payment-orders/' . $filename;
        insert(
            "INSERT INTO media (filename, filepath, mimetype, size_bytes) VALUES (?, ?, ?, ?)",
            [$file['name'], $relativePath, $file['type'], $file['size']]
        );
        return $relativePath;
    }

    private function getSettingValue($key, $fallback = '') {
        $setting = fetchOne("SELECT setting_value FROM site_settings WHERE setting_key = ? LIMIT 1", [$key]);
        return $setting['setting_value'] ?? $fallback;
    }

    private function sendOrderEmail(array $order, array $product) {
        $to = $this->getSettingValue('support_email', '');
        if (!$to) {
            return;
        }

        $subject = 'New Payment Order #' . $order['id'];
        $message = implode("\n", [
            'New payment order submitted.',
            'Order ID: ' . $order['id'],
            'Product: ' . ($product['title_en'] ?? ''),
            'Customer Name: ' . $order['customer_name'],
            'Customer Email: ' . $order['customer_email'],
            'Customer Phone: ' . ($order['customer_phone'] ?: '-'),
            'Payment Method: ' . $order['payment_method'],
            'Amount: ' . $order['amount'],
            'Screenshot: ' . ($order['screenshot_url'] ?: '-'),
            'Redirect URL: ' . ($order['redirect_url'] ?: '-'),
        ]);

        $headers = [
            'From: no-reply@huntertrading.local',
            'Reply-To: ' . $order['customer_email'],
            'Content-Type: text/plain; charset=UTF-8',
        ];

        @mail($to, $subject, $message, implode("\r\n", $headers));
    }

    public function submitOrder() {
        try {
            $this->ensureTable();

            $serviceId = (int) ($_POST['service_id'] ?? ($_POST['product_id'] ?? 0));
            $name = trim((string) ($_POST['customer_name'] ?? ''));
            $email = trim((string) ($_POST['customer_email'] ?? ''));
            $phone = trim((string) ($_POST['customer_phone'] ?? ''));
            $paymentMethod = trim((string) ($_POST['payment_method'] ?? ''));

            if (!$serviceId || $name === '' || $email === '' || $paymentMethod === '') {
                http_response_code(400);
                return json_encode(['success' => false, 'error' => 'Missing required fields']);
            }

            $service = fetchOne("SELECT * FROM services WHERE id = ? LIMIT 1", [$serviceId]);
            if (!$service) {
                http_response_code(404);
                return json_encode(['success' => false, 'error' => 'Service not found']);
            }

            $screenshotUrl = null;
            if (!empty($_FILES['screenshot']['tmp_name'])) {
                $screenshotUrl = $this->storeUploadedFile($_FILES['screenshot']);
            }

            $fallbackRedirect = $this->getSettingValue(
                'purchase_redirect_url',
                $this->getSettingValue('telegram_url', $this->getSettingValue('free_telegram_url', 'https://t.me/hunter_tradeing'))
            );
            $redirectUrl = ($service['cta_url'] ?? null) ?: $fallbackRedirect;

            $orderId = insert(
                "INSERT INTO payment_orders
                (service_id, customer_name, customer_email, customer_phone, payment_method, amount, screenshot_url, redirect_url)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    $serviceId,
                    $name,
                    $email,
                    $phone,
                    $paymentMethod,
                    (float) ($service['price'] ?? 0),
                    $screenshotUrl,
                    $redirectUrl,
                ]
            );

            $order = fetchOne("SELECT * FROM payment_orders WHERE id = ?", [$orderId]);
            $this->sendOrderEmail($order, $service);

            return json_encode([
                'success' => true,
                'data' => [
                    'order_id' => $orderId,
                    'redirect_url' => $redirectUrl,
                    'status' => 'pending',
                ],
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode(['success' => false, 'error' => 'Failed to submit payment order']);
        }
    }

    public function getOrders() {
        try {
            $this->ensureTable();
            $orders = fetchAll("
                SELECT o.*, s.type AS category, s.slug, s.title_en, s.title_ar
                FROM payment_orders o
                LEFT JOIN services s ON s.id = o.service_id
                ORDER BY o.created_at DESC
            ");

            return json_encode(['success' => true, 'data' => $orders]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode(['success' => false, 'error' => 'Failed to fetch orders']);
        }
    }

    public function updateOrder($data) {
        try {
            $this->ensureTable();
            if (empty($data['id'])) {
                http_response_code(400);
                return json_encode(['success' => false, 'error' => 'Order ID required']);
            }

            $fields = [];
            $params = [];
            foreach (['status', 'redirect_url', 'admin_note', 'verified_at', 'verified_by'] as $field) {
                if (array_key_exists($field, $data)) {
                    $fields[] = "{$field} = ?";
                    $params[] = $data[$field];
                }
            }

            if (array_key_exists('status', $data) && in_array($data['status'], ['approved', 'paid', 'completed'], true)) {
                $fields[] = "verified_at = ?";
                $params[] = date('Y-m-d H:i:s');
            }

            if (!$fields) {
                http_response_code(400);
                return json_encode(['success' => false, 'error' => 'No fields to update']);
            }

            $params[] = (int) $data['id'];
            modify("UPDATE payment_orders SET " . implode(', ', $fields) . " WHERE id = ?", $params);
            return json_encode(['success' => true]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode(['success' => false, 'error' => 'Failed to update order']);
        }
    }
}
