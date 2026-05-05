<?php
/**
 * Settings Controller
 * Handles site settings, coach profile, and media management
 */

require_once __DIR__ . '/../config/database.php';

class SettingsController {
    private function ensureCoachSocialLinksTable() {
        modify("
            CREATE TABLE IF NOT EXISTS coach_social_links (
                id INT PRIMARY KEY AUTO_INCREMENT,
                platform VARCHAR(50) NOT NULL,
                label VARCHAR(100) NOT NULL,
                url VARCHAR(500) NOT NULL,
                sort_order INT DEFAULT 0,
                is_enabled TINYINT(1) DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        ");

        $count = fetchOne("SELECT COUNT(*) AS total FROM coach_social_links");
        if ((int) ($count['total'] ?? 0) > 0) {
            return;
        }

        $defaults = [
            ['telegram', 'Telegram', 'https://t.me/hunter_tradeing', 1, 1],
            ['instagram', 'Instagram', 'https://instagram.com/hunter_tradeing', 2, 1],
            ['youtube', 'YouTube', 'https://youtube.com/@hunter_tradeing', 3, 1],
            ['facebook', 'Facebook', 'https://facebook.com/hunter_tradeing', 4, 0],
            ['twitter', 'X / Twitter', 'https://x.com/hunter_tradeing', 5, 0],
            ['whatsapp', 'WhatsApp', 'https://wa.me/201000000000', 6, 0]
        ];

        foreach ($defaults as [$platform, $label, $url, $sortOrder, $isEnabled]) {
            insert(
                "INSERT INTO coach_social_links (platform, label, url, sort_order, is_enabled) VALUES (?, ?, ?, ?, ?)",
                [$platform, $label, $url, $sortOrder, $isEnabled]
            );
        }
    }

    private function getCoachSocialLinksRows(bool $onlyEnabled = false) {
        $this->ensureCoachSocialLinksTable();

        $sql = "SELECT id, platform, label, url, sort_order, is_enabled FROM coach_social_links";
        if ($onlyEnabled) {
            $sql .= " WHERE is_enabled = 1";
        }

        $sql .= " ORDER BY sort_order ASC, id ASC";
        return fetchAll($sql);
    }

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

    private function storeUploadedFile(array $file, string $directory, string $prefix = 'media_', bool $allowVideos = false) {
        $allowedTypes = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            'image/gif' => 'gif',
        ];

        if ($allowVideos) {
            $allowedTypes += [
                'video/mp4' => 'mp4',
                'video/webm' => 'webm',
                'video/quicktime' => 'mov',
            ];
        }

        if (($file['error'] ?? UPLOAD_ERR_OK) !== UPLOAD_ERR_OK) {
            throw new Exception('Upload failed');
        }

        $maxSize = $allowVideos ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
        if (($file['size'] ?? 0) > $maxSize) {
            throw new Exception('File too large. Maximum size: ' . ($allowVideos ? '100MB' : '10MB'));
        }

        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->file($file['tmp_name']);
        if (!isset($allowedTypes[$mimeType])) {
            throw new Exception($allowVideos ? 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF, MP4, WebM, MOV' : 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF');
        }

        $uploadDir = __DIR__ . '/../../uploads/' . trim($directory, '/') . '/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $extension = $allowedTypes[$mimeType];
        $filename = $prefix . time() . '_' . uniqid() . '.' . $extension;
        $filepath = $uploadDir . $filename;

        if (!move_uploaded_file($file['tmp_name'], $filepath)) {
            throw new Exception('Failed to save file');
        }

        $relativePath = '/uploads/' . trim($directory, '/') . '/' . $filename;
        insert(
            "INSERT INTO media (filename, filepath, mimetype, size_bytes) VALUES (?, ?, ?, ?)",
            [$file['name'], $relativePath, $mimeType, $file['size']]
        );

        return $relativePath;
    }
    
    /**
     * Get all settings
     */
    public function getSettings() {
        try {
            $columns = array_column(fetchAll("SHOW COLUMNS FROM site_settings"), 'Field');
            $hasCategory = in_array('category', $columns, true);
            $hasType = in_array('setting_type', $columns, true);
            $hasDescription = in_array('description', $columns, true);
            
            $selectParts = ['setting_key', 'setting_value'];
            if ($hasCategory) {
                $selectParts[] = 'category';
            }
            if ($hasType) {
                $selectParts[] = 'setting_type';
            }
            if ($hasDescription) {
                $selectParts[] = 'description';
            }
            
            $orderBy = $hasCategory ? 'category, setting_key' : 'setting_key';
            $settings = fetchAll("SELECT " . implode(', ', $selectParts) . " FROM site_settings ORDER BY {$orderBy}");
            
            $result = [];
            foreach ($settings as $setting) {
                $category = $setting['category'] ?? 'general';

                // Older databases may not have a category column yet.
                if ($category === 'general' && $setting['setting_key'] === 'homepage_sections') {
                    $category = 'layout';
                }

                $result[$category][$setting['setting_key']] = [
                    'value' => $setting['setting_value'],
                    'type' => $setting['setting_type'] ?? 'text',
                    'description' => $setting['description'] ?? null
                ];
            }
            
            return json_encode([
                'success' => true,
                'data' => $result
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Failed to fetch settings'
            ]);
        }
    }
    
    /**
     * Get single setting by key
     */
    public function getSetting($key) {
        try {
            $setting = fetchOne(
                "SELECT * FROM site_settings WHERE setting_key = ?",
                [$key]
            );
            
            if (!$setting) {
                http_response_code(404);
                return json_encode([
                    'success' => false,
                    'error' => 'Setting not found'
                ]);
            }
            
            return json_encode([
                'success' => true,
                'data' => $setting
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Failed to fetch setting'
            ]);
        }
    }
    
    /**
     * Update setting by key
     */
    public function updateSetting($data) {
        try {
            if (empty($data['setting_key']) || !isset($data['setting_value'])) {
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'error' => 'Missing required fields: setting_key and setting_value'
                ]);
            }
            
            $key = $data['setting_key'];
            $value = $data['setting_value'];
            $existing = fetchOne(
                "SELECT id, setting_value FROM site_settings WHERE setting_key = ?",
                [$key]
            );

            if ($existing) {
                if ($key === 'site_logo' && ($existing['setting_value'] ?? null) && $existing['setting_value'] !== $value) {
                    $this->deleteManagedFile($existing['setting_value']);
                }
                modify(
                    "UPDATE site_settings SET setting_value = ? WHERE setting_key = ?",
                    [$value, $key]
                );
            } else {
                insert(
                    "INSERT INTO site_settings (setting_key, setting_value, setting_type, category) VALUES (?, ?, 'text', 'general')",
                    [$key, $value]
                );
            }
            
            return json_encode([
                'success' => true,
                'message' => 'Setting updated successfully'
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Failed to update setting'
            ]);
        }
    }
    
    /**
     * Get coach profile
     */
    public function getCoachProfile() {
        try {
            $profile = fetchOne("SELECT * FROM coach_profile LIMIT 1");
            $socialLinks = $this->getCoachSocialLinksRows(true);
            
            if (!$profile) {
                // Return default if no profile exists
                return json_encode([
                    'success' => true,
                    'data' => [
                        'name_en' => 'Ahmed Hunter',
                        'name_ar' => 'أحمد هانتر',
                        'title_en' => 'Professional Trading Coach',
                        'title_ar' => 'مدرب تداول محترف',
                        'bio_en' => 'After losing $50,000 in my first year of trading, I decided to dedicate my life to mastering the markets.',
                        'bio_ar' => 'بعد خسارة 50,000 دولار في سنتي الأولى في التداول، قررت تكريس حياتي لإتقان الأسواق.',
                        'image_url' => null,
                        'experience_years' => 8,
                        'students_count' => 10000,
                        'profit_shared' => '$2M+',
                        'social_links' => $socialLinks
                    ]
                ]);
            }

            $profile['social_links'] = $socialLinks;
            
            return json_encode([
                'success' => true,
                'data' => $profile
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Failed to fetch coach profile'
            ]);
        }
    }
    
    /**
     * Update coach profile
     */
    public function updateCoachProfile($data) {
        try {
            $currentProfile = fetchOne("SELECT * FROM coach_profile LIMIT 1");
            if (!$currentProfile) {
                insert(
                    "INSERT INTO coach_profile (name_en, name_ar, title_en, title_ar, bio_en, bio_ar, experience_years, students_count, profit_shared)
                     VALUES ('', '', '', '', '', '', 0, 0, '')"
                );
                $currentProfile = fetchOne("SELECT * FROM coach_profile LIMIT 1");
            }
            $fields = [];
            $values = [];
            
            $allowedFields = ['name_en', 'name_ar', 'title_en', 'title_ar', 'bio_en', 'bio_ar', 
                            'image_url', 'experience_years', 'students_count', 'profit_shared',
                            'twitter_url', 'linkedin_url', 'telegram_url'];
            
            foreach ($allowedFields as $field) {
                if (isset($data[$field])) {
                    if ($field === 'image_url' && ($currentProfile['image_url'] ?? null) && $currentProfile['image_url'] !== $data[$field]) {
                        $this->deleteManagedFile($currentProfile['image_url']);
                    }
                    $fields[] = $field . ' = ?';
                    $values[] = $data[$field];
                }
            }
            
            if (empty($fields)) {
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'error' => 'No valid fields to update'
                ]);
            }
            
            $values[] = date('Y-m-d H:i:s'); // updated_at
            
            $values[] = (int) $currentProfile['id'];
            $sql = "UPDATE coach_profile SET " . implode(', ', $fields) . ", updated_at = ? WHERE id = ?";
            modify($sql, $values);
            
            return json_encode([
                'success' => true,
                'message' => 'Coach profile updated successfully'
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Failed to update coach profile: ' . $e->getMessage()
            ]);
        }
    }
    
    /**
     * Upload image for coach profile
     */
    public function uploadCoachImage() {
        try {
            if (!isset($_FILES['image'])) {
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'error' => 'No image file provided'
                ]);
            }
            
            $file = $_FILES['image'];
            $currentProfile = fetchOne("SELECT id, image_url FROM coach_profile LIMIT 1");
            if (!$currentProfile) {
                insert(
                    "INSERT INTO coach_profile (name_en, name_ar, title_en, title_ar, bio_en, bio_ar, experience_years, students_count, profit_shared)
                     VALUES ('', '', '', '', '', '', 0, 0, '')"
                );
                $currentProfile = fetchOne("SELECT id, image_url FROM coach_profile LIMIT 1");
            }
            $relativePath = $this->storeUploadedFile($file, 'coach', 'coach_');
            if (!empty($currentProfile['image_url']) && $currentProfile['image_url'] !== $relativePath) {
                $this->deleteManagedFile($currentProfile['image_url']);
            }

            modify(
                "UPDATE coach_profile SET image_url = ? WHERE id = ?",
                [$relativePath, (int) ($currentProfile['id'] ?? 1)]
            );

            return json_encode([
                'success' => true,
                'message' => 'Image uploaded successfully',
                'data' => ['image_url' => $relativePath]
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Failed to upload image: ' . $e->getMessage()
            ]);
        }
    }
    
    /**
     * Upload general media file
     */
    public function uploadMedia() {
        try {
            if (!isset($_FILES['file'])) {
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'error' => 'No file provided'
                ]);
            }
            
            $file = $_FILES['file'];
            $relativePath = $this->storeUploadedFile($file, 'media', 'media_', true);
            $media = fetchOne("SELECT id, filename, filepath, mimetype FROM media WHERE filepath = ?", [$relativePath]);

            return json_encode([
                'success' => true,
                'message' => 'File uploaded successfully',
                'data' => [
                    'id' => $media['id'] ?? null,
                    'filename' => $media['filename'] ?? $file['name'],
                    'filepath' => $relativePath,
                    'mimetype' => $media['mimetype'] ?? null,
                    'url' => $relativePath
                ]
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Failed to upload file: ' . $e->getMessage()
            ]);
        }
    }
    
    /**
     * Get all media files
     */
    public function getMedia() {
        try {
            $media = fetchAll("SELECT * FROM media ORDER BY created_at DESC LIMIT 100");
            
            return json_encode([
                'success' => true,
                'data' => $media
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Failed to fetch media'
            ]);
        }
    }
    
    /**
     * Delete media file
     */
    public function deleteMedia($id) {
        try {
            $media = fetchOne("SELECT * FROM media WHERE id = ?", [$id]);
            
            if (!$media) {
                http_response_code(404);
                return json_encode([
                    'success' => false,
                    'error' => 'Media not found'
                ]);
            }
            
            // Delete file from disk
            $fullPath = __DIR__ . '/../../' . $media['filepath'];
            if (file_exists($fullPath)) {
                unlink($fullPath);
            }
            
            // Delete from database
            modify("DELETE FROM media WHERE id = ?", [$id]);
            
            return json_encode([
                'success' => true,
                'message' => 'Media deleted successfully'
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Failed to delete media'
            ]);
        }
    }

    public function getCoachSocialLinks(bool $onlyEnabled = false) {
        try {
            return json_encode([
                'success' => true,
                'data' => $this->getCoachSocialLinksRows($onlyEnabled)
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Failed to fetch coach social links'
            ]);
        }
    }

    public function createCoachSocialLink($data) {
        try {
            $this->ensureCoachSocialLinksTable();

            $platform = trim((string) ($data['platform'] ?? 'custom'));
            $label = trim((string) ($data['label'] ?? ''));
            $url = trim((string) ($data['url'] ?? ''));
            $sortOrder = (int) ($data['sort_order'] ?? 0);
            $isEnabled = !empty($data['is_enabled']) ? 1 : 0;

            if ($label === '' || $url === '') {
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'error' => 'Label and URL are required'
                ]);
            }

            $id = insert(
                "INSERT INTO coach_social_links (platform, label, url, sort_order, is_enabled) VALUES (?, ?, ?, ?, ?)",
                [$platform, $label, $url, $sortOrder, $isEnabled]
            );

            $link = fetchOne(
                "SELECT id, platform, label, url, sort_order, is_enabled FROM coach_social_links WHERE id = ?",
                [$id]
            );

            return json_encode([
                'success' => true,
                'message' => 'Coach social link created successfully',
                'data' => $link
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Failed to create coach social link'
            ]);
        }
    }

    public function updateCoachSocialLink($data) {
        try {
            $this->ensureCoachSocialLinksTable();

            $id = (int) ($data['id'] ?? 0);
            if ($id <= 0) {
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'error' => 'Valid link ID is required'
                ]);
            }

            $existing = fetchOne("SELECT id FROM coach_social_links WHERE id = ?", [$id]);
            if (!$existing) {
                http_response_code(404);
                return json_encode([
                    'success' => false,
                    'error' => 'Coach social link not found'
                ]);
            }

            $fields = [];
            $values = [];

            foreach (['platform', 'label', 'url', 'sort_order', 'is_enabled'] as $field) {
                if (!array_key_exists($field, $data)) {
                    continue;
                }

                $value = $data[$field];
                if ($field === 'sort_order') {
                    $value = (int) $value;
                } elseif ($field === 'is_enabled') {
                    $value = !empty($value) ? 1 : 0;
                } else {
                    $value = trim((string) $value);
                }

                $fields[] = "{$field} = ?";
                $values[] = $value;
            }

            if (empty($fields)) {
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'error' => 'No valid fields to update'
                ]);
            }

            $values[] = $id;
            modify("UPDATE coach_social_links SET " . implode(', ', $fields) . " WHERE id = ?", $values);

            $link = fetchOne(
                "SELECT id, platform, label, url, sort_order, is_enabled FROM coach_social_links WHERE id = ?",
                [$id]
            );

            return json_encode([
                'success' => true,
                'message' => 'Coach social link updated successfully',
                'data' => $link
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Failed to update coach social link'
            ]);
        }
    }

    public function deleteCoachSocialLink($id) {
        try {
            $this->ensureCoachSocialLinksTable();
            $id = (int) $id;

            if ($id <= 0) {
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'error' => 'Valid link ID is required'
                ]);
            }

            $existing = fetchOne("SELECT id FROM coach_social_links WHERE id = ?", [$id]);
            if (!$existing) {
                http_response_code(404);
                return json_encode([
                    'success' => false,
                    'error' => 'Coach social link not found'
                ]);
            }

            modify("DELETE FROM coach_social_links WHERE id = ?", [$id]);

            return json_encode([
                'success' => true,
                'message' => 'Coach social link deleted successfully'
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Failed to delete coach social link'
            ]);
        }
    }
    
    /**
     * Batch update settings
     */
    public function batchUpdateSettings($data) {
        try {
            if (!isset($data['settings']) || !is_array($data['settings'])) {
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'error' => 'Invalid settings data'
                ]);
            }
            
            $columns = array_column(fetchAll("SHOW COLUMNS FROM site_settings"), 'Field');
            $hasCategory = in_array('category', $columns, true);
            $hasType = in_array('setting_type', $columns, true);

            foreach ($data['settings'] as $key => $value) {
                $existing = fetchOne(
                    "SELECT id, setting_value FROM site_settings WHERE setting_key = ?",
                    [$key]
                );

                if ($existing) {
                    if ($key === 'site_logo' && ($existing['setting_value'] ?? null) && $existing['setting_value'] !== $value) {
                        $this->deleteManagedFile($existing['setting_value']);
                    }
                    modify(
                        "UPDATE site_settings SET setting_value = ? WHERE setting_key = ?",
                        [$value, $key]
                    );
                    continue;
                }

                if ($hasCategory && $hasType) {
                    $category = str_contains($key, 'section') ? 'layout' : 'general';
                    insert(
                        "INSERT INTO site_settings (setting_key, setting_value, setting_type, category) VALUES (?, ?, 'text', ?)",
                        [$key, $value, $category]
                    );
                    continue;
                }

                insert(
                    "INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?)",
                    [$key, $value]
                );
            }
            
            return json_encode([
                'success' => true,
                'message' => 'Settings updated successfully'
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Failed to update settings'
            ]);
        }
    }
}
