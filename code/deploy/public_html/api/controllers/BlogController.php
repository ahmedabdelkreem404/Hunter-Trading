<?php
require_once __DIR__ . '/../config/database.php';

class BlogController {
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

    public function getPosts() {
        try {
            $posts = fetchAll("
                SELECT id, title_en, title_ar, excerpt_en, excerpt_ar, image_url, slug, category, read_time_minutes, published, created_at
                FROM blog_posts
                WHERE published = TRUE
                ORDER BY created_at DESC
            ");
            return json_encode(['success' => true, 'data' => $posts]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode(['success' => false, 'error' => 'Failed to fetch posts']);
        }
    }
    
    public function getPost($slug) {
        try {
            $post = fetchOne("SELECT * FROM blog_posts WHERE slug = ?", [$slug]);
            
            if (!$post) {
                http_response_code(404);
                return json_encode(['success' => false, 'error' => 'Post not found']);
            }
            
            return json_encode(['success' => true, 'data' => $post]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode(['success' => false, 'error' => 'Failed to fetch post']);
        }
    }

    public function getAdminPosts() {
        try {
            $posts = fetchAll("
                SELECT id, title_en, title_ar, excerpt_en, excerpt_ar, image_url, slug, category, read_time_minutes, published, created_at
                FROM blog_posts
                ORDER BY created_at DESC
            ");
            return json_encode(['success' => true, 'data' => $posts]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode(['success' => false, 'error' => 'Failed to fetch posts']);
        }
    }

    public function createPost($data) {
        try {
            if (empty($data['title_en']) || empty($data['slug'])) {
                http_response_code(400);
                return json_encode(['success' => false, 'error' => 'English title and slug are required']);
            }

            $id = insert(
                "INSERT INTO blog_posts (title_en, title_ar, excerpt_en, excerpt_ar, content_en, content_ar, image_url, slug, category, read_time_minutes, published)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    $data['title_en'],
                    $data['title_ar'] ?? null,
                    $data['excerpt_en'] ?? null,
                    $data['excerpt_ar'] ?? null,
                    $data['content_en'] ?? null,
                    $data['content_ar'] ?? null,
                    $data['image_url'] ?? null,
                    $data['slug'],
                    $data['category'] ?? null,
                    $data['read_time_minutes'] ?? 5,
                    isset($data['published']) ? (int) !!$data['published'] : 1,
                ]
            );

            return json_encode(['success' => true, 'data' => ['id' => $id]]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode(['success' => false, 'error' => 'Failed to create post']);
        }
    }

    public function updatePost($data) {
        try {
            if (empty($data['id'])) {
                http_response_code(400);
                return json_encode(['success' => false, 'error' => 'Post ID is required']);
            }

            $current = fetchOne("SELECT image_url FROM blog_posts WHERE id = ?", [$data['id']]);
            $fields = [];
            $params = [];
            $allowedFields = ['title_en', 'title_ar', 'excerpt_en', 'excerpt_ar', 'content_en', 'content_ar', 'image_url', 'slug', 'category', 'read_time_minutes', 'published'];

            foreach ($allowedFields as $field) {
                if (array_key_exists($field, $data)) {
                    if ($field === 'image_url' && ($current['image_url'] ?? null) && $current['image_url'] !== $data[$field]) {
                        $this->deleteManagedFile($current['image_url']);
                    }
                    $fields[] = "$field = ?";
                    $params[] = $field === 'published' ? (int) !!$data[$field] : $data[$field];
                }
            }

            if (empty($fields)) {
                http_response_code(400);
                return json_encode(['success' => false, 'error' => 'No fields to update']);
            }

            $params[] = $data['id'];
            modify("UPDATE blog_posts SET " . implode(', ', $fields) . " WHERE id = ?", $params);

            return json_encode(['success' => true, 'message' => 'Post updated successfully']);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode(['success' => false, 'error' => 'Failed to update post']);
        }
    }

    public function deletePost($id) {
        try {
            if (empty($id)) {
                http_response_code(400);
                return json_encode(['success' => false, 'error' => 'Post ID is required']);
            }

            $current = fetchOne("SELECT image_url FROM blog_posts WHERE id = ?", [$id]);
            $this->deleteManagedFile($current['image_url'] ?? null);
            modify("DELETE FROM blog_posts WHERE id = ?", [$id]);
            return json_encode(['success' => true, 'message' => 'Post deleted successfully']);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode(['success' => false, 'error' => 'Failed to delete post']);
        }
    }
}
