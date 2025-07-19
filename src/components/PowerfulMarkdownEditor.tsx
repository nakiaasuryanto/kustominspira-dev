// @ts-nocheck
'use client';
import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabase';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

interface PowerfulMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function PowerfulMarkdownEditor({ 
  value, 
  onChange, 
  placeholder = "Tulis konten artikel Anda di sini...",
  className = '' 
}: PowerfulMarkdownEditorProps) {
  const [mounted, setMounted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      console.log('Starting image upload for file:', file.name);
      
      // Create unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2);
      const filename = `${timestamp}_${randomString}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = `article-images/${filename}`;
      
      console.log('Uploading to path:', filePath);
      
      // Try to upload file to Supabase Storage
      let { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      // If bucket doesn't exist, try to create it
      if (uploadError && uploadError.message.includes('Bucket not found')) {
        console.log('Bucket not found, trying to create it...');
        const { error: createError } = await supabase.storage.createBucket('images', {
          public: true,
          allowedMimeTypes: ['image/*'],
          fileSizeLimit: 10485760 // 10MB
        });
        
        if (!createError) {
          // Try upload again after bucket creation
          const { data: retryData, error: retryError } = await supabase.storage
            .from('images')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false
            });
          uploadData = retryData;
          uploadError = retryError;
        }
      }

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload completed:', uploadData);
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);
      
      console.log('Public URL obtained:', publicUrl);
      
      // Insert markdown image syntax with cursor position
      const imageMarkdown = `\n\n![${file.name.replace(/\.[^/.]+$/, "")}](${publicUrl})\n\n`;
      const newValue = value + imageMarkdown;
      onChange(newValue);
      
      return publicUrl;
    } catch (error) {
      console.error('Detailed image upload error:', error);
      
      let errorMessage = 'Gagal mengupload gambar. ';
      if (error instanceof Error) {
        if (error.message.includes('storage')) {
          errorMessage += 'Storage belum dikonfigurasi. Silakan aktifkan Supabase Storage.';
        } else if (error.message.includes('network')) {
          errorMessage += 'Error jaringan. Silakan cek koneksi internet.';
        } else if (error.message.includes('bucket')) {
          errorMessage += 'Storage bucket tidak ditemukan. Silakan buat bucket "images".';
        } else if (error.message.includes('Policy')) {
          errorMessage += 'Policy storage belum dikonfigurasi dengan benar.';
        } else {
          errorMessage += error.message;
        }
      }
      
      alert(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Silakan pilih file gambar (JPG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran file harus kurang dari 10MB');
      return;
    }

    handleImageUpload(file);
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const insertMarkdown = (markdownText: string) => {
    console.log('Inserting markdown:', markdownText);
    
    // Add appropriate spacing based on content
    let newValue;
    if (value.trim() === '') {
      // Empty editor - just add the content
      newValue = markdownText;
    } else {
      // Non-empty editor - add with proper spacing
      const needsNewlineBefore = !value.endsWith('\n') && !value.endsWith('\n\n');
      const spacing = needsNewlineBefore ? '\n\n' : '\n';
      newValue = value + spacing + markdownText;
    }
    
    onChange(newValue);
    
    // Try to focus the editor and position cursor
    setTimeout(() => {
      const textarea = document.querySelector('.w-md-editor-text-area') as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();
        // Set cursor to end of the newly inserted content
        const cursorPosition = newValue.length;
        textarea.setSelectionRange(cursorPosition, cursorPosition);
        console.log('Editor focused and cursor positioned');
      } else {
        console.log('Could not find textarea element');
      }
    }, 150);
  };

  const quickInsertButtons = [
    {
      label: 'Header 1 (Judul Utama)',
      icon: 'H1',
      action: () => insertMarkdown('# Judul Utama Artikel\n\n', 'Judul Utama Artikel'),
      description: 'Untuk judul utama artikel (hanya 1 per artikel)'
    },
    {
      label: 'Header 2 (Section Besar)', 
      icon: 'H2',
      action: () => insertMarkdown('## Section Utama\n\n', 'Section Utama'),
      description: 'Untuk pembagian section besar dalam artikel'
    },
    {
      label: 'Header 3 (Sub Section)',
      icon: 'H3',
      action: () => insertMarkdown('### Sub Section\n\n', 'Sub Section'),
      description: 'Untuk sub-bagian dalam setiap section'
    },
    {
      label: 'Teks Tebal',
      icon: 'B',
      action: () => insertMarkdown('**teks penting**', 'teks penting'),
      description: 'Untuk menekankan kata/kalimat penting'
    },
    {
      label: 'Teks Miring',
      icon: 'I',
      action: () => insertMarkdown('*teks miring*', 'teks miring'),
      description: 'Untuk penekanan ringan atau istilah asing'
    },
    {
      label: 'Bullet List',
      icon: '•',
      action: () => insertMarkdown('\n- Poin pertama\n- Poin kedua\n- Poin ketiga\n\n'),
      description: 'Untuk daftar tanpa urutan'
    },
    {
      label: 'Numbered List',
      icon: '1.',
      action: () => insertMarkdown('\n1. Langkah pertama\n2. Langkah kedua\n3. Langkah ketiga\n\n'),
      description: 'Untuk daftar berurutan/langkah-langkah'
    },
    {
      label: 'Quote/Kutipan',
      icon: '&quot;',
      action: () => insertMarkdown('\n> &quot;Kutipan penting atau highlight informasi&quot;\n\n'),
      description: 'Untuk kutipan atau informasi penting'
    },
    {
      label: 'Inline Code',
      icon: '</>',
      action: () => insertMarkdown('`kode atau istilah teknis`', 'kode atau istilah teknis'),
      description: 'Untuk kode atau istilah teknis'
    },
    {
      label: 'Link',
      icon: '🔗',
      action: () => insertMarkdown('[teks yang diklik](https://contoh.com)', 'teks yang diklik'),
      description: 'Untuk menambahkan link eksternal'
    },
    {
      label: 'Pemisah',
      icon: '---',
      action: () => insertMarkdown('\n\n---\n\n'),
      description: 'Garis pemisah antar section'
    },
  ];

  const templateButtons = [
    {
      label: 'Template Tutorial SEO',
      action: () => {
        const template = `# Cara [Melakukan Sesuatu]: Panduan Lengkap untuk Pemula

*Meta description: Pelajari cara [melakukan sesuatu] dengan panduan step-by-step yang mudah diikuti. Cocok untuk pemula dengan hasil maksimal.*

## Pendahuluan

Apakah Anda ingin belajar **cara [melakukan sesuatu]** dengan mudah dan efektif? Dalam artikel ini, kami akan membahas langkah demi langkah untuk mencapai hasil terbaik.

### Apa yang Akan Anda Pelajari

- ✅ Dasar-dasar [topik] yang harus dikuasai
- ✅ Alat dan bahan yang dibutuhkan
- ✅ Teknik [khusus] untuk hasil optimal
- ✅ Tips menghindari kesalahan umum

## Persiapan Sebelum Memulai

### Alat dan Bahan yang Dibutuhkan

1. **Alat utama**: [nama alat] - fungsinya untuk...
2. **Bahan pendukung**: [nama bahan] - berguna untuk...
3. **Optional**: [alat tambahan] - meningkatkan kualitas hasil

### Persiapan Mental dan Fisik

> **Penting**: Pastikan Anda dalam kondisi [siap/fokus] sebelum memulai proses ini.

## Langkah-langkah Utama

### Langkah 1: Persiapan Awal

**Waktu yang dibutuhkan**: 15-20 menit

Pada tahap ini, Anda akan:
- Menyiapkan semua alat dan bahan
- Mengatur area kerja yang nyaman
- Memastikan kondisi optimal untuk bekerja

**Tips pro**: *Jangan skip langkah persiapan ini karena akan mempengaruhi hasil akhir.*

### Langkah 2: Proses Utama

**Waktu yang dibutuhkan**: 30-45 menit

#### Sub-langkah 2.1: [Proses Pertama]
Jelaskan dengan detail apa yang harus dilakukan...

#### Sub-langkah 2.2: [Proses Kedua]  
Lanjutkan dengan proses berikutnya...

#### Sub-langkah 2.3: [Proses Ketiga]
Selesaikan dengan langkah terakhir...

### Langkah 3: Finishing dan Quality Check

**Waktu yang dibutuhkan**: 10-15 menit

Pastikan hasil akhir memenuhi standar:
- [ ] Kriteria kualitas 1
- [ ] Kriteria kualitas 2
- [ ] Kriteria kualitas 3

## Tips dan Trik Pro

### Untuk Pemula
> **💡 Tip Pemula**: Mulai dengan [versi sederhana] dulu sebelum mencoba teknik advanced.

### Untuk Level Menengah
- **Trick 1**: [Jelaskan trik khusus]
- **Trick 2**: [Jelaskan trik lainnya]

### Kesalahan Umum yang Harus Dihindari

1. **Kesalahan #1**: [Jelaskan kesalahan] - *Solusi*: [cara mengatasinya]
2. **Kesalahan #2**: [Jelaskan kesalahan] - *Solusi*: [cara mengatasinya]

## Troubleshooting

### Masalah: [Masalah yang sering terjadi]
**Solusi**: [Cara mengatasi masalah]

### Masalah: [Masalah lain yang umum]
**Solusi**: [Cara mengatasi masalah]

## Kesimpulan

Dengan mengikuti panduan ini, Anda sekarang sudah bisa **[melakukan sesuatu]** dengan percaya diri. Ingat, **praktek membuat sempurna** - jangan ragu untuk mencoba berulang kali.

### Key Takeaways:
- **Persiapan** adalah kunci sukses
- **Kesabaran** dalam setiap langkah penting
- **Praktek rutin** akan meningkatkan kemampuan

**Selanjutnya**: Coba eksplorasi [topik lanjutan] untuk meningkatkan skill Anda.

---

*Apakah artikel ini membantu? Bagikan pengalaman Anda di kolom komentar dan jangan lupa subscribe untuk tips lainnya!*`;
        onChange(template);
      }
    },
    {
      label: 'Template Review SEO',
      action: () => {
        const template = `# Review [Nama Produk]: Apakah Worth It untuk Dibeli di 2024?

*Meta description: Review lengkap [Nama Produk] dengan testing mendalam. Cek kelebihan, kekurangan, harga, dan apakah recommended untuk Anda.*

## Rating Overview: ⭐⭐⭐⭐⭐ (4.5/5)

**Verdict**: [Produk ini sangat direkomendasikan untuk...] 

| Aspek | Rating | Keterangan |
|-------|--------|------------|
| **Kualitas** | ⭐⭐⭐⭐⭐ | Excellent build quality |
| **Value for Money** | ⭐⭐⭐⭐ | Worth the price |
| **Ease of Use** | ⭐⭐⭐⭐⭐ | Very user-friendly |
| **Customer Support** | ⭐⭐⭐⭐ | Responsive support |

## Ringkasan Singkat

[Nama Produk] adalah **[kategori produk]** yang dirancang untuk **[target pengguna]**. Setelah menggunakan selama **[periode testing]**, berikut review jujur kami.

### Cocok untuk:
- ✅ [Target user 1]
- ✅ [Target user 2] 
- ✅ [Target user 3]

### Tidak cocok untuk:
- ❌ [Kondisi tertentu]
- ❌ [Limitasi produk]

## Spesifikasi dan Features

### Spesifikasi Utama
- **[Spec 1]**: [Detail spesifikasi]
- **[Spec 2]**: [Detail spesifikasi]
- **[Spec 3]**: [Detail spesifikasi]

### Features Unggulan
1. **[Feature 1]**: [Penjelasan mengapa ini penting]
2. **[Feature 2]**: [Penjelasan manfaat untuk user]
3. **[Feature 3]**: [Keunggulan dibanding kompetitor]

## Testing dan User Experience

### Unboxing Experience
**First impression** sangat positif. Packaging rapi dan **[detail yang menarik]**.

### Setup Process
⏱️ **Waktu setup**: [durasi]
📖 **Complexity**: [level kesulitan - mudah/sedang/sulit]

### Daily Usage Experience

#### Minggu 1-2: [Fase Learning]
- [Pengalaman awal]
- [Hal yang mudah dipelajari]
- [Challenges yang dihadapi]

#### Minggu 3-4: [Fase Comfortable]
- [Peningkatan produktivitas]
- [Features yang paling berguna]
- [Workflow yang terbentuk]

## Perbandingan dengan Kompetitor

### vs [Kompetitor 1]
| Aspek | [Produk Review] | [Kompetitor 1] | Winner |
|-------|-----------------|----------------|---------|
| **Harga** | [harga] | [harga] | [winner] |
| **Performance** | [score] | [score] | [winner] |
| **Features** | [score] | [score] | [winner] |

### vs [Kompetitor 2]
**Kelebihan dibanding [Kompetitor 2]**:
- [Kelebihan 1]
- [Kelebihan 2]

**Kekurangan dibanding [Kompetitor 2]**:
- [Kekurangan 1]
- [Kekurangan 2]

## Kelebihan (Pros)

### 🔥 Outstanding Features
1. **[Kelebihan utama]**: [Penjelasan detail mengapa ini excellent]
2. **[Kelebihan kedua]**: [Impact positif untuk user]

### 👍 Good Points
- [Kelebihan lainnya]
- [Aspek yang memuaskan]
- [Value yang didapat]

## Kekurangan (Cons)

### ⚠️ Major Issues
1. **[Kekurangan utama]**: [Penjelasan kenapa ini masalah]
2. **[Kekurangan kedua]**: [Impact negatif yang mungkin terjadi]

### 👎 Minor Issues
- [Kekurangan kecil]
- [Hal yang bisa diperbaiki]

## Analisis Harga dan Value

### Pricing Breakdown
- **Harga resmi**: Rp [harga]
- **Harga marketplace**: Rp [harga range]
- **Best deal**: [dimana beli termurah]

### Value for Money Analysis
**Apakah worth it?** [Ya/Tidak] - karena:
- [Alasan 1]
- [Alasan 2]  
- [Alasan 3]

### Alternatif Budget
Jika budget terbatas, pertimbangkan:
1. **[Alternatif 1]** (Rp [harga]) - [kelebihan singkat]
2. **[Alternatif 2]** (Rp [harga]) - [kelebihan singkat]

## Siapa yang Harus Beli?

### 🎯 Perfect Fit
**Sangat direkomendasikan** jika Anda:
- [Kondisi ideal 1]
- [Kondisi ideal 2]
- [Kondisi ideal 3]

### 🤔 Consider Alternatives
**Pertimbangkan produk lain** jika:
- [Kondisi tidak cocok 1]
- [Kondisi tidak cocok 2]

## Final Verdict

### Bottom Line
[Nama Produk] adalah **[kategori] yang solid** dengan **[kelebihan utama]**. Meski ada beberapa **[kekurangan minor]**, overall ini **[recommended/tidak recommended]** untuk **[target user]**.

### Rating Breakdown
- **Build Quality**: ⭐⭐⭐⭐⭐
- **Performance**: ⭐⭐⭐⭐⭐  
- **Value**: ⭐⭐⭐⭐
- **Overall**: ⭐⭐⭐⭐⭐ (4.5/5)

**Would I buy it again?** [Ya/Tidak] - [Alasan singkat]

---

*Review ini dibuat setelah testing mendalam selama [periode]. Kami tidak disponsori brand manapun dan memberikan pendapat jujur berdasarkan pengalaman real.*

**Update**: *Artikel ini terakhir diupdate [tanggal] dengan informasi harga terbaru.*`;
        onChange(template);
      }
    },
    {
      label: 'Template Tips SEO',
      action: () => {
        const template = `# [Jumlah] Tips [Topik] yang Terbukti Efektif di 2024

*Meta description: [Jumlah] tips [topik] yang sudah terbukti efektif dan mudah diterapkan. Panduan praktis dengan hasil nyata untuk [target audience].*

## Mengapa [Topik] Penting?

Dalam era **[konteks waktu/situasi]**, **[topik]** menjadi semakin penting karena:

- 📊 **Statistik**: [data/angka yang mendukung]
- 🎯 **Impact**: [dampak positif yang bisa didapat]  
- ⏰ **Trend**: [kenapa topik ini trending sekarang]

> **Fun Fact**: [Fakta menarik yang relate dengan topik]

## Siapa yang Membutuhkan Tips Ini?

### 🎯 Target Utama
- **[Kategori orang 1]**: [kenapa mereka butuh tips ini]
- **[Kategori orang 2]**: [benefit spesifik untuk mereka]
- **[Kategori orang 3]**: [masalah yang bisa diselesaikan]

### ⚡ Quick Benefits
Setelah menerapkan tips ini, Anda akan:
- [Benefit 1 yang bisa dirasakan segera]
- [Benefit 2 yang berdampak jangka panjang]
- [Benefit 3 yang menghemat waktu/uang]

---

## Tip #1: [Judul Tip yang Menarik dan Spesifik]

### Mengapa Tip Ini Powerful?
**[Penjelasan singkat kenapa tip ini efektif]** - berdasarkan **[penelitian/pengalaman/data]**.

### Cara Menerapkan:

#### Step-by-step Implementation
1. **Langkah 1**: [Detail actionable step]
   - *Pro tip*: [Insight tambahan]
   
2. **Langkah 2**: [Detail actionable step]
   - *Common mistake*: [Kesalahan yang harus dihindari]
   
3. **Langkah 3**: [Detail actionable step]

### Real Example
> **Case Study**: [Contoh nyata penerapan] menghasilkan **[hasil spesifik]** dalam waktu **[timeframe]**.

### Tools/Resources Recommended
- **[Tool 1]**: [Fungsi dan link jika perlu]
- **[Tool 2]**: [Free alternative]

---

## Tip #2: [Judul Tip Kedua yang Actionable]

### The Science Behind It
Research menunjukkan bahwa **[backing research/data]**, yang membuktikan efektivitas **[aspek tip]**.

### Implementation Guide

#### For Beginners:
- [Cara sederhana untuk pemula]
- [Expectation yang realistis]

#### For Advanced Users:
- [Teknik lanjutan]
- [Optimization yang bisa dilakukan]

### Measuring Success
Track progress dengan:
- **Metric 1**: [Cara mengukur]
- **Metric 2**: [Indikator keberhasilan]
- **Timeline**: [Kapan bisa lihat hasil]

---

## Tip #3: [Judul Tip Ketiga]

### Why Most People Get This Wrong
**[Kesalahan umum]** adalah mindset yang salah tentang **[aspek tertentu]**. Faktanya:

- ❌ **Myth**: [Mitos yang beredar]
- ✅ **Reality**: [Kenyataan yang sebenarnya]

### The Right Approach

#### Quick Win Strategy (5-10 menit)
[Cara cepat yang bisa langsung diterapkan]

#### Long-term Strategy (1-4 minggu)  
[Pendekatan jangka panjang untuk hasil maksimal]

### Troubleshooting Common Issues

**Problem**: [Masalah yang sering terjadi]
**Solution**: [Cara mengatasinya]

**Problem**: [Masalah lain]
**Solution**: [Solusi praktis]

---

## Tip #4: [Tip Keempat - Advanced Level]

### When to Use This Tip
Tip ini **paling efektif** ketika:
- [Kondisi 1]
- [Kondisi 2]
- [Kondisi 3]

### Advanced Implementation

#### The Framework
1. **Phase 1** (Minggu 1-2): [Focus area pertama]
2. **Phase 2** (Minggu 3-4): [Pengembangan]
3. **Phase 3** (Bulan 2+): [Optimization]

#### Success Indicators
- [KPI 1]: [Target yang realistis]
- [KPI 2]: [Milestone yang bisa diukur]

---

## Bonus Tips untuk Maximum Results

### 🔥 Pro Secrets
1. **Secret #1**: [Tip exclusive yang jarang diketahui]
2. **Secret #2**: [Insight dari pengalaman expert]

### ⚠️ Common Pitfalls to Avoid
- **Pitfall 1**: [Jebakan yang harus dihindari] 
- **Pitfall 2**: [Kesalahan mahal yang sering terjadi]

## Action Plan: Implementasi dalam 30 Hari

### Week 1: Foundation
- [ ] [Task spesifik]
- [ ] [Task spesifik]
- [ ] [Task spesifik]

### Week 2: Building Momentum  
- [ ] [Task spesifik]
- [ ] [Task spesifik]

### Week 3-4: Optimization
- [ ] [Task spesifik]
- [ ] [Task spesifik]

## Tools dan Resources

### Free Tools
1. **[Tool Name]**: [Fungsi utama] - [Link]
2. **[Tool Name]**: [Kegunaan] - [Link]

### Paid Tools (Worth the Investment)
1. **[Premium Tool]**: [ROI yang bisa didapat] - [Harga]

### Further Reading
- [Resource 1]: [Deskripsi singkat]
- [Resource 2]: [Value yang didapat]

## Kesimpulan dan Next Steps

### Key Takeaways
Dari **[jumlah] tips [topik]** di atas, yang paling **game-changing** adalah:

1. **[Tip paling penting]**: [Kenapa ini critical]
2. **[Tip kedua]**: [Impact jangka panjang]
3. **[Tip ketiga]**: [Quick win yang bisa langsung diterapkan]

### Your Next Action
**Start today** dengan **[tip termudah]** - hanya butuh **[waktu singkat]** tapi hasilnya **[benefit yang didapat]**.

### Remember This
> **"[Quote motivational yang relate dengan topik]"** - [Sumber quote]

**Progress > Perfection** - mulai dengan **1 tip** dan build momentum dari sana.

---

*Tips ini telah membantu **[jumlah] orang** mencapai **[hasil]**. Mana tip yang akan Anda coba pertama? Share di komentar!*

**Want more tips?** Subscribe newsletter kami untuk tips **[topik] eksklusif** setiap minggu.`;
        onChange(template);
      }
    },
    {
      label: 'Template Artikel SEO Umum',
      action: () => {
        const template = `# [Keyword Utama]: Panduan Lengkap [Tahun] untuk [Target Audience]

*Meta description: [Keyword utama] terlengkap untuk [target audience]. Pelajari [benefit utama] dengan panduan step-by-step yang mudah diikuti.*

## Daftar Isi
1. [Apa itu [Topik]?](#apa-itu-topik)
2. [Mengapa [Topik] Penting?](#mengapa-penting)
3. [Cara [Melakukan Sesuatu]](#cara-melakukan)
4. [Tips dan Trik](#tips-dan-trik)
5. [FAQ](#faq)
6. [Kesimpulan](#kesimpulan)

---

## Apa itu [Topik]? {#apa-itu-topik}

**[Topik]** adalah **[definisi simple dan jelas]** yang **[fungsi/manfaat utama]**.

### Karakteristik Utama:
- **[Ciri 1]**: [Penjelasan]
- **[Ciri 2]**: [Penjelasan] 
- **[Ciri 3]**: [Penjelasan]

### Jenis-jenis [Topik]:

#### [Jenis 1]
[Penjelasan singkat dan kapan digunakan]

#### [Jenis 2]  
[Penjelasan singkat dan kapan digunakan]

#### [Jenis 3]
[Penjelasan singkat dan kapan digunakan]

---

## Mengapa [Topik] Penting? {#mengapa-penting}

Dalam **[konteks/industri]**, **[topik]** menjadi semakin penting karena:

### 1. [Alasan Utama]
**[Data/statistik]** menunjukkan bahwa **[trend/fakta]**.

### 2. [Alasan Kedua]
**[Benefit spesifik]** yang bisa dirasakan:
- [Benefit 1]
- [Benefit 2]
- [Benefit 3]

### 3. [Alasan Ketiga]
> **Expert Opinion**: "[Quote dari expert]" - [Nama Expert, Title]

---

## Cara [Melakukan Sesuatu] {#cara-melakukan}

### Persiapan Awal

#### Yang Anda Butuhkan:
- **[Item 1]**: [Fungsi/alasan]
- **[Item 2]**: [Fungsi/alasan]
- **[Item 3]**: [Fungsi/alasan]

#### Estimasi Waktu:
- **Persiapan**: [waktu]
- **Eksekusi**: [waktu]  
- **Total**: [waktu keseluruhan]

### Langkah-langkah Detail

#### Step 1: [Judul Langkah]
**Tujuan**: [Apa yang ingin dicapai di step ini]

**Cara melakukan**:
1. [Sub-step detail]
2. [Sub-step detail]
3. [Sub-step detail]

**✅ Checkpoint**: [Cara memastikan step ini berhasil]

#### Step 2: [Judul Langkah]
**Tujuan**: [Apa yang ingin dicapai di step ini]

**Cara melakukan**:
1. [Sub-step detail]
2. [Sub-step detail]

**⚠️ Warning**: [Hal yang harus dihindari]

#### Step 3: [Judul Langkah]
**Tujuan**: [Apa yang ingin dicapai di step ini]

**Cara melakukan**:
- [Point penting]
- [Point penting]

**💡 Pro Tip**: [Insight tambahan untuk hasil optimal]

---

## Tips dan Trik {#tips-dan-trik}

### Untuk Pemula

#### Tip #1: [Judul Tip]
[Penjelasan dan cara implementasi]

#### Tip #2: [Judul Tip]  
[Penjelasan dan cara implementasi]

### Untuk Level Advanced

#### Advanced Technique #1
[Teknik lanjutan dengan penjelasan detail]

#### Advanced Technique #2
[Teknik lanjutan dengan penjelasan detail]

### Common Mistakes yang Harus Dihindari

1. **Mistake #1**: [Kesalahan umum]
   - **Why it's bad**: [Dampak negatif]
   - **How to avoid**: [Cara menghindari]

2. **Mistake #2**: [Kesalahan umum]
   - **Why it's bad**: [Dampak negatif]
   - **How to avoid**: [Cara menghindari]

---

## FAQ (Frequently Asked Questions) {#faq}

### 1. [Pertanyaan yang sering ditanyakan]?
**Jawab**: [Jawaban lengkap dan helpful]

### 2. [Pertanyaan tentang implementasi]?
**Jawab**: [Jawaban praktis dengan contoh]

### 3. [Pertanyaan tentang troubleshooting]?
**Jawab**: [Solusi step-by-step]

### 4. [Pertanyaan tentang cost/time]?
**Jawab**: [Estimasi realistis dengan breakdown]

### 5. [Pertanyaan perbandingan]?
**Jawab**: [Perbandingan objektif dengan pro/cons]

---

## Tools dan Resources Recommended

### Free Tools
- **[Tool 1]**: [Fungsi] - [Link]
- **[Tool 2]**: [Fungsi] - [Link]

### Paid Tools  
- **[Premium Tool]**: [ROI/benefit] - [Price range]

### Learning Resources
- **[Course/Book]**: [Value proposition]
- **[Website/Blog]**: [Jenis content yang bisa didapat]

---

## Kesimpulan {#kesimpulan}

**[Topik]** adalah **[recap value proposition]** yang bisa memberikan **[benefit utama]** jika diterapkan dengan benar.

### Key Points to Remember:
1. **[Point paling penting]**: [Kenapa critical]
2. **[Point kedua]**: [Value yang didapat]  
3. **[Point ketiga]**: [Action yang harus diambil]

### Next Steps:
1. **Immediate action**: [Apa yang bisa dilakukan hari ini]
2. **This week**: [Target minggu ini]
3. **This month**: [Goal jangka menengah]

### Final Thoughts
> **Remember**: [Motivational closing statement]

**Start small, think big** - mulai dengan **[langkah termudah]** dan build momentum dari sana.

---

*Artikel ini telah membantu **[jumlah] readers** memahami **[topik]** dengan lebih baik. Bagikan pengalaman Anda di komentar!*

**Related Articles**:
- [Artikel terkait 1]
- [Artikel terkait 2]
- [Artikel terkait 3]`;
        onChange(template);
      }
    }
  ];

  const handleChange = (val?: string) => {
    onChange(val || '');
  };

  if (!mounted) {
    return (
      <div className={`space-y-3 ${className}`}>
        <label className="block text-sm font-medium text-gray-700">
          Konten Artikel
        </label>
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <p className="text-gray-500">Memuat editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Konten Artikel
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            {showPreview ? 'Edit' : 'Preview'}
          </button>
          <button
            type="button"
            onClick={triggerImageUpload}
            disabled={uploading}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-[#1ca4bc] text-white rounded-md hover:bg-[#159bb3] transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Uploading...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Upload Gambar
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Insert Buttons */}
      <div className="bg-gray-50 p-3 rounded-lg">
        <h4 className="text-xs font-medium text-gray-700 mb-2">Quick Insert - Klik untuk langsung menambahkan format:</h4>
        <div className="flex flex-wrap gap-1">
          {quickInsertButtons.map((button, index) => (
            <button
              key={index}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                button.action();
              }}
              className="px-2 py-1 text-xs bg-white border border-gray-200 rounded hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              title={`${button.label}: ${button.description}`}
            >
              <span className="font-medium">{button.icon}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 <strong>Quick Insert</strong> adalah tombol cepat untuk menambahkan format markdown tanpa perlu mengetik manual. 
          Klik tombol, lalu edit teksnya sesuai kebutuhan.
        </p>
      </div>

      {/* Template Buttons */}
      <div className="bg-blue-50 p-3 rounded-lg">
        <h4 className="text-xs font-medium text-gray-700 mb-2">Template Artikel:</h4>
        <div className="flex flex-wrap gap-2">
          {templateButtons.map((template, index) => (
            <button
              key={index}
              type="button"
              onClick={template.action}
              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            >
              {template.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <MDEditor
          value={value}
          onChange={handleChange}
          preview={showPreview ? 'preview' : 'edit'}
          hideToolbar={false}
          data-color-mode="light"
          height={500}
          textareaProps={{
            placeholder: placeholder,
            style: {
              fontSize: 14,
              lineHeight: 1.6,
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            },
          }}
        />
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {/* Enhanced Tips */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
        <h4 className="text-sm font-semibold text-gray-800 mb-2">💡 Tips Menulis Artikel yang Menarik:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-600">
          <div>
            <h5 className="font-medium text-gray-700 mb-1">Format Markdown:</h5>
            <ul className="space-y-1">
              <li><code>**tebal**</code> → <strong>tebal</strong></li>
              <li><code>*miring*</code> → <em>miring</em></li>
              <li><code># Judul Besar</code> → Heading 1</li>
              <li><code>## Sub Judul</code> → Heading 2</li>
              <li><code>- Item</code> → Bullet point</li>
              <li><code>1. Item</code> → Numbered list</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-700 mb-1">Fitur Lanjutan:</h5>
            <ul className="space-y-1">
              <li><code>` + kode + `</code> → <code>kode</code></li>
              <li><code>&gt; Quote</code> → Kutipan</li>
              <li><code>[link](url)</code> → Link</li>
              <li><code>---</code> → Garis pemisah</li>
              <li><code>![alt](url)</code> → Gambar</li>
              <li>Gunakan tombol &quot;Upload Gambar&quot; untuk gambar</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}