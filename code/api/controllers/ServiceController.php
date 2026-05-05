<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../lib/PlatformBootstrap.php';

class ServiceController
{
    private array $allowedTypes = ['funded', 'vip', 'scalp', 'courses', 'offers'];
    private array $allowedMediaTypes = ['image', 'video', 'embed'];
    private array $allowedCtaActions = ['checkout', 'details', 'external', 'referral', 'whatsapp', 'telegram'];

    public function getPublicServices(?string $type = null)
    {
        try {
            PlatformBootstrap::ensure();

            $params = [];
            $sql = "
                SELECT *
                FROM services
                WHERE is_visible = 1
                AND (offer_starts_at IS NULL OR offer_starts_at <= NOW())
                AND (offer_ends_at IS NULL OR offer_ends_at > NOW())
            ";

            if ($type && in_array($type, $this->allowedTypes, true)) {
                $sql .= " AND type = ?";
                $params[] = $type;
            }

            $sql .= " ORDER BY sort_order ASC, id DESC";
            $rows = fetchAll($sql, $params);

            return json_encode([
                'success' => true,
                'data' => array_map([$this, 'hydrateService'], $rows),
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode(['success' => false, 'error' => 'Failed to fetch services']);
        }
    }

    public function getServiceBySlug(string $slug)
    {
        try {
            PlatformBootstrap::ensure();

            $service = fetchOne("
                SELECT *
                FROM services
                WHERE slug = ?
                AND is_visible = 1
                AND (offer_starts_at IS NULL OR offer_starts_at <= NOW())
                AND (offer_ends_at IS NULL OR offer_ends_at > NOW())
                LIMIT 1
            ", [$slug]);

            if (!$service) {
                http_response_code(404);
                return json_encode(['success' => false, 'error' => 'Service not found']);
            }

            return json_encode([
                'success' => true,
                'data' => $this->hydrateService($service),
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode(['success' => false, 'error' => 'Failed to fetch service']);
        }
    }

    public function getAdminServices()
    {
        try {
            PlatformBootstrap::ensure();
            $rows = fetchAll("SELECT * FROM services ORDER BY FIELD(type, 'funded', 'vip', 'scalp', 'courses', 'offers'), sort_order ASC, id DESC");

            return json_encode([
                'success' => true,
                'data' => array_map([$this, 'hydrateService'], $rows),
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode(['success' => false, 'error' => 'Failed to fetch services']);
        }
    }

    public function createService(array $data)
    {
        try {
            PlatformBootstrap::ensure();
            $validation = $this->validatePayload($data, true);
            if ($validation !== null) {
                return $validation;
            }

            $id = insert(
                "INSERT INTO services
                (type, slug, title_en, title_ar, subtitle_en, subtitle_ar, short_description_en, short_description_ar, full_description_en, full_description_ar,
                 price, compare_price, currency, cta_label_en, cta_label_ar, cta_url, badge_text_en, badge_text_ar, thumbnail_url, cover_url,
                 cover_media_type, cover_video_poster_url, card_media_type, card_media_url, card_video_poster_url, card_video_autoplay,
                 card_video_muted, card_video_loop, offer_starts_at, offer_ends_at, cta_action, referral_url, broker_name, broker_url,
                 terms_title_en, terms_title_ar, terms_content_en, terms_content_ar, risk_warning_en, risk_warning_ar, important_links_json,
                 details_button_label_en, details_button_label_ar, final_cta_label_en, final_cta_label_ar,
                 is_featured, is_visible, sort_order, metadata_json)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    $data['type'],
                    $data['slug'],
                    $data['title_en'],
                    $data['title_ar'],
                    $data['subtitle_en'] ?? null,
                    $data['subtitle_ar'] ?? null,
                    $data['short_description_en'] ?? null,
                    $data['short_description_ar'] ?? null,
                    $data['full_description_en'] ?? null,
                    $data['full_description_ar'] ?? null,
                    (float) ($data['price'] ?? 0),
                    isset($data['compare_price']) && $data['compare_price'] !== '' ? (float) $data['compare_price'] : null,
                    $data['currency'] ?? 'USD',
                    $data['cta_label_en'] ?? 'Buy Now',
                    $data['cta_label_ar'] ?? 'اشتر الآن',
                    $data['cta_url'] ?? null,
                    $data['badge_text_en'] ?? null,
                    $data['badge_text_ar'] ?? null,
                    $data['thumbnail_url'] ?? null,
                    $data['cover_url'] ?? null,
                    $this->normalizeMediaType($data['cover_media_type'] ?? 'image'),
                    $data['cover_video_poster_url'] ?? null,
                    $this->normalizeMediaType($data['card_media_type'] ?? 'image'),
                    $data['card_media_url'] ?? null,
                    $data['card_video_poster_url'] ?? null,
                    isset($data['card_video_autoplay']) ? (int) !!$data['card_video_autoplay'] : 0,
                    isset($data['card_video_muted']) ? (int) !!$data['card_video_muted'] : 1,
                    isset($data['card_video_loop']) ? (int) !!$data['card_video_loop'] : 1,
                    !empty($data['offer_starts_at']) ? $data['offer_starts_at'] : null,
                    !empty($data['offer_ends_at']) ? $data['offer_ends_at'] : null,
                    $this->normalizeCtaAction($data['cta_action'] ?? 'checkout'),
                    $data['referral_url'] ?? null,
                    $data['broker_name'] ?? null,
                    $data['broker_url'] ?? null,
                    $data['terms_title_en'] ?? null,
                    $data['terms_title_ar'] ?? null,
                    $data['terms_content_en'] ?? null,
                    $data['terms_content_ar'] ?? null,
                    $data['risk_warning_en'] ?? null,
                    $data['risk_warning_ar'] ?? null,
                    isset($data['important_links']) ? json_encode($data['important_links'], JSON_UNESCAPED_UNICODE) : null,
                    $data['details_button_label_en'] ?? null,
                    $data['details_button_label_ar'] ?? null,
                    $data['final_cta_label_en'] ?? null,
                    $data['final_cta_label_ar'] ?? null,
                    isset($data['is_featured']) ? (int) !!$data['is_featured'] : 0,
                    isset($data['is_visible']) ? (int) !!$data['is_visible'] : 1,
                    (int) ($data['sort_order'] ?? 0),
                    isset($data['metadata']) ? json_encode($data['metadata'], JSON_UNESCAPED_UNICODE) : null,
                ]
            );

            $this->replaceRelations((int) $id, $data);

            return json_encode(['success' => true, 'data' => ['id' => (int) $id]]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode(['success' => false, 'error' => 'Failed to create service']);
        }
    }

    public function updateService(array $data)
    {
        try {
            PlatformBootstrap::ensure();
            if (empty($data['id'])) {
                http_response_code(400);
                return json_encode(['success' => false, 'error' => 'Service ID required']);
            }

            $validation = $this->validatePayload($data, false);
            if ($validation !== null) {
                return $validation;
            }

            $fields = [];
            $params = [];
            $allowed = [
                'type', 'slug', 'title_en', 'title_ar', 'subtitle_en', 'subtitle_ar',
                'short_description_en', 'short_description_ar', 'full_description_en', 'full_description_ar',
                'price', 'compare_price', 'currency', 'cta_label_en', 'cta_label_ar', 'cta_url',
                'badge_text_en', 'badge_text_ar', 'thumbnail_url', 'cover_url', 'cover_media_type',
                'cover_video_poster_url', 'card_media_type', 'card_media_url', 'card_video_poster_url',
                'card_video_autoplay', 'card_video_muted', 'card_video_loop', 'offer_starts_at',
                'offer_ends_at', 'cta_action', 'referral_url', 'broker_name', 'broker_url',
                'terms_title_en', 'terms_title_ar', 'terms_content_en', 'terms_content_ar',
                'risk_warning_en', 'risk_warning_ar', 'details_button_label_en', 'details_button_label_ar',
                'final_cta_label_en', 'final_cta_label_ar', 'is_featured', 'is_visible', 'sort_order',
            ];

            foreach ($allowed as $field) {
                if (!array_key_exists($field, $data)) {
                    continue;
                }

                $fields[] = "{$field} = ?";
                if (in_array($field, ['price', 'compare_price'], true)) {
                    $params[] = $data[$field] === '' || $data[$field] === null ? null : (float) $data[$field];
                } elseif (in_array($field, ['is_featured', 'is_visible', 'sort_order', 'card_video_autoplay', 'card_video_muted', 'card_video_loop'], true)) {
                    $params[] = (int) $data[$field];
                } elseif (in_array($field, ['offer_starts_at', 'offer_ends_at'], true)) {
                    $params[] = !empty($data[$field]) ? $data[$field] : null;
                } elseif (in_array($field, ['cover_media_type', 'card_media_type'], true)) {
                    $params[] = $this->normalizeMediaType($data[$field]);
                } elseif ($field === 'cta_action') {
                    $params[] = $this->normalizeCtaAction($data[$field]);
                } else {
                    $params[] = $data[$field];
                }
            }

            if (array_key_exists('important_links', $data)) {
                $fields[] = "important_links_json = ?";
                $params[] = json_encode($data['important_links'] ?? [], JSON_UNESCAPED_UNICODE);
            }

            if (array_key_exists('metadata', $data)) {
                $fields[] = "metadata_json = ?";
                $params[] = json_encode($data['metadata'] ?? [], JSON_UNESCAPED_UNICODE);
            }

            if (!$fields) {
                http_response_code(400);
                return json_encode(['success' => false, 'error' => 'No fields to update']);
            }

            $params[] = (int) $data['id'];
            modify("UPDATE services SET " . implode(', ', $fields) . " WHERE id = ?", $params);
            $this->replaceRelations((int) $data['id'], $data);

            return json_encode(['success' => true]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode(['success' => false, 'error' => 'Failed to update service']);
        }
    }

    public function deleteService($id)
    {
        try {
            PlatformBootstrap::ensure();
            if (!$id) {
                http_response_code(400);
                return json_encode(['success' => false, 'error' => 'Service ID required']);
            }

            modify("DELETE FROM services WHERE id = ?", [(int) $id]);
            return json_encode(['success' => true]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode(['success' => false, 'error' => 'Failed to delete service']);
        }
    }

    private function validatePayload(array $data, bool $creating): ?string
    {
        $required = ['type', 'slug', 'title_en', 'title_ar'];
        if ($creating) {
            foreach ($required as $field) {
                if (empty($data[$field])) {
                    http_response_code(400);
                    return json_encode(['success' => false, 'error' => "Missing required field: {$field}"]);
                }
            }
        }

        if (!empty($data['type']) && !in_array($data['type'], $this->allowedTypes, true)) {
            http_response_code(400);
            return json_encode(['success' => false, 'error' => 'Invalid service type']);
        }

        foreach (['card_media_type', 'cover_media_type'] as $field) {
            if (!empty($data[$field]) && !in_array($data[$field], $this->allowedMediaTypes, true)) {
                http_response_code(400);
                return json_encode(['success' => false, 'error' => 'Invalid media type']);
            }
        }

        if (!empty($data['cta_action']) && !in_array($data['cta_action'], $this->allowedCtaActions, true)) {
            http_response_code(400);
            return json_encode(['success' => false, 'error' => 'Invalid CTA action']);
        }

        return null;
    }

    private function normalizeMediaType(?string $value): string
    {
        return in_array($value, $this->allowedMediaTypes, true) ? $value : 'image';
    }

    private function normalizeCtaAction(?string $value): string
    {
        return in_array($value, $this->allowedCtaActions, true) ? $value : 'checkout';
    }

    private function replaceRelations(int $serviceId, array $data): void
    {
        if (array_key_exists('features', $data)) {
            modify("DELETE FROM service_features WHERE service_id = ?", [$serviceId]);
            foreach (($data['features'] ?? []) as $index => $feature) {
                $labelEn = trim((string) ($feature['label_en'] ?? ''));
                $labelAr = trim((string) ($feature['label_ar'] ?? ''));
                if ($labelEn === '' && $labelAr === '') {
                    continue;
                }

                insert(
                    "INSERT INTO service_features (service_id, label_en, label_ar, sort_order) VALUES (?, ?, ?, ?)",
                    [$serviceId, $labelEn ?: $labelAr, $labelAr ?: $labelEn, $index + 1]
                );
            }
        }

        if (array_key_exists('steps', $data)) {
            modify("DELETE FROM service_steps WHERE service_id = ?", [$serviceId]);
            foreach (($data['steps'] ?? []) as $index => $step) {
                $titleEn = trim((string) ($step['title_en'] ?? ''));
                $titleAr = trim((string) ($step['title_ar'] ?? ''));
                $descriptionEn = trim((string) ($step['description_en'] ?? ''));
                $descriptionAr = trim((string) ($step['description_ar'] ?? ''));
                if ($titleEn === '' && $titleAr === '' && $descriptionEn === '' && $descriptionAr === '') {
                    continue;
                }

                insert(
                    "INSERT INTO service_steps (service_id, title_en, title_ar, description_en, description_ar, sort_order)
                     VALUES (?, ?, ?, ?, ?, ?)",
                    [$serviceId, $titleEn ?: $titleAr, $titleAr ?: $titleEn, $descriptionEn ?: null, $descriptionAr ?: null, $index + 1]
                );
            }
        }

        if (array_key_exists('faqs', $data)) {
            modify("DELETE FROM service_faqs WHERE service_id = ?", [$serviceId]);
            foreach (($data['faqs'] ?? []) as $index => $faq) {
                $questionEn = trim((string) ($faq['question_en'] ?? ''));
                $questionAr = trim((string) ($faq['question_ar'] ?? ''));
                $answerEn = trim((string) ($faq['answer_en'] ?? ''));
                $answerAr = trim((string) ($faq['answer_ar'] ?? ''));
                if ($questionEn === '' && $questionAr === '') {
                    continue;
                }

                insert(
                    "INSERT INTO service_faqs (service_id, question_en, question_ar, answer_en, answer_ar, sort_order)
                     VALUES (?, ?, ?, ?, ?, ?)",
                    [$serviceId, $questionEn ?: $questionAr, $questionAr ?: $questionEn, $answerEn ?: null, $answerAr ?: null, $index + 1]
                );
            }
        }

        if (array_key_exists('media', $data)) {
            modify("DELETE FROM service_media WHERE service_id = ?", [$serviceId]);
            foreach (($data['media'] ?? []) as $index => $media) {
                $url = trim((string) ($media['media_url'] ?? ''));
                if ($url === '') {
                    continue;
                }

                insert(
                    "INSERT INTO service_media (service_id, media_url, media_type, alt_text_en, alt_text_ar, sort_order)
                     VALUES (?, ?, ?, ?, ?, ?)",
                    [
                        $serviceId,
                        $url,
                        $this->normalizeMediaType($media['media_type'] ?? 'image'),
                        $media['alt_text_en'] ?? null,
                        $media['alt_text_ar'] ?? null,
                        $index + 1,
                    ]
                );
            }
        }
    }

    private function hydrateService(array $row): array
    {
        $serviceId = (int) $row['id'];
        $row['metadata'] = !empty($row['metadata_json']) ? json_decode($row['metadata_json'], true) : [];
        $row['important_links'] = !empty($row['important_links_json']) ? json_decode($row['important_links_json'], true) : [];
        unset($row['metadata_json']);
        unset($row['important_links_json']);

        $row['features'] = fetchAll(
            "SELECT id, label_en, label_ar, sort_order FROM service_features WHERE service_id = ? ORDER BY sort_order ASC, id ASC",
            [$serviceId]
        );
        $row['steps'] = fetchAll(
            "SELECT id, title_en, title_ar, description_en, description_ar, sort_order FROM service_steps WHERE service_id = ? ORDER BY sort_order ASC, id ASC",
            [$serviceId]
        );
        $row['faqs'] = fetchAll(
            "SELECT id, question_en, question_ar, answer_en, answer_ar, sort_order FROM service_faqs WHERE service_id = ? ORDER BY sort_order ASC, id ASC",
            [$serviceId]
        );
        $row['media'] = fetchAll(
            "SELECT id, media_url, media_type, alt_text_en, alt_text_ar, sort_order FROM service_media WHERE service_id = ? ORDER BY sort_order ASC, id ASC",
            [$serviceId]
        );

        return $row;
    }
}
