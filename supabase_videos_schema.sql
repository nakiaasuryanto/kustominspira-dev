-- Create videos table in Supabase
CREATE TABLE IF NOT EXISTS videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR NOT NULL,
    duration VARCHAR NOT NULL,
    category VARCHAR DEFAULT 'Tutorial',
    "videoUrl" VARCHAR, -- Note: camelCase for videoUrl
    thumbnail VARCHAR DEFAULT '/assets/pusatbelajar.webp',
    views VARCHAR DEFAULT '0',
    status VARCHAR DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS (Row Level Security) if needed
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations (adjust as needed for your security requirements)
CREATE POLICY "Allow all operations on videos" ON videos
    FOR ALL USING (true) WITH CHECK (true);