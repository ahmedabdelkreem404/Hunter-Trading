<?php
/**
 * Content Controller
 * Handles home page content management
 */

require_once __DIR__ . '/../config/database.php';

class ContentController {
    
    /**
     * Get all home page content
     */
    public function getHomeContent() {
        try {
            $content = fetchAll("SELECT section, field, value, language FROM home_content");
            
            $result = [];
            foreach ($content as $item) {
                $result[$item['language']][$item['section']][$item['field']] = $item['value'];
            }
            
            return json_encode([
                'success' => true,
                'data' => $result
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Failed to fetch content'
            ]);
        }
    }
    
    /**
     * Update content (Admin only)
     */
    public function updateContent($data) {
        try {
            if (empty($data['section']) || empty($data['field']) || !isset($data['value'])) {
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'error' => 'Missing required fields'
                ]);
            }
            
            $language = $data['language'] ?? 'en';
            
            // Check if record exists
            $existing = fetchOne(
                "SELECT id FROM home_content WHERE section = ? AND field = ? AND language = ?",
                [$data['section'], $data['field'], $language]
            );
            
            if ($existing) {
                modify(
                    "UPDATE home_content SET value = ? WHERE section = ? AND field = ? AND language = ?",
                    [$data['value'], $data['section'], $data['field'], $language]
                );
            } else {
                insert(
                    "INSERT INTO home_content (section, field, value, language) VALUES (?, ?, ?, ?)",
                    [$data['section'], $data['field'], $data['value'], $language]
                );
            }
            
            return json_encode([
                'success' => true,
                'message' => 'Content updated successfully'
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Failed to update content'
            ]);
        }
    }
}
