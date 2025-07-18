# 🎯 Complete Supabase Setup Guide

## Why Supabase?
- ✅ **Real PostgreSQL database** (much better than Firebase)
- ✅ **Built-in file storage** (like Firebase Storage)
- ✅ **Easy setup** (10 minutes)
- ✅ **Free tier** (500MB database, 1GB storage)
- ✅ **SQL queries** (no complex NoSQL)
- ✅ **Dashboard UI** for managing data

## Step 1: Create Supabase Project

1. **Go to [supabase.com](https://supabase.com)**
2. **Sign up/Login** with your email
3. **Click "New project"**
4. **Fill in details:**
   - **Organization:** Create new or use existing
   - **Name:** `kustom-inspira`
   - **Database Password:** Choose a strong password (save it!)
   - **Region:** `Southeast Asia (Singapore)` (closest to you)
   - **Pricing Plan:** Free
5. **Click "Create new project"**
6. **Wait 2-3 minutes** for setup to complete

## Step 2: Get Your Credentials

1. **In your Supabase dashboard**, go to **Settings** → **API**
2. **Copy these values:**
   - **Project URL:** `https://your-project-id.supabase.co`
   - **anon/public key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 3: Update Your Project

1. **Open `/src/lib/supabase.ts`**
2. **Replace the placeholder values:**

```typescript
// Replace these lines:
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'

// With your actual values:
const supabaseUrl = 'https://your-project-id.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

## Step 4: Create Database Tables

1. **In Supabase Dashboard**, go to **SQL Editor**
2. **Click "New query"**
3. **Copy the entire content** from `database-schema.sql`
4. **Paste it** in the SQL editor
5. **Click "Run"**
6. **Verify:** Go to **Table Editor** → Should see 5 tables created

## Step 5: Setup Storage

1. **In Supabase Dashboard**, go to **Storage**
2. **Click "New bucket"**
3. **Bucket name:** `images`
4. **Make bucket public:** ✅ Yes
5. **Click "Create bucket"**

## Step 6: Update Your Admin Panel

1. **Open `/src/app/admin/page.tsx`**
2. **Replace the import:**

```typescript
// Change this:
import { dataManager } from '@/lib/dataManager';

// To this:
import { supabaseDataManager as dataManager } from '@/lib/supabaseDataManager';
```

3. **Replace ImageUpload component:**

```typescript
// Change this:
import ImageUpload from '@/components/ImageUpload';

// To this:
import ImageUpload from '@/components/SupabaseImageUpload';
```

## Step 7: Update Public Pages

1. **Open `/src/app/pusat-belajar/page.tsx`**
2. **Replace the import:**

```typescript
// Change this:
import { dataManager } from '@/lib/dataManager';

// To this:
import { supabaseDataManager as dataManager } from '@/lib/supabaseDataManager';
```

3. **Repeat for:**
   - `/src/app/temu-belajar/page.tsx`
   - `/src/app/gallery/page.tsx`

## Step 8: Update Data Field Names

Since SQL uses snake_case, update your components to use the new field names:

**Articles:**
- `readTime` → `read_time`
- `createdAt` → `created_at`
- `image` → `image_url`

**Videos:**
- `thumbnail` → `thumbnail_url`
- `videoUrl` → `video_url`

**Events:**
- `spots` → `spots` (same)
- `image` → `image_url`

**Gallery:**
- `image` → `image_url`
- `uploadedAt` → `uploaded_at`

## Step 9: Test Your Setup

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Go to `/admin`**
3. **Check the dashboard** - should show data from Supabase
4. **Try creating a new article** with image upload
5. **Visit `/pusat-belajar`** - should show your new article

## ✅ Benefits You'll Get

- **Fast loading** (real database)
- **Reliable image uploads** (Supabase Storage)
- **Easy data management** (SQL queries)
- **Professional setup** (production-ready)
- **Better performance** (optimized queries)

## 🔧 Troubleshooting

**Connection Error:**
- Check your `supabaseUrl` and `supabaseKey` in `/src/lib/supabase.ts`
- Make sure your project is active in Supabase dashboard

**Storage Error:**
- Make sure you created the `images` bucket
- Make sure the bucket is public

**Query Error:**
- Make sure you ran the full SQL schema
- Check the Tables tab in Supabase dashboard

## 🚀 Next Steps

Once setup is complete:
1. **Your website will be much faster**
2. **Image uploads will work perfectly**
3. **Data management will be reliable**
4. **Ready for production deployment**

**Need help?** Let me know what step you're stuck on!