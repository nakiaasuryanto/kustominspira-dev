-- First, let's check what columns exist in the videos table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'videos' AND table_schema = 'public';

-- Add missing columns to the videos table
-- Add thumbnail column if it doesn't exist
ALTER TABLE videos ADD COLUMN IF NOT EXISTS thumbnail VARCHAR DEFAULT '/assets/pusatbelajar.webp';

-- Add other potentially missing columns
ALTER TABLE videos ADD COLUMN IF NOT EXISTS "videoUrl" VARCHAR;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS video_url VARCHAR;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS views VARCHAR DEFAULT '0';
ALTER TABLE videos ADD COLUMN IF NOT EXISTS category VARCHAR DEFAULT 'Tutorial';
ALTER TABLE videos ADD COLUMN IF NOT EXISTS status VARCHAR DEFAULT 'published';
ALTER TABLE videos ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
ALTER TABLE videos ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Verify the table structure after adding columns
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'videos' AND table_schema = 'public'
ORDER BY ordinal_position;