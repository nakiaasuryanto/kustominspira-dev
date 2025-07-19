-- Add tags columns to all content tables in Supabase
-- Run this in your Supabase SQL Editor to enable tags functionality

-- Add tags column to articles table (JSON array for multiple tags)
ALTER TABLE articles ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]';

-- Add tags column to videos table (JSON array for multiple tags)
ALTER TABLE videos ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]';

-- Add tags column to ebooks table (JSON array for multiple tags)
ALTER TABLE ebooks ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]';

-- Add tags column to events table (JSON array for multiple tags)
ALTER TABLE events ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]';

-- Create indexes on tags columns for better search performance
CREATE INDEX IF NOT EXISTS idx_articles_tags ON articles USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_videos_tags ON videos USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_ebooks_tags ON ebooks USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_events_tags ON events USING GIN (tags);

-- Add some sample tags for existing content (optional)
-- You can modify these based on your actual content

-- Sample tags for articles
UPDATE articles 
SET tags = '["menjahit", "tutorial", "diy fashion", "kustom inspira"]'::jsonb 
WHERE tags = '[]'::jsonb AND category IN ('Menjahit Dasar', 'Tutorial');

UPDATE articles 
SET tags = '["fashion", "desain", "kreatif", "inspirasi"]'::jsonb 
WHERE tags = '[]'::jsonb AND category IN ('Fashion Design', 'Desain');

-- Sample tags for videos
UPDATE videos 
SET tags = '["video tutorial", "pembelajaran", "step by step"]'::jsonb 
WHERE tags = '[]'::jsonb;

-- Sample tags for ebooks
UPDATE ebooks 
SET tags = '["panduan lengkap", "ebook", "referensi"]'::jsonb 
WHERE tags = '[]'::jsonb;

-- Verify the updates
SELECT 'articles' as table_name, COUNT(*) as total_records, COUNT(CASE WHEN tags != '[]'::jsonb THEN 1 END) as records_with_tags FROM articles
UNION ALL
SELECT 'videos' as table_name, COUNT(*) as total_records, COUNT(CASE WHEN tags != '[]'::jsonb THEN 1 END) as records_with_tags FROM videos
UNION ALL
SELECT 'ebooks' as table_name, COUNT(*) as total_records, COUNT(CASE WHEN tags != '[]'::jsonb THEN 1 END) as records_with_tags FROM ebooks
UNION ALL
SELECT 'events' as table_name, COUNT(*) as total_records, COUNT(CASE WHEN tags != '[]'::jsonb THEN 1 END) as records_with_tags FROM events;