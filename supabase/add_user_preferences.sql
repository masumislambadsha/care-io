-- Add preferences column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}'::jsonb;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_users_preferences ON users USING gin(preferences);

-- Example of how to query preferences:
-- SELECT preferences->>'emailNotifications' FROM users WHERE id = 'user-id';
