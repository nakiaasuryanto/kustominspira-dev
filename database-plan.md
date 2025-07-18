# Database Architecture Plan for Kustom Inspira

## Current State
- ✅ localStorage-based system working perfectly for development
- ✅ All CRUD operations functional
- ✅ Data persistence across sessions

## Production Requirements Analysis

### When to migrate to database:
1. **Multiple admins** - Need user management
2. **Public website** - Need server-side rendering (SEO)
3. **Large content volume** - 100+ articles/videos
4. **Advanced features** - Search, analytics, scheduling

## Recommended Database Solutions

### Option 1: Supabase (Recommended)
```typescript
// Easy migration from current dataManager
// PostgreSQL with real-time subscriptions
// Built-in auth and file storage
// Free tier: 50MB database, 100MB storage
```

**Benefits:**
- Drop-in replacement for localStorage
- Real-time updates across all pages
- Built-in authentication
- File upload for images/videos
- Easy deployment

### Option 2: Firebase Firestore
```typescript
// NoSQL document database
// Real-time sync
// Good for rapid development
```

### Option 3: Traditional Database (PostgreSQL + Prisma)
```typescript
// Full control over data structure
// Better for complex queries
// Requires more setup
```

## Migration Strategy

### Phase 1: Prepare for Migration (Current)
- ✅ Centralized data management (dataManager.ts)
- ✅ TypeScript interfaces defined
- ✅ CRUD operations abstracted

### Phase 2: Database Integration
1. **Setup Supabase project**
2. **Create database tables** matching current interfaces
3. **Update dataManager** to use Supabase instead of localStorage
4. **Add authentication** with Supabase Auth
5. **Deploy to production**

### Phase 3: Advanced Features
1. **File upload** for images/videos
2. **Content scheduling**
3. **Search functionality**
4. **Analytics dashboard**
5. **Multiple admin roles**

## Database Schema Design

### Tables Structure:
```sql
-- Users table (admin management)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  role VARCHAR DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Articles table
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  content TEXT,
  excerpt TEXT,
  category VARCHAR,
  author VARCHAR,
  read_time VARCHAR,
  image_url VARCHAR,
  status VARCHAR DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Videos table
CREATE TABLE videos (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  duration VARCHAR,
  views VARCHAR DEFAULT '0',
  thumbnail_url VARCHAR,
  video_url VARCHAR,
  category VARCHAR,
  status VARCHAR DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  date DATE,
  time VARCHAR,
  location VARCHAR,
  category VARCHAR,
  price VARCHAR,
  spots INTEGER,
  description TEXT,
  image_url VARCHAR,
  status VARCHAR DEFAULT 'upcoming',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Ebooks table
CREATE TABLE ebooks (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  pages VARCHAR,
  format VARCHAR,
  size VARCHAR,
  download_count INTEGER DEFAULT 0,
  file_url VARCHAR,
  status VARCHAR DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Gallery table
CREATE TABLE gallery (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  category VARCHAR,
  image_url VARCHAR,
  description TEXT,
  tags TEXT[], -- PostgreSQL array
  uploaded_at TIMESTAMP DEFAULT NOW()
);
```

## Implementation Timeline

### Immediate (Keep localStorage)
- ✅ Current system works perfectly
- ✅ Continue development with localStorage
- ✅ All features functional

### When Ready for Production (1-2 weeks)
1. **Day 1-2**: Setup Supabase project
2. **Day 3-4**: Migrate dataManager to Supabase
3. **Day 5-6**: Test all CRUD operations
4. **Day 7**: Deploy to production

## Cost Analysis

### Supabase Pricing:
- **Free Tier**: Perfect for start
  - 50MB database
  - 100MB file storage
  - 50MB bandwidth/month
  
- **Pro Tier**: $25/month when scaling
  - 8GB database
  - 250GB storage
  - 250GB bandwidth

### Recommendation:
**Start with localStorage → Migrate to Supabase when ready for production**

## Migration Code Example

```typescript
// Current dataManager.ts works as-is
// Just need to update the implementation:

class DatabaseManager {
  // Replace localStorage with Supabase calls
  async getArticles() {
    const { data } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published');
    return data;
  }
  
  async addArticle(article) {
    const { data } = await supabase
      .from('articles')
      .insert([article]);
    return data[0];
  }
  // ... rest of CRUD operations
}
```

## Decision Point:
**You can continue with localStorage for another 2-4 weeks easily. Migrate to database when:**
1. You're ready to go live publicly
2. You need multiple admins
3. You want SEO optimization
4. You have 50+ pieces of content