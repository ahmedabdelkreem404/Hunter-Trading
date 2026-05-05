<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../lib/PlatformBootstrap.php';

class MarketUpdateController
{
    public function getPublicUpdates()
    {
        try {
            PlatformBootstrap::ensure();
            $rows = fetchAll("
                SELECT *
                FROM market_updates
                WHERE is_visible = 1
                ORDER BY is_pinned DESC, is_featured DESC, sort_order ASC, published_at DESC, id DESC
                LIMIT 20
            ");

            return json_encode(['success' => true, 'data' => $rows]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode(['success' => false, 'error' => 'Failed to fetch market updates']);
        }
    }

    public function getAdminUpdates()
    {
        try {
            PlatformBootstrap::ensure();
            $rows = fetchAll("SELECT * FROM market_updates ORDER BY is_pinned DESC, is_featured DESC, sort_order ASC, published_at DESC, id DESC");
            return json_encode(['success' => true, 'data' => $rows]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode(['success' => false, 'error' => 'Failed to fetch market updates']);
        }
    }

    public function createUpdate(array $data)
    {
        try {
            PlatformBootstrap::ensure();
            if (empty($data['title_en']) && empty($data['title_ar'])) {
                http_response_code(400);
                return json_encode(['success' => false, 'error' => 'Market update title is required']);
            }

            $id = insert("
                INSERT INTO market_updates
                (title_en, title_ar, summary_en, summary_ar, content_en, content_ar, category, image_url, author_name, tags_json,
                 is_pinned, is_featured, is_visible, sort_order, published_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ", [
                $data['title_en'] ?? $data['title_ar'],
                $data['title_ar'] ?? $data['title_en'],
                $data['summary_en'] ?? null,
                $data['summary_ar'] ?? null,
                $data['content_en'] ?? null,
                $data['content_ar'] ?? null,
                $data['category'] ?? 'analysis',
                $data['image_url'] ?? null,
                $data['author_name'] ?? null,
                isset($data['tags']) ? json_encode($data['tags'], JSON_UNESCAPED_UNICODE) : null,
                isset($data['is_pinned']) ? (int) !!$data['is_pinned'] : 0,
                isset($data['is_featured']) ? (int) !!$data['is_featured'] : 0,
                isset($data['is_visible']) ? (int) !!$data['is_visible'] : 1,
                (int) ($data['sort_order'] ?? 0),
                !empty($data['published_at']) ? $data['published_at'] : date('Y-m-d H:i:s'),
            ]);

            return json_encode(['success' => true, 'data' => ['id' => (int) $id]]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode(['success' => false, 'error' => 'Failed to create market update']);
        }
    }

    public function updateUpdate(array $data)
    {
        try {
            PlatformBootstrap::ensure();
            if (empty($data['id'])) {
                http_response_code(400);
                return json_encode(['success' => false, 'error' => 'Market update ID required']);
            }

            $fields = [];
            $params = [];
            $allowed = ['title_en', 'title_ar', 'summary_en', 'summary_ar', 'content_en', 'content_ar', 'category', 'image_url', 'author_name', 'is_pinned', 'is_featured', 'is_visible', 'sort_order', 'published_at'];
            foreach ($allowed as $field) {
                if (!array_key_exists($field, $data)) {
                    continue;
                }

                $fields[] = "{$field} = ?";
                if (in_array($field, ['is_pinned', 'is_featured', 'is_visible', 'sort_order'], true)) {
                    $params[] = (int) $data[$field];
                } else {
                    $params[] = $data[$field];
                }
            }

            if (array_key_exists('tags', $data)) {
                $fields[] = "tags_json = ?";
                $params[] = json_encode($data['tags'] ?? [], JSON_UNESCAPED_UNICODE);
            }

            if (!$fields) {
                http_response_code(400);
                return json_encode(['success' => false, 'error' => 'No fields to update']);
            }

            $params[] = (int) $data['id'];
            modify("UPDATE market_updates SET " . implode(', ', $fields) . " WHERE id = ?", $params);
            return json_encode(['success' => true]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode(['success' => false, 'error' => 'Failed to update market update']);
        }
    }

    public function deleteUpdate($id)
    {
        try {
            PlatformBootstrap::ensure();
            if (!$id) {
                http_response_code(400);
                return json_encode(['success' => false, 'error' => 'Market update ID required']);
            }

            modify("DELETE FROM market_updates WHERE id = ?", [(int) $id]);
            return json_encode(['success' => true]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode(['success' => false, 'error' => 'Failed to delete market update']);
        }
    }
}
