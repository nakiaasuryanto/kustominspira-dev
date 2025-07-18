-- Kustom Inspira Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Articles table
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    author VARCHAR(100) NOT NULL,
    read_time VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    image_url TEXT,
    status VARCHAR(20) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Videos table
CREATE TABLE videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    duration VARCHAR(20) NOT NULL,
    views VARCHAR(20) DEFAULT '0',
    thumbnail_url TEXT,
    video_url TEXT,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(50) NOT NULL,
    location VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price VARCHAR(50) NOT NULL,
    spots INTEGER NOT NULL,
    description TEXT,
    image_url TEXT,
    status VARCHAR(20) DEFAULT 'upcoming',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ebooks table
CREATE TABLE ebooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    pages VARCHAR(20) NOT NULL,
    format VARCHAR(10) NOT NULL,
    size VARCHAR(20) NOT NULL,
    download_count INTEGER DEFAULT 0,
    file_url TEXT,
    status VARCHAR(20) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery table
CREATE TABLE gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT,
    tags TEXT[],
    height VARCHAR(20),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data
INSERT INTO articles (title, category, author, read_time, content, excerpt, image_url, status) VALUES
('Panduan Lengkap Menjahit untuk Pemula', 'Tutorial', 'Tim Kustom Inspira', '15 min', 
 '# Panduan Menjahit Pemula\n\nSelamat datang di tutorial menjahit! Mari kita pelajari dasar-dasar menjahit.\n\n## Persiapan Alat\n\n- Mesin jahit\n- Benang\n- Kain\n- Gunting\n\n## Langkah Pertama\n\nMulai dengan menyiapkan mesin jahit...', 
 'Pelajari dasar-dasar menjahit dari nol hingga mahir. Tutorial step-by-step yang mudah diikuti.', 
 '/assets/pusatbelajar.webp', 'published'),

('Teknik Pola Dasar Baju Wanita', 'Pola', 'Sarah Wijaya', '20 min',
 '# Pola Dasar Baju Wanita\n\nMembuat pola dasar yang akurat adalah kunci sukses dalam menjahit.\n\n## Mengukur Tubuh\n\n1. Lingkar dada\n2. Lingkar pinggang\n3. Lingkar pinggul\n\n## Membuat Pola\n\nLangkah-langkah membuat pola dasar...',
 'Membuat pola dasar yang akurat adalah kunci sukses dalam menjahit. Simak tips dan triknya.',
 '/assets/temubelajar.webp', 'published');

INSERT INTO videos (title, duration, views, thumbnail_url, video_url, category, status) VALUES
('Cara Menggunakan Mesin Jahit untuk Pemula', '25:30', '15.2K', '/assets/pusatbelajar.webp', 'https://youtube.com/watch?v=example', 'Tutorial', 'published'),
('Tutorial Membuat Tas Totebag Simple', '18:45', '8.7K', '/assets/temubelajar.webp', 'https://youtube.com/watch?v=example2', 'Project', 'published');

INSERT INTO events (title, date, time, location, category, price, spots, description, image_url, status) VALUES
('Workshop Dasar Menjahit', '2025-01-15', '09:00 - 12:00', 'Jakarta', 'workshop', 'Rp 150.000', 12, 'Workshop praktis untuk pemula', '/assets/temubelajar.webp', 'upcoming'),
('Seminar Fashion Sustainable', '2025-01-20', '14:00 - 17:00', 'Surabaya', 'seminar', 'Gratis', 25, 'Diskusi tentang fashion berkelanjutan', '/assets/pusatbelajar.webp', 'upcoming');

INSERT INTO ebooks (title, description, pages, format, size, download_count, file_url, status) VALUES
('E-Book Pola Dasar Pakaian Wanita', 'Koleksi lengkap pola dasar dari ukuran S hingga XXL', '120 halaman', 'PDF', '25 MB', 1250, '/ebooks/pola-dasar.pdf', 'published'),
('Panduan Menjahit Aksesori Fashion', 'Tutorial membuat tas, dompet, dan aksesori lainnya', '85 halaman', 'PDF', '18 MB', 890, '/ebooks/aksesori.pdf', 'published');

INSERT INTO gallery (title, category, image_url, description, tags, height) VALUES
('Custom Batik Dress', 'fashion', '/assets/kustominspira.webp', 'Beautiful custom batik dress with modern touch', ARRAY['batik', 'dress', 'fashion'], 'h-64'),
('Handmade Totebag Collection', 'accessories', '/assets/pusatbelajar.webp', 'Eco-friendly handmade totebags', ARRAY['totebag', 'eco-friendly', 'accessories'], 'h-48');

-- Enable Row Level Security (RLS) for better security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Create policies (allow public read, authenticated write)
CREATE POLICY "Public can view published articles" ON articles FOR SELECT USING (status = 'published');
CREATE POLICY "Public can view published videos" ON videos FOR SELECT USING (status = 'published');
CREATE POLICY "Public can view upcoming events" ON events FOR SELECT USING (status = 'upcoming');
CREATE POLICY "Public can view published ebooks" ON ebooks FOR SELECT USING (status = 'published');
CREATE POLICY "Public can view gallery" ON gallery FOR SELECT USING (true);

-- Allow authenticated users to manage content (for admin)
CREATE POLICY "Authenticated users can manage articles" ON articles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage videos" ON videos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage events" ON events FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage ebooks" ON ebooks FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage gallery" ON gallery FOR ALL USING (auth.role() = 'authenticated');