<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../lib/PlatformBootstrap.php';

class TestimonialController {
    private function deleteManagedFile(?string $relativePath) {
        if (!$relativePath || !str_starts_with($relativePath, '/uploads/')) {
            return;
        }

        $fullPath = __DIR__ . '/../../' . ltrim($relativePath, '/');
        if (file_exists($fullPath) && is_file($fullPath)) {
            @unlink($fullPath);
        }

        modify("DELETE FROM media WHERE filepath = ?", [$relativePath]);
    }

    public function getTestimonials() {
        try {
            PlatformBootstrap::ensure();
            $isAdmin = (isset($_SERVER['REQUEST_URI']) && strpos($_SERVER['REQUEST_URI'], '/admin/') !== false);
            $sql = "SELECT * FROM testimonials";
            if (!$isAdmin) {
                $sql .= " WHERE is_visible = 1 AND is_approved = 1";
            }
            $sql .= " ORDER BY is_featured DESC, order_index ASC, id DESC";
            $testimonials = fetchAll($sql);
            return json_encode(['success' => true, 'data' => $testimonials]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode(['success' => false, 'error' => 'Failed to fetch testimonials']);
        }
    }

    public function createTestimonial($data) {
        try {
            if (empty($data['name']) || empty($data['content_en'])) {
                http_response_code(400);
                return json_encode(['success' => false, 'error' => 'Name and English content are required']);
            }

            $id = insert(
                "INSERT INTO testimonials
                (name, location, image_url, video_url, content_en, content_ar, rating, service_type, service_id, is_featured, is_approved, is_visible, order_index)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    $data['name'],
                    $data['location'] ?? null,
                    $data['image_url'] ?? null,
                    $data['video_url'] ?? null,
                    $data['content_en'],
                    $data['content_ar'] ?? null,
                    $data['rating'] ?? 5,
                    $data['service_type'] ?? null,
                    $data['service_id'] ?? null,
                    isset($data['is_featured']) ? (int) !!$data['is_featured'] : 0,
                    isset($data['is_approved']) ? (int) !!$data['is_approved'] : 1,
                    isset($data['is_visible']) ? (int) !!$data['is_visible'] : 1,
                    $data['order_index'] ?? 0,
                ]
            );

            return json_encode(['success' => true, 'data' => ['id' => $id]]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode(['success' => false, 'error' => 'Failed to create testimonial']);
        }
    }

    public function updateTestimonial($data) {
        try {
            if (empty($data['id'])) {
                http_response_code(400);
                return json_encode(['success' => false, 'error' => 'Testimonial ID is required']);
            }

            $current = fetchOne("SELECT image_url FROM testimonials WHERE id = ?", [$data['id']]);
            $fields = [];
            $params = [];
            $allowedFields = ['name', 'location', 'image_url', 'video_url', 'content_en', 'content_ar', 'rating', 'service_type', 'service_id', 'is_featured', 'is_approved', 'is_visible', 'order_index'];

            foreach ($allowedFields as $field) {
                if (array_key_exists($field, $data)) {
                    if ($field === 'image_url' && ($current['image_url'] ?? null) && $current['image_url'] !== $data[$field]) {
                        $this->deleteManagedFile($current['image_url']);
                    }
                    $fields[] = "$field = ?";
                    $params[] = $data[$field];
                }
            }

            if (empty($fields)) {
                http_response_code(400);
                return json_encode(['success' => false, 'error' => 'No fields to update']);
            }

            $params[] = $data['id'];
            modify("UPDATE testimonials SET " . implode(', ', $fields) . " WHERE id = ?", $params);

            return json_encode(['success' => true, 'message' => 'Testimonial updated successfully']);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode(['success' => false, 'error' => 'Failed to update testimonial']);
        }
    }

    public function deleteTestimonial($id) {
        try {
            if (empty($id)) {
                http_response_code(400);
                return json_encode(['success' => false, 'error' => 'Testimonial ID is required']);
            }

            $current = fetchOne("SELECT image_url FROM testimonials WHERE id = ?", [$id]);
            $this->deleteManagedFile($current['image_url'] ?? null);
            modify("DELETE FROM testimonials WHERE id = ?", [$id]);
            return json_encode(['success' => true, 'message' => 'Testimonial deleted successfully']);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode(['success' => false, 'error' => 'Failed to delete testimonial']);
        }
    }
}
