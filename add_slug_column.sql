-- Add slug column to articles table in Supabase
-- Run this in your Supabase SQL Editor to enable slug functionality

-- Add slug column to articles table (optional, can be null)
ALTER TABLE articles ADD COLUMN IF NOT EXISTS slug VARCHAR;

-- Create index on slug for better performance
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);

-- Update existing articles to generate slugs (optional)
-- This will create slugs for existing articles based on their titles
UPDATE articles 
SET slug = lower(
  regexp_replace(
    regexp_replace(
      regexp_replace(title, '[^\w\s-]', '', 'g'), 
      '\s+', '-', 'g'
    ), 
    '-+', '-', 'g'
  )
) 
WHERE slug IS NULL AND title IS NOT NULL;

-- Verify the update
SELECT id, title, slug FROM articles ORDER BY created_at DESC LIMIT 10;