-- Database migration to add featured column for spotlight functionality
-- Run these SQL commands in your Supabase SQL editor

-- Add featured column to articles table
ALTER TABLE articles ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Add featured column to videos table  
ALTER TABLE videos ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Add featured column to ebooks table
ALTER TABLE ebooks ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Optional: Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured);
CREATE INDEX IF NOT EXISTS idx_videos_featured ON videos(featured);  
CREATE INDEX IF NOT EXISTS idx_ebooks_featured ON ebooks(featured);

-- Optional: Set one existing article as featured for testing
-- UPDATE articles SET featured = true WHERE id = (SELECT id FROM articles ORDER BY created_at DESC LIMIT 1);