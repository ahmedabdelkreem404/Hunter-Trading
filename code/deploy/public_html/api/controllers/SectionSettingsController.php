<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../lib/PlatformBootstrap.php';

class SectionSettingsController
{
    public function getAll()
    {
        try {
            PlatformBootstrap::ensure();
            $rows = fetchAll("SELECT * FROM section_settings ORDER BY sort_order ASC, id ASC");

            return json_encode([
                'success' => true,
                'data' => array_map([$this, 'formatRow'], $rows),
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode(['success' => false, 'error' => 'Failed to fetch section settings']);
        }
    }

    public function updateBatch(array $payload)
    {
        try {
            PlatformBootstrap::ensure();
            $items = $payload['sections'] ?? [];
            foreach ($items as $item) {
                if (empty($item['section_key'])) {
                    continue;
                }

                $existing = fetchOne("SELECT id FROM section_settings WHERE section_key = ?", [$item['section_key']]);
                $values = [
                    $item['title_en'] ?? null,
                    $item['title_ar'] ?? null,
                    $item['subtitle_en'] ?? null,
                    $item['subtitle_ar'] ?? null,
                    $item['body_en'] ?? null,
                    $item['body_ar'] ?? null,
                    $item['cta_label_en'] ?? null,
                    $item['cta_label_ar'] ?? null,
                    $item['cta_url'] ?? null,
                    $item['secondary_cta_label_en'] ?? null,
                    $item['secondary_cta_label_ar'] ?? null,
                    $item['secondary_cta_url'] ?? null,
                    $item['image_url'] ?? null,
                    isset($item['stats']) ? json_encode($item['stats'], JSON_UNESCAPED_UNICODE) : null,
                    isset($item['settings']) ? json_encode($item['settings'], JSON_UNESCAPED_UNICODE) : null,
                    isset($item['is_visible']) ? (int) !!$item['is_visible'] : 1,
                    (int) ($item['sort_order'] ?? 0),
                ];

                if ($existing) {
                    $values[] = $item['section_key'];
                    modify("
                        UPDATE section_settings
                        SET title_en = ?, title_ar = ?, subtitle_en = ?, subtitle_ar = ?, body_en = ?, body_ar = ?,
                            cta_label_en = ?, cta_label_ar = ?, cta_url = ?, secondary_cta_label_en = ?, secondary_cta_label_ar = ?,
                            secondary_cta_url = ?, image_url = ?, stats_json = ?, settings_json = ?, is_visible = ?, sort_order = ?
                        WHERE section_key = ?
                    ", $values);
                } else {
                    array_unshift($values, $item['section_key']);
                    insert("
                        INSERT INTO section_settings
                        (section_key, title_en, title_ar, subtitle_en, subtitle_ar, body_en, body_ar,
                         cta_label_en, cta_label_ar, cta_url, secondary_cta_label_en, secondary_cta_label_ar,
                         secondary_cta_url, image_url, stats_json, settings_json, is_visible, sort_order)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ", $values);
                }
            }

            return json_encode(['success' => true]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode(['success' => false, 'error' => 'Failed to update section settings']);
        }
    }

    private function formatRow(array $row): array
    {
        $row['stats'] = !empty($row['stats_json']) ? json_decode($row['stats_json'], true) : [];
        $row['settings'] = !empty($row['settings_json']) ? json_decode($row['settings_json'], true) : [];
        unset($row['stats_json'], $row['settings_json']);
        return $row;
    }
}
