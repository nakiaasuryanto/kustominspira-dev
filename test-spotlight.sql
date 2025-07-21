-- Test spotlight functionality by setting one article as featured
-- Run this after the main migration to test if everything works

-- Set the most recent article as featured for testing
UPDATE articles SET featured = true 
WHERE id = (
  SELECT id FROM articles 
  WHERE status = 'published' 
  ORDER BY created_at DESC 
  LIMIT 1
);

-- Check if the update worked
SELECT id, title, featured FROM articles WHERE featured = true;