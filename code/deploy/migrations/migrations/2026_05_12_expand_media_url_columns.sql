-- Allow longer external media/referral URLs such as S3, CDN, YouTube, and signed video links.
-- Run after 2026_05_05_production_readiness.sql on existing databases.

ALTER TABLE services
    MODIFY cta_url VARCHAR(1000) NULL,
    MODIFY thumbnail_url VARCHAR(1000) NULL,
    MODIFY cover_url VARCHAR(1000) NULL,
    MODIFY cover_video_poster_url VARCHAR(1000) NULL,
    MODIFY card_media_url VARCHAR(1000) NULL,
    MODIFY card_video_poster_url VARCHAR(1000) NULL,
    MODIFY referral_url VARCHAR(1000) NULL,
    MODIFY broker_url VARCHAR(1000) NULL;

ALTER TABLE service_media
    MODIFY media_url VARCHAR(1000) NOT NULL;
