-- Database initialization script for SupoClip
-- Create database schema with required tables

-- Enable UUID extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (compatible with Prisma schema)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    image VARCHAR(500),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    password_hash VARCHAR(255),
    -- Default font preferences
    default_font_family VARCHAR(100) DEFAULT 'TikTokSans-Regular',
    default_font_size INTEGER DEFAULT 24,
    default_font_color VARCHAR(7) DEFAULT '#FFFFFF',
    notify_on_completion BOOLEAN NOT NULL DEFAULT true,
    -- Monetization and billing fields
    is_admin BOOLEAN NOT NULL DEFAULT false,
    plan VARCHAR(20) NOT NULL DEFAULT 'free',
    subscription_status VARCHAR(20) NOT NULL DEFAULT 'inactive',
    subscription_provider VARCHAR(20),
    stripe_customer_id VARCHAR(255) UNIQUE,
    stripe_subscription_id VARCHAR(255) UNIQUE,
    billing_period_start TIMESTAMP WITH TIME ZONE,
    billing_period_end TIMESTAMP WITH TIME ZONE,
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    subscription_cancel_at TIMESTAMP WITH TIME ZONE
);

-- Source table (created before tasks since tasks reference sources)
CREATE TABLE IF NOT EXISTS sources (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    type VARCHAR(20) CHECK (type IN ('youtube', 'video_url')) NOT NULL,
    title VARCHAR(500) NOT NULL,
    url VARCHAR(1000),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    source_id VARCHAR(36) REFERENCES sources(id) ON DELETE SET NULL,
    generated_clips_ids VARCHAR(36)[], -- Array of clip IDs
    status VARCHAR(20) NOT NULL DEFAULT 'pending',

    -- Progress tracking fields
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    progress_message TEXT,
    source_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    -- Font customization fields
    font_family VARCHAR(100) DEFAULT 'TikTokSans-Regular',
    font_size INTEGER DEFAULT 24,
    font_color VARCHAR(7) DEFAULT '#FFFFFF', -- Hex color code

    -- Caption template and B-roll options
    caption_template VARCHAR(50) DEFAULT 'default',
    include_broll BOOLEAN DEFAULT false,
    processing_mode VARCHAR(20) NOT NULL DEFAULT 'fast',
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    cache_hit BOOLEAN NOT NULL DEFAULT false,
    error_code VARCHAR(80),
    stage_timings_json TEXT,
    completion_notification_sent_at TIMESTAMP WITH TIME ZONE,
    share_token VARCHAR(64),
    share_enabled BOOLEAN NOT NULL DEFAULT false,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Generated clips table
CREATE TABLE IF NOT EXISTS generated_clips (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    task_id VARCHAR(36) NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    start_time VARCHAR(20) NOT NULL, -- MM:SS format
    end_time VARCHAR(20) NOT NULL,   -- MM:SS format
    duration FLOAT NOT NULL,         -- Duration in seconds
    text TEXT,                       -- Transcript text for this clip
    relevance_score FLOAT NOT NULL,
    reasoning TEXT,                  -- AI reasoning for selection
    clip_order INTEGER NOT NULL,     -- Order within the task

    -- Virality score breakdown
    virality_score INTEGER DEFAULT 0,
    hook_score INTEGER DEFAULT 0,
    engagement_score INTEGER DEFAULT 0,
    value_score INTEGER DEFAULT 0,
    shareability_score INTEGER DEFAULT 0,
    hook_type VARCHAR(50),
    hook_title VARCHAR(200),         -- AI-written on-screen headline

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS processing_cache (
    cache_key VARCHAR(255) PRIMARY KEY,
    source_url TEXT NOT NULL,
    source_type VARCHAR(20) NOT NULL,
    video_path TEXT,
    transcript_text TEXT,
    analysis_json TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Better Auth tables
CREATE TABLE IF NOT EXISTS session (
    id VARCHAR(36) PRIMARY KEY,
    "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "ipAddress" VARCHAR(255),
    "userAgent" TEXT,
    "userId" VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS account (
    id VARCHAR(36) PRIMARY KEY,
    "accountId" VARCHAR(255) NOT NULL,
    "providerId" VARCHAR(255) NOT NULL,
    "userId" VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP WITH TIME ZONE,
    "refreshTokenExpiresAt" TIMESTAMP WITH TIME ZONE,
    scope TEXT,
    password TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS verification (
    id VARCHAR(36) PRIMARY KEY,
    identifier VARCHAR(255) NOT NULL,
    value VARCHAR(255) NOT NULL,
    "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE,
    "updatedAt" TIMESTAMP WITH TIME ZONE
);

-- Stripe webhook idempotency table
CREATE TABLE IF NOT EXISTS stripe_webhook_events (
    id VARCHAR(255) PRIMARY KEY,
    type VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RevenueCat webhook idempotency table
CREATE TABLE IF NOT EXISTS revenuecat_webhook_events (
    id VARCHAR(255) PRIMARY KEY,
    type VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS app_settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    encrypted_value TEXT NOT NULL,
    prefer_admin_value BOOLEAN NOT NULL DEFAULT false,
    updated_by VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Per-user API keys for programmatic access (e.g. the MCP server)
CREATE TABLE IF NOT EXISTS api_keys (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(120) NOT NULL DEFAULT 'API Key',
    key_hash VARCHAR(64) NOT NULL UNIQUE,
    key_prefix VARCHAR(16) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP WITH TIME ZONE,
    revoked_at TIMESTAMP WITH TIME ZONE
);

-- First-touch campaign attribution, written once shortly after sign-up
CREATE TABLE IF NOT EXISTS user_acquisition (
    user_id VARCHAR(36) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_content VARCHAR(100),
    utm_term VARCHAR(100),
    ref VARCHAR(100),
    referrer_host VARCHAR(255),
    landing_path VARCHAR(512),
    first_seen_at TIMESTAMP WITH TIME ZONE,
    first_clip_exported_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Creator (affiliate) program: one application per user, reviewed by admins
CREATE TABLE IF NOT EXISTS affiliates (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    slug VARCHAR(20) UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    platform VARCHAR(20) NOT NULL,
    profile_url VARCHAR(500) NOT NULL,
    audience_size VARCHAR(20) NOT NULL,
    video_url VARCHAR(500),
    promotion_plan VARCHAR(1000),
    decline_reason VARCHAR(1000),
    stripe_promotion_code_id VARCHAR(255),
    app_store_code_added_at TIMESTAMP WITH TIME ZONE,
    terms_accepted_at TIMESTAMP WITH TIME ZONE NOT NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "announcements" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" VARCHAR(120) NOT NULL,
    "description" VARCHAR(2000) NOT NULL,
    "href" VARCHAR(500) NOT NULL,
    "action" VARCHAR(80) NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "announcements_is_published_published_at_idx"
    ON "announcements" ("is_published", "published_at");

-- Preserve the first announcement's ID so existing read badges stay cleared.
INSERT INTO "announcements" ("id", "title", "description", "href", "action", "is_published", "published_at")
VALUES (
    'creator-program-2026-10',
    'The creator program is open',
    'Make content about SupoClip and get hosted Pro for free while participating as an approved creator. Your audience gets 20% off their first three months. No cash payments or referral commissions.',
    '/affiliate',
    'Explore the creator program',
    true,
    '2026-10-09T00:00:00Z'
)
ON CONFLICT ("id") DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS user_acquisition_utm_source_utm_campaign_idx ON user_acquisition(utm_source, utm_campaign);
CREATE INDEX IF NOT EXISTS affiliates_status_created_at_idx ON affiliates(status, created_at);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_source_id ON tasks(source_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);
CREATE INDEX IF NOT EXISTS idx_tasks_processing_mode ON tasks(processing_mode);
CREATE INDEX IF NOT EXISTS idx_tasks_completed_at ON tasks(completed_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_tasks_share_token ON tasks(share_token) WHERE share_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_sources_created_at ON sources(created_at);
CREATE INDEX IF NOT EXISTS idx_processing_cache_source_url ON processing_cache(source_url);
CREATE INDEX IF NOT EXISTS idx_generated_clips_task_id ON generated_clips(task_id);
CREATE INDEX IF NOT EXISTS idx_generated_clips_clip_order ON generated_clips(clip_order);
CREATE INDEX IF NOT EXISTS idx_generated_clips_created_at ON generated_clips(created_at);
CREATE INDEX IF NOT EXISTS idx_session_token ON session(token);
CREATE INDEX IF NOT EXISTS idx_session_userId ON session("userId");
CREATE INDEX IF NOT EXISTS idx_account_userId ON account("userId");
CREATE INDEX IF NOT EXISTS idx_verification_identifier ON verification(identifier);
CREATE INDEX IF NOT EXISTS idx_app_settings_updated_by ON app_settings(updated_by);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create function for updatedAt column (Prisma format)
CREATE OR REPLACE FUNCTION update_updatedAt_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at and updatedAt
-- Users table only has "updatedAt" (Better Auth convention)
DROP TRIGGER IF EXISTS update_users_updatedAt ON users;
CREATE TRIGGER update_users_updatedAt BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updatedAt_column();

-- Tasks, sources, and generated_clips use snake_case updated_at
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_sources_updated_at ON sources;
CREATE TRIGGER update_sources_updated_at BEFORE UPDATE ON sources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_generated_clips_updated_at ON generated_clips;
CREATE TRIGGER update_generated_clips_updated_at BEFORE UPDATE ON generated_clips FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_app_settings_updated_at ON app_settings;
CREATE TRIGGER update_app_settings_updated_at BEFORE UPDATE ON app_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Better Auth tables use camelCase "updatedAt"
DROP TRIGGER IF EXISTS update_session_updatedAt ON session;
CREATE TRIGGER update_session_updatedAt BEFORE UPDATE ON session FOR EACH ROW EXECUTE FUNCTION update_updatedAt_column();
DROP TRIGGER IF EXISTS update_account_updatedAt ON account;
CREATE TRIGGER update_account_updatedAt BEFORE UPDATE ON account FOR EACH ROW EXECUTE FUNCTION update_updatedAt_column();
DROP TRIGGER IF EXISTS update_verification_updatedAt ON verification;
CREATE TRIGGER update_verification_updatedAt BEFORE UPDATE ON verification FOR EACH ROW EXECUTE FUNCTION update_updatedAt_column();
