# Jobverse - Product Requirements Document (PRD)

## 📋 Proje Özeti

### Vizyon
Jobverse, öğrenciler ve iş arayanlar için JSearch API tabanlı, yapay zeka destekli akıllı iş arama platformudur. Kullanıcılar iş ilanlarını keşfedebilir, AI chatbot ile kariyer danışmanlığı alabilir ve veri analiziyle piyasa trendlerini takip edebilir.

### Zaman Çizelgesi
**2 Hafta** - Öğrenci projesi

### Ekip Yapısı
- **Frontend Developer**: React UI/UX geliştirme
- **Backend Developer**: Python FastAPI API geliştirme
- **Data Analyst**: Veri analizi ve ML model geliştirme

### Teknoloji Stack

#### Frontend
- **Framework**: React 18 + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **State**: Zustand (Redux'tan daha basit)
- **Routing**: React Router v6
- **API**: Axios
- **Charts**: Recharts
- **Auth**: Firebase SDK

#### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL (Supabase - ücretsiz hosted)
- **ORM**: SQLAlchemy
- **Auth**: Firebase Admin SDK
- **APIs**: JSearch (RapidAPI), Gemini API
- **Deployment**: Render/Railway (ücretsiz tier)

#### Data Analysis
- **Core**: Python, Pandas, NumPy
- **Visualization**: Plotly, Matplotlib
- **ML**: Scikit-learn (basit modeller)
- **NLP**: Basic text processing (keywords extraction)
- **Notebooks**: Jupyter

#### DevOps
- **Version Control**: Git + GitHub
- **Deployment**: Vercel (Frontend), Render (Backend)
- **Database**: Supabase (PostgreSQL + Auth support)

---

## 🎯 Özellikler (Features)

### ✅ Core Features (MVP - Must Have)
1. **İş Arama ve Filtreleme** - JSearch API ile gerçek zamanlı arama
2. **Kullanıcı Girişi** - Firebase Authentication (Email + Google)
3. **İlan Kaydetme** - Favorilere ekleme ve başvuru takibi
4. **AI Chatbot** - Gemini API ile kariyer danışmanlığı
5. **Analiz Dashboard** - Piyasa trendleri ve istatistikler

### 🔷 Nice to Have (Opsiyonel - zamanımız varsa)
6. **Email Bildirimleri** - Yeni ilanlar için uyarılar
7. **CV Öneri Asistanı** - Gemini ile CV ve cover letter tavsiyeleri
8. **Maaş Karşılaştırma** - Pozisyonlar arası maaş analizi
9. **Şirket Profilleri** - Şirket hakkında bilgi toplama

---

## 📅 2 Haftalık İş Planı

### **Hafta 1: Temel Altyapı + Auth + Arama**

#### Gün 1-2: Proje Kurulumu
**Backend Developer** - YAPILACAK 🔴
- [ ] FastAPI proje yapısı oluştur
- [ ] Supabase PostgreSQL bağlantısı kur
- [ ] JSearch API wrapper servisi yaz (test et)
- [ ] Temel endpoint'ler: health check, test veri çekme
- [ ] CORS ayarları
- [ ] Environment variables setup

**Frontend Developer** - YAPILACAK 🔴
- [ ] React + Vite projesi oluştur
- [ ] Tailwind CSS + shadcn/ui kur
- [ ] React Router yapılandır
- [ ] Temel layout: Navbar, Footer
- [ ] Ana sayfa (landing page) tasarım
- [ ] Dark/Light tema toggle

**Data Analyst** - YAPILACAK 🔴
- [ ] jobs.json dosyasını analiz et
- [ ] Jupyter notebook kur
- [ ] Exploratory Data Analysis (EDA) yap
- [ ] Veri yapısını anla (hangi fieldler var, eksik veriler, dağılımlar)
- [ ] İlk görselleştirmeler: lokasyon, iş türü, maaş dağılımları

---

#### Gün 3-4: Authentication
**Backend Developer** - YAPILACAK 🔴
- [ ] Firebase Admin SDK entegrasyonu
- [ ] Token validation middleware yaz
- [ ] User model ve schema oluştur (PostgreSQL)
- [ ] Auth endpoints: `/auth/verify`, `/users/me`, `/users/profile`
- [ ] Database migration (Alembic)

**Frontend Developer** - YAPILACAK 🔴
- [ ] Firebase SDK setup
- [ ] Login sayfası (Email + Google Sign-In)
- [ ] Register sayfası
- [ ] Auth Context oluştur (kullanıcı state yönetimi)
- [ ] Protected routes (PrivateRoute component)
- [ ] Profile sayfası (temel)

**Data Analyst** - YAPILACAK 🔴
- [ ] Veri temizleme pipeline yaz (eksik/hatalı veri kontrolü)
- [ ] Feature extraction: beceriler, lokasyon, şirket isimleri
- [ ] Keyword extraction (job descriptions'dan en sık kullanılan kelimeler)
- [ ] İlk analiz raporu hazırla (Markdown veya PDF)

---

#### Gün 5-7: İş Arama ve Listeleme
**Backend Developer** - YAPILACAK 🔴
- [ ] JSearch API entegrasyonu tamamla
- [ ] `/jobs/search` endpoint (query, location, filters)
- [ ] `/jobs/{job_id}` endpoint (detay)
- [ ] `/jobs/save` endpoint (kullanıcı ilanı kaydetme)
- [ ] `/jobs/saved` endpoint (kaydedilen ilanları getir)
- [ ] Pagination implementasyonu
- [ ] Basic caching (optional - in-memory cache)

**Frontend Developer** - YAPILACAK 🔴
- [ ] Search sayfası UI
- [ ] Search bar + filters komponenti (lokasyon, job type, tarih)
- [ ] JobCard komponenti (ilan kartı)
- [ ] JobList komponenti (grid/list görünümü)
- [ ] Pagination komponenti
- [ ] Loading states ve skeleton screens
- [ ] Job detail sayfası
- [ ] "Save Job" butonu ve UI

**Data Analyst** - YAPILACAK 🔴
- [ ] Lokasyon analizi (hangi şehirlerde en çok ilan var)
- [ ] Şirket analizi (en çok ilan veren şirketler)
- [ ] Remote vs On-site vs Hybrid dağılımı
- [ ] Trend analizi (zaman serisi - hangi dönemlerde daha çok ilan var)
- [ ] İlk dashboard için veri hazırla (JSON/CSV export)

---

### **Hafta 2: AI + Analiz + Polish**

#### Gün 8-9: Gemini Chatbot
**Backend Developer** - YAPILACAK 🔴
- [ ] Gemini API setup
- [ ] `/chat/message` endpoint oluştur
- [ ] Context-aware prompts yaz (sistem promptları)
- [ ] Conversation history (basit - sadece son 10 mesaj)
- [ ] Chat özellikleri:
  - İlan özetleme
  - Kariyer tavsiyesi
  - CV ve cover letter önerileri
  - Maaş müzakere tavsiyeleri

**Frontend Developer** - YAPILACAK 🔴
- [ ] Chat sayfası oluştur
- [ ] Chat window komponenti
- [ ] Message bubble (user/bot ayrımı)
- [ ] Typing indicator
- [ ] Markdown rendering (kod blokları için)
- [ ] "Quick questions" butonları (örnek sorular)
- [ ] Chat history (local storage veya state)

**Data Analyst** - YAPILACAK 🔴
- [ ] Basit recommendation sistemi (Content-Based Filtering)
- [ ] Skill matching algoritması (keyword bazlı)
- [ ] Maaş tahmini modeli (Linear Regression - basit)
- [ ] Model'leri pickle/joblib ile kaydet
- [ ] API endpoint için output format hazırla

---

#### Gün 10-11: Analytics Dashboard + ML Integration
**Backend Developer** - YAPILACAK 🔴
- [ ] ML model entegrasyonu (Data Analyst'ten modelleri al)
- [ ] `/analytics/trends` endpoint (genel piyasa trendleri)
- [ ] `/analytics/insights` endpoint (kullanıcıya özel)
- [ ] `/ml/recommend` endpoint (öneri sistemi)
- [ ] `/ml/salary-estimate` endpoint (maaş tahmini)
- [ ] Application tracking endpoints:
  - POST `/applications` (başvuru kaydet)
  - GET `/applications` (başvurularım)
  - PATCH `/applications/{id}` (status güncelle)

**Frontend Developer** - YAPILACAK 🔴
- [ ] Analytics sayfası oluştur
- [ ] Dashboard widgets:
  - Total jobs by location (harita veya bar chart)
  - Top companies (pie chart)
  - Remote job percentage
  - Salary insights (box plot)
- [ ] Recharts ile interaktif grafikler
- [ ] Saved Jobs sayfası (liste görünümü)
- [ ] Application Tracker sayfası (Kanban board style)
  - Columns: Saved → Applied → Interview → Offer → Rejected
- [ ] Job comparison tool (2-3 ilanı karşılaştır)

**Data Analyst** - YAPILACAK 🔴
- [ ] Model performance değerlendirme
- [ ] Dashboard için final data export (JSON formatında)
- [ ] Analiz dokümantasyonu hazırla (hangi modeller kullanıldı, accuracy, vb.)
- [ ] Gemini chatbot için data insights hazırla (piyasa özeti)
- [ ] Final rapor (Jupyter notebook + visualizations)

---

#### Gün 12-14: Testing + Deployment + Polish
**Backend Developer** - YAPILACAK 🔴
- [ ] API test (Postman/Thunder Client)
- [ ] Error handling iyileştirmeleri
- [ ] API dokümantasyonu (Swagger/ReDoc otomatik)
- [ ] Environment variables production setup
- [ ] Render/Railway deployment
- [ ] Database migration (production)
- [ ] CORS production ayarları

**Frontend Developer** - YAPILACAK 🔴
- [ ] Responsive design kontrolü (mobile, tablet)
- [ ] Loading states ve error handling iyileştirme
- [ ] Empty states (veri yoksa gösterilecek)
- [ ] Accessibility kontrolleri (keyboard navigation, aria labels)
- [ ] Performance optimization (lazy loading, code splitting)
- [ ] SEO temel ayarlar (meta tags, title)
- [ ] Vercel deployment
- [ ] Environment variables production setup

**Data Analyst** - YAPILACAK 🔴
- [ ] Model versiyonlama ve kaydetme
- [ ] Data pipeline dokümantasyonu
- [ ] README.md dosyası (analiz adımları)
- [ ] Backend'e model deployment desteği
- [ ] Final presentation hazırlıkları (slides)
- [ ] Demo için örnek senaryolar hazırla

---

### **Final: Entegrasyon ve Test (Tüm Ekip)**
**Gün 14** - YAPILACAK 🔴
- [ ] Frontend + Backend + ML entegrasyonunu test et
- [ ] End-to-end user flow test:
  1. Kayıt ol → Giriş yap
  2. İş ara → Filtreleme yap
  3. İlanı kaydet
  4. Chatbot ile konuş
  5. Analytics sayfasını incele
  6. Başvuru takibi yap
- [ ] Bug fixes
- [ ] Demo videosi/sunumu hazırla
- [ ] README.md güncelle (proje tanıtımı, kurulum, kullanım)

---

## 📂 Proje Klasör Yapısı

```
Jobverse/
├── frontend/                     # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/          # Button, Input, Card, Modal
│   │   │   ├── layout/          # Navbar, Footer, Sidebar
│   │   │   ├── jobs/            # JobCard, JobList, JobFilters, JobDetail
│   │   │   ├── chat/            # ChatWindow, MessageBubble
│   │   │   └── analytics/       # Charts, StatCards
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Search.tsx
│   │   │   ├── JobDetail.tsx
│   │   │   ├── SavedJobs.tsx
│   │   │   ├── Applications.tsx
│   │   │   ├── Analytics.tsx
│   │   │   ├── Chat.tsx
│   │   │   └── Profile.tsx
│   │   ├── hooks/
│   │   ├── services/
│   │   │   ├── api.ts           # Axios instance
│   │   │   ├── auth.ts          # Firebase auth
│   │   │   └── jobs.ts          # Job API calls
│   │   ├── store/               # Zustand store
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── backend/                      # FastAPI Backend
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── endpoints/
│   │   │       │   ├── auth.py
│   │   │       │   ├── jobs.py
│   │   │       │   ├── users.py
│   │   │       │   ├── chat.py
│   │   │       │   ├── analytics.py
│   │   │       │   └── applications.py
│   │   │       └── api.py
│   │   ├── core/
│   │   │   ├── config.py        # Settings
│   │   │   ├── security.py      # JWT, Firebase
│   │   │   └── database.py      # SQLAlchemy
│   │   ├── models/              # SQLAlchemy models
│   │   │   ├── user.py
│   │   │   ├── saved_job.py
│   │   │   └── application.py
│   │   ├── schemas/             # Pydantic schemas
│   │   ├── services/
│   │   │   ├── jsearch.py       # JSearch API wrapper
│   │   │   ├── gemini.py        # Gemini API wrapper
│   │   │   ├── firebase_auth.py # Firebase admin
│   │   │   └── ml_service.py    # ML model serving
│   │   ├── utils/
│   │   └── main.py
│   ├── alembic/                 # DB migrations
│   ├── tests/                   # Opsiyonel
│   ├── .env.example
│   ├── requirements.txt
│   └── README.md
│
├── data-analysis/               # Data Analysis & ML
│   ├── notebooks/
│   │   ├── 01_eda.ipynb                    # Exploratory Data Analysis
│   │   ├── 02_data_cleaning.ipynb          # Data cleaning
│   │   ├── 03_feature_extraction.ipynb     # Feature engineering
│   │   ├── 04_recommendation.ipynb         # Recommendation model
│   │   ├── 05_salary_prediction.ipynb      # Salary model
│   │   └── 06_final_report.ipynb           # Final summary
│   ├── src/
│   │   ├── data_loader.py       # API'den veri çekme
│   │   ├── preprocessing.py     # Veri temizleme
│   │   ├── feature_eng.py       # Feature extraction
│   │   ├── models/
│   │   │   ├── recommender.py   # Recommendation system
│   │   │   └── salary_model.py  # Salary prediction
│   │   └── visualizations.py    # Plot fonksiyonları
│   ├── data/
│   │   ├── raw/                 # jobs.json
│   │   ├── processed/           # Cleaned data
│   │   └── models/              # Saved models (pkl)
│   ├── outputs/                 # Charts, reports
│   ├── requirements.txt
│   └── README.md
│
├── .gitignore
├── README.md
├── prd.md                       # Bu dosya
└── jobs.json                    # JSearch API sample data
```

---

## 🗄️ Database Schema (PostgreSQL)

```sql
-- users tablosu
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_uid VARCHAR(128) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    photo_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- saved_jobs tablosu
CREATE TABLE saved_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    job_data JSONB NOT NULL,           -- JSearch API'den gelen tüm data
    notes TEXT,
    saved_at TIMESTAMP DEFAULT NOW()
);

-- applications tablosu (başvuru takibi)
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    job_id VARCHAR(255) NOT NULL,       -- JSearch job ID
    job_title VARCHAR(500),
    company_name VARCHAR(500),
    status VARCHAR(50) DEFAULT 'saved', -- saved, applied, interview, offer, rejected
    applied_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- search_history tablosu (opsiyonel - analytics için)
CREATE TABLE search_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    query TEXT,
    filters JSONB,
    searched_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/v1/auth/verify          # Firebase token doğrulama
GET    /api/v1/users/me             # Aktif kullanıcı bilgisi
PUT    /api/v1/users/profile        # Profil güncelleme
```

### Jobs
```
GET    /api/v1/jobs/search          # İş arama
       Query params: query, location, employment_type, remote_only, page
GET    /api/v1/jobs/{job_id}        # İlan detayı
POST   /api/v1/jobs/save            # İlanı kaydet
GET    /api/v1/jobs/saved           # Kaydedilen ilanlar
DELETE /api/v1/jobs/saved/{id}      # Kayıttan sil
```

### Applications
```
GET    /api/v1/applications         # Kullanıcının başvuruları
POST   /api/v1/applications         # Yeni başvuru kaydet
PATCH  /api/v1/applications/{id}    # Status güncelle
DELETE /api/v1/applications/{id}    # Başvuruyu sil
```

### Chat
```
POST   /api/v1/chat/message         # Gemini'ye mesaj gönder
       Body: { message, conversation_id (optional) }
```

### Analytics
```
GET    /api/v1/analytics/trends     # Genel piyasa trendleri
GET    /api/v1/analytics/insights   # Kullanıcıya özel insights
```

### ML (Machine Learning)
```
POST   /api/v1/ml/recommend         # İş önerileri
       Body: { user_profile, preferences }
POST   /api/v1/ml/salary-estimate   # Maaş tahmini
       Body: { job_title, location, skills }
```

---

## 🔑 Environment Variables

### Backend (.env)
```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/jobverse
# Supabase kullanıyorsanız Supabase connection string

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com

# External APIs
JSEARCH_API_KEY=your-rapidapi-key
JSEARCH_API_HOST=jsearch.p.rapidapi.com
GEMINI_API_KEY=your-gemini-api-key

# Security
SECRET_KEY=your-random-secret-key-here
ALGORITHM=HS256

# CORS
ALLOWED_ORIGINS=http://localhost:5173,https://your-frontend.vercel.app
```

### Frontend (.env)
```bash
VITE_API_BASE_URL=http://localhost:8000/api/v1
# Production: https://your-backend.render.com/api/v1

VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

---

## 🎨 UI/UX Tasarım Referansları

### Sayfalar ve Özellikleri

#### 1. Ana Sayfa (Landing Page)
- **Hero Section**: Arama barı (büyük, ortada)
- **Özellikler**: AI Chatbot, Analytics, Smart Recommendations
- **İstatistikler**: "1000+ iş ilanı", "50+ şirket"
- **CTA**: "Hemen Başla" butonu

#### 2. Search Sayfası
- **Layout**: Sol taraf filtreler, sağ taraf iş listesi
- **Filters**:
  - Keyword/Job Title
  - Location
  - Employment Type (Full-time, Part-time, Contract)
  - Remote Only (toggle)
  - Date Posted (Today, This Week, This Month)
- **JobCard** (her ilan için):
  - Logo (varsa)
  - Job Title
  - Company Name
  - Location + Remote badge
  - Salary (varsa)
  - Posted date
  - "Save" butonu (kalp ikonu)
- **Pagination**: Sayfa numaraları veya "Load More"

#### 3. Job Detail Sayfası
- **Header**: Title, Company, Location, Salary
- **Actions**: Save, Apply (dış link), Share
- **Sections**:
  - Job Description
  - Qualifications
  - Responsibilities
  - Benefits
- **Sidebar**:
  - Company info
  - Similar jobs
  - "Ask AI about this job" button (chat'e yönlendir)

#### 4. Saved Jobs Sayfası
- Grid veya list görünümü
- Filter by status (hepsi, saved, applied, vb.)
- Her ilanda "Delete" ve "Move to Applications" butonları

#### 5. Applications Sayfası (Kanban Board)
- Columns: Saved | Applied | Interview | Offer | Rejected
- Drag & drop (opsiyonel, zamanınız varsa)
- Her card: Job title, company, date, notes
- "Add notes" modal

#### 6. Analytics Dashboard
- **Widget 1**: Jobs by Location (Bar chart)
- **Widget 2**: Top Companies (Pie chart)
- **Widget 3**: Remote vs On-site (Donut chart)
- **Widget 4**: Salary Distribution (Box plot veya histogram)
- **Widget 5**: Trending Skills (Word cloud - opsiyonel)

#### 7. Chat Sayfası
- **Layout**: Full-height chat window
- **Mesajlar**: User (sağda), Bot (solda)
- **Input**: Alt kısımda text input + send button
- **Quick Actions**: Önceden tanımlı sorular (buttons)
  - "React developer için iş önerileri"
  - "CV'mi nasıl geliştiririm?"
  - "Bu ilanı özetle" (job detail sayfasından)
- **Features**:
  - Markdown rendering
  - Code block support
  - Typing indicator

#### 8. Profile Sayfası
- Display name, email, photo
- "Edit Profile" form
- Logout button
- Account statistics (kaç iş kaydetti, kaç başvuru yaptı)

---

## 🤖 AI Chatbot Yetenekleri (Gemini API)

### System Prompt (Backend'de)
```
Sen bir kariyer danışmanı AI asistanısın. Kullanıcılara iş arama, CV hazırlama, mülakat hazırlığı ve kariyer gelişimi konularında yardımcı oluyorsun.

Context: Kullanıcı bir iş arama platformu kullanıyor (Jobverse). JSearch API'sinden gelen iş ilanlarını görüyor.

Görevlerin:
1. İş ilanlarını özetlemek ve analiz etmek
2. Kariyer tavsiyeleri vermek
3. CV ve cover letter için öneriler sunmak
4. Mülakat hazırlığı yapmak
5. Maaş müzakeresi ipuçları vermek

Her zaman:
- Profesyonel ve destekleyici ol
- Spesifik ve actionable tavsiyeler ver
- Kısa ve öz cevaplar ver (uzun paragraflardan kaçın)
```

### Örnek Kullanım Senaryoları

**Senaryo 1: İlan Özetleme**
```
User: "Bu ilanı özetle" [job_id ile birlikte gönderilir]
Bot: 
"📋 İlan Özeti

Pozisyon: Senior React Developer
Şirket: TechCorp
Lokasyon: Remote

Ana Gereksinimler:
✓ 5+ yıl React deneyimi
✓ TypeScript bilgisi
✓ AWS deneyimi

Öne Çıkan Avantajlar:
💰 $120k-$150k
🏠 Tam remote
🏥 Sağlık sigortası

✨ Değerlendirmem: Bu pozisyon senior-level için güçlü teknik beceriler gerektiriyor. Remote çalışma imkanı ve iyi maaş aralığı avantaj."
```

**Senaryo 2: Kariyer Tavsiyesi**
```
User: "Frontend developer olarak kariyerime nasıl yön veririm?"
Bot: 
"🎯 Frontend Developer Kariyer Yol Haritası

1. Temel Teknolojileri Güçlendir
   • React/Vue/Angular'dan biri
   • TypeScript
   • State management (Redux, Zustand)

2. Yan Beceriler Edin
   • Backend basics (REST API, Node.js)
   • Testing (Jest, Cypress)
   • DevOps temel (Docker, CI/CD)

3. Uzmanlaşma Alanları
   • Performance Optimization
   • Accessibility (a11y)
   • Micro-frontends
   • Web3/Blockchain

4. Portfolyo ve Networking
   • GitHub'da open source
   • Teknik blog yazmak
   • LinkedIn'de aktif olmak

Hangi alana odaklanmak istersin?"
```

**Senaryo 3: CV Önerileri**
```
User: "CV'mde bu pozisyon için neyi vurgulamalıyım?"
Bot: 
"📝 CV Önerileri

Bu Senior React Developer pozisyonu için:

✅ Öncelikli Vurgular:
• React projeleriinizde kullandığınız state management (Redux/Context)
• TypeScript ile geliştirdiğiniz büyük ölçekli uygulamalar
• AWS deneyiminiz (S3, CloudFront, Lambda)
• Performance optimization örnekleri
• Testing coverage oranlarınız

💡 Ekstra Puanlar:
• Açık kaynak katkılarınız
• Teknik liderlik deneyimi
• CI/CD pipeline kurduğunuz projeler

📌 Format İpucu:
Her başarıyı metriklerle destekleyin:
❌ 'React ile uygulama geliştirdim'
✅ 'React ile 100K+ kullanıcılı e-ticaret platformu geliştirdim, sayfa yükleme süresini %40 azalttım'"
```

---

## 📊 Data Analysis Deliverables

### Analiz Çıktıları (Data Analyst tarafından üretilecek)

#### 1. EDA Raporu (Notebook)
- Veri seti özeti (kaç ilan, hangi dönem, eksik veriler)
- Dağılım analizleri
- Korelasyon matrisleri
- Görselleştirmeler

#### 2. Dashboard Data (JSON/CSV)
**Dosya**: `dashboard_data.json`
```json
{
  "jobs_by_location": [
    {"location": "San Francisco, CA", "count": 450},
    {"location": "New York, NY", "count": 380},
    ...
  ],
  "top_companies": [
    {"company": "Google", "count": 45},
    {"company": "Amazon", "count": 38},
    ...
  ],
  "remote_distribution": {
    "remote": 320,
    "onsite": 150,
    "hybrid": 230
  },
  "salary_stats": {
    "min": 60000,
    "max": 250000,
    "median": 120000,
    "quartiles": [90000, 120000, 150000]
  },
  "trending_skills": [
    {"skill": "React", "count": 280},
    {"skill": "Python", "count": 260},
    ...
  ]
}
```

#### 3. ML Models

**a) Recommendation System (recommender.pkl)**
- **Algoritma**: Content-Based Filtering (TF-IDF + Cosine Similarity)
- **Input**: User'ın saved/applied jobs
- **Output**: Benzer işler (similarity score ile)
- **Performance**: Basit ama etkili (demo için yeterli)

**b) Salary Prediction Model (salary_model.pkl)**
- **Algoritma**: Linear Regression veya Random Forest (basit)
- **Features**: job_title, location, employment_type, skills_count
- **Output**: Tahmini maaş aralığı (min, max)
- **Performance**: MAE (Mean Absolute Error) hesapla

#### 4. API Integration Format
**Dosya**: `model_api.py`
```python
import joblib
import pandas as pd

# Model yükleme
recommender = joblib.load('models/recommender.pkl')
salary_model = joblib.load('models/salary_model.pkl')

def get_recommendations(user_jobs, all_jobs, top_n=10):
    """
    user_jobs: Kullanıcının saved/applied jobs (list of dicts)
    all_jobs: Tüm iş ilanları
    """
    # Similarity hesapla, top N döndür
    pass

def predict_salary(job_title, location, skills):
    """
    Input: Job özellikleri
    Output: {'min_salary': 90000, 'max_salary': 120000, 'confidence': 0.75}
    """
    pass
```

---

## 🚀 Deployment Planı

### Backend Deployment (Render/Railway)
1. GitHub repository'yi Render/Railway'e bağla
2. Environment variables ayarla (.env dosyasındaki tüm değişkenler)
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. PostgreSQL database ekle (Supabase veya Render'ın kendi PostgreSQL'i)
6. Auto-deploy aktif et (main branch'e push'ta otomatik deploy)

### Frontend Deployment (Vercel)
1. GitHub repository'yi Vercel'e bağla
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`
5. Environment variables ekle (VITE_ prefix'li olanlar)
6. Auto-deploy aktif (main branch'e push'ta)

### Database (Supabase)
1. Supabase.com'da proje oluştur (ücretsiz)
2. SQL Editor'de schema'yı oluştur (users, saved_jobs, applications tables)
3. Connection string'i kopyala
4. Backend'e environment variable olarak ekle

---

## ✅ Görev Checklist (Özet)

### 🔴 YAPILACAK - Hafta 1

#### Backend
- [ ] Proje kurulumu (FastAPI + Supabase)
- [ ] Firebase Admin SDK
- [ ] JSearch API wrapper
- [ ] Auth endpoints
- [ ] Jobs endpoints (search, detail, save)
- [ ] Database models ve migrations

#### Frontend
- [ ] React + Vite + Tailwind kurulumu
- [ ] Routing ve layout
- [ ] Firebase auth (login, register)
- [ ] Search sayfası + JobCard
- [ ] Job detail sayfası
- [ ] Saved jobs

#### Data Analysis
- [ ] EDA (Exploratory Data Analysis)
- [ ] Veri temizleme
- [ ] Feature extraction
- [ ] Keyword analysis
- [ ] İlk görselleştirmeler

---

### 🔴 YAPILACAK - Hafta 2

#### Backend
- [ ] Gemini API entegrasyonu
- [ ] Chat endpoint
- [ ] ML model servisi (recommender + salary)
- [ ] Analytics endpoints
- [ ] Applications CRUD
- [ ] Deployment (Render/Railway)

#### Frontend
- [ ] Chat UI
- [ ] Analytics dashboard (Recharts)
- [ ] Applications tracker (Kanban)
- [ ] Responsive design
- [ ] Error handling ve loading states
- [ ] Deployment (Vercel)

#### Data Analysis
- [ ] Recommendation model
- [ ] Dashboard data export
- [ ] Model deployment support
- [ ] Final rapor ve dokümantasyon

---

## 🎓 Öğrenme Kaynakları

### Frontend
- [React Docs](https://react.dev) - Official React documentation
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com) - Component library
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [Recharts](https://recharts.org) - Chart library

### Backend
- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/) - Step-by-step guide
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/en/20/orm/) - Database ORM
- [Firebase Admin Python](https://firebase.google.com/docs/admin/setup) - Auth integration
- [Supabase Docs](https://supabase.com/docs) - PostgreSQL hosting

### Data Analysis
- [Pandas Basics](https://pandas.pydata.org/docs/user_guide/10min.html) - 10 min to pandas
- [Scikit-learn Tutorial](https://scikit-learn.org/stable/tutorial/index.html) - ML basics
- [Content-Based Filtering](https://www.youtube.com/watch?v=8OAK6elFXag) - Recommendation systems

### APIs
- [JSearch API Docs](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch) - RapidAPI
- [Gemini API Quickstart](https://ai.google.dev/gemini-api/docs/quickstart) - Google AI

---

## 🔐 Güvenlik Kontrol Listesi

- [ ] Firebase token validation (her protected endpoint'te)
- [ ] SQL injection prevention (SQLAlchemy ORM kullan, raw queries yazmayın)
- [ ] XSS koruması (React otomatik escape eder)
- [ ] CORS ayarları (sadece frontend URL'ine izin ver)
- [ ] Environment variables (hiçbir secret commit edilmemeli)
- [ ] HTTPS (production'da mutlaka)
- [ ] Rate limiting (opsiyonel - DDoS koruması)
- [ ] Input validation (Pydantic schemas)
- [ ] API key'leri .env'de saklama

---

## 📈 Success Metrics (Başarı Kriterleri)

### Teknik
- ✅ Kullanıcı kayıt ve giriş yapabiliyor
- ✅ İş arama çalışıyor (JSearch API'den veri geliyor)
- ✅ İlan kaydetme ve listeleme fonksiyonel
- ✅ Chatbot yanıt veriyor (Gemini API)
- ✅ Analytics sayfası grafikler gösteriyor
- ✅ Responsive tasarım (mobile uyumlu)
- ✅ Production'da deploy edilmiş

### Kullanıcı Deneyimi
- ✅ Sayfa yükleme hızlı (<3 saniye)
- ✅ Loading states var (kullanıcı beklerken ne olduğunu biliyor)
- ✅ Error handling (hata mesajları anlaşılır)
- ✅ Kolay navigasyon
- ✅ Dark/Light mode

### Ekip İşbirliği
- ✅ Frontend ve Backend entegrasyonu sorunsuz
- ✅ Data Analysis modelleri Backend'e entegre edilmiş
- ✅ Git workflow düzenli (commit messages, branch'ler)
- ✅ Dokümantasyon güncel (README, bu PRD)

---

## 🤝 Ekip İletişimi

### Daily Standup (Her Gün 10 dk - Async)
**Discord/Slack'te her sabah**:
1. ✅ Dün ne yaptım?
2. 📌 Bugün ne yapacağım?
3. 🚧 Blocker var mı? (yardıma ihtiyacım var mı?)

### Code Review
- Her PR (Pull Request) en az 1 kişi tarafından review edilmeli
- Küçük, anlaşılır commit'ler atın
- PR açıklamalarında ne değiştiğini yazın

### Tools
- **Code**: GitHub (branches: main, frontend-dev, backend-dev, data-dev)
- **Communication**: Discord/WhatsApp
- **Task Management**: Notion / Trello (basit bir board yeterli)
- **Design**: Figma (opsiyonel - wireframe için)

---

## 🎯 Cursor AI Kullanım Prompts

### Frontend Developer için

**Komponent oluşturma:**
```
"JobCard komponenti oluştur. Props: job (title, company, location, salary, remote). 
Tailwind CSS + shadcn/ui kullan. Sağ üst köşede bookmark ikonu olsun."
```

**API entegrasyonu:**
```
"axios ile JSearch API'ye istek atan jobService.ts dosyası oluştur. 
searchJobs, getJobById, saveJob fonksiyonları olsun."
```

**State management:**
```
"Zustand store oluştur: authStore (user, login, logout) ve jobStore (searchResults, savedJobs)"
```

### Backend Developer için

**Endpoint oluşturma:**
```
"FastAPI ile /api/v1/jobs/search endpoint'i oluştur. 
Query params: query, location, page. JSearch API'yi çağır, response döndür."
```

**Model tanımlama:**
```
"SQLAlchemy model: User (id, firebase_uid, email, display_name, created_at, updated_at). 
Pydantic schema'sı da oluştur."
```

**Firebase entegrasyonu:**
```
"Firebase Admin SDK ile token validation yapan middleware yaz. 
Token'dan user bilgisini çıkar, request.state.user'a ata."
```

### Data Analyst için

**Veri analizi:**
```
"jobs.json dosyasını Pandas ile analiz et. Lokasyona göre iş sayılarını hesapla, 
bar chart olarak plotly ile görselleştir."
```

**Model oluşturma:**
```
"Job recommendation için TF-IDF + Cosine Similarity kullanan Python fonksiyonu yaz. 
Input: user'ın kaydettiği işler, Output: benzer 10 iş."
```

**Feature extraction:**
```
"Job description text'inden skill keywords çıkaran NLP pipeline yaz. 
Ortak skill'leri tespit et (React, Python, AWS gibi)."
```

---

## 📝 Git Workflow

### Branch Stratejisi
```
main              # Production (stable)
  ├── frontend-dev  # Frontend development
  ├── backend-dev   # Backend development
  └── data-dev      # Data analysis
```

### Commit Convention
```
feat: Yeni özellik (feat: add job search filters)
fix: Bug düzeltme (fix: login form validation)
style: UI değişiklikleri (style: update navbar design)
refactor: Code refactoring (refactor: simplify API service)
docs: Dokümantasyon (docs: update README)
test: Test ekleme (test: add auth tests)
```

### Merge Akışı
1. Feature branch'te çalış (`frontend-dev`, `backend-dev`)
2. Commit'le ve push'la
3. PR aç (Pull Request)
4. Team review (opsiyonel, hızlı çalışıyorsanız atlanabilir)
5. Merge to `main`
6. Auto-deploy tetiklenir (Vercel/Render)

---

## 🏁 Final Checklist (Teslim Öncesi)

### Kod
- [ ] Tüm özellikler çalışıyor (end-to-end test)
- [ ] Console'da error yok
- [ ] Linter warnings temizlenmiş
- [ ] Unused code/comments temizlenmiş
- [ ] Environment variables production'a ayarlanmış

### Deployment
- [ ] Frontend Vercel'de live
- [ ] Backend Render/Railway'de live
- [ ] Database (Supabase) çalışıyor
- [ ] API endpoints production URL'ler kullanıyor
- [ ] Firebase production config

### Dokümantasyon
- [ ] README.md güncel (proje tanıtımı, kurulum, kullanım)
- [ ] API dokümantasyonu (Swagger otomatik)
- [ ] Environment variables (.env.example)
- [ ] Data analysis raporu (Jupyter notebook)

### Sunum
- [ ] Demo videosu veya live demo hazır
- [ ] Presentation slides (kullanılan teknolojiler, özellikler, screenshots)
- [ ] GitHub repository düzenli ve public
- [ ] LinkedIn/portfolio'ya eklenebilir

---

## 🎉 Bonus Özellikler (Zamanınız Varsa)

### Kolay
- [ ] Email ile iş uyarıları (basit - SMTP)
- [ ] Job comparison (2-3 ilanı yan yana karşılaştır)
- [ ] Share job (sosyal medya link paylaşma)
- [ ] Print resume-friendly view
- [ ] Keyboard shortcuts (Ctrl+K: search)

### Orta
- [ ] Job alert subscriptions (belirli kriterlere uyan yeni ilanlar)
- [ ] Salary negotiation tips (Gemini chatbot ile)
- [ ] Interview prep questions (pozisyon bazlı)
- [ ] Company profiles (şirket hakkında bilgi toplama)

### Zor
- [ ] Resume parser (kullanıcı CV'si upload, skill extraction)
- [ ] Video interview practice (mock interview - zor)
- [ ] Mobile app (React Native)
- [ ] Chrome extension (LinkedIn/Indeed'de Jobverse'ü aç)

---

## 🆘 Sorun Giderme (Troubleshooting)

### Frontend
**Problem**: CORS hatası
**Çözüm**: Backend'de CORS ayarlarını kontrol et, frontend URL'ini `ALLOWED_ORIGINS`'e ekle

**Problem**: Firebase auth çalışmıyor
**Çözüm**: Firebase config doğru mu kontrol et (.env), Firebase console'da auth methods aktif mi?

### Backend
**Problem**: Database bağlanamıyor
**Çözüm**: `DATABASE_URL` doğru mu? Supabase'de database oluşturulmuş mu?

**Problem**: JSearch API 429 (Rate Limit)
**Çözüm**: API quota dolmuş, yeni RapidAPI key al veya cache kullan

### Data Analysis
**Problem**: Model accuracy düşük
**Çözüm**: Feature engineering yap, daha fazla veri topla, farklı algoritma dene

**Problem**: Model backend'e entegre edilemiyor
**Çözüm**: `joblib.dump()` ile modeli kaydet, backend'de `joblib.load()` ile yükle

---

## 📞 İletişim

**Frontend Developer**: [İsim/Email/Discord]
**Backend Developer**: [İsim/Email/Discord]
**Data Analyst**: [İsim/Email/Discord]

**GitHub Repository**: https://github.com/[username]/jobverse
**Live Demo**: https://jobverse.vercel.app (placeholder)

---

## 📅 Timeline Özeti

| Hafta | Gün | Frontend | Backend | Data Analysis |
|-------|-----|----------|---------|---------------|
| **1** | 1-2 | Proje setup, Layout | FastAPI setup, JSearch API | EDA, veri analizi |
| **1** | 3-4 | Login/Register UI | Firebase auth | Veri temizleme |
| **1** | 5-7 | Search + Job List | Jobs endpoints | Lokasyon/skill analizi |
| **2** | 8-9 | Chat UI | Gemini chatbot | Recommendation model |
| **2** | 10-11 | Analytics Dashboard | ML endpoints, Applications | Salary model, data export |
| **2** | 12-14 | Polish, Deploy (Vercel) | Deploy (Render) | Model deploy, Rapor |
| **2** | 14 | **Entegrasyon Test + Demo** | **Entegrasyon Test + Demo** | **Entegrasyon Test + Demo** |

---

## 🎓 Öğrenci Projesi İpuçları

1. **Basit başlayın**: Önce core features, sonra bonus
2. **Sık commit atın**: Her küçük ilerlemeyi commit'leyin
3. **Erken test edin**: Son güne bırakmayın
4. **Dokümante edin**: Gelecekte portföy için kullanacaksınız
5. **Yardım isteyin**: Takım arkadaşlarınızla iletişimde kalın
6. **MVP odaklı**: Mükemmellik yerine çalışan bir ürün hedefleyin
7. **Demo hazırlayın**: Video kaydedin (bug olursa canlı demo riskli)

---

## 📚 Ekstra Kaynaklar

### YouTube Kanalları
- **Fireship**: Hızlı teknoloji özetleri
- **Web Dev Simplified**: React, CSS, full-stack tutorials
- **freeCodeCamp**: Uzun format tutoriallar

### GitHub Repositories (Referans)
- [Awesome React](https://github.com/enaqx/awesome-react)
- [FastAPI Best Practices](https://github.com/zhanymkanov/fastapi-best-practices)
- [ML Recommendation Systems](https://github.com/microsoft/recommenders)

---

**Son Güncelleme**: 2 Aralık 2025  
**PRD Versiyonu**: 2.0.0 (2 Haftalık Sprint Edition)  
**Durum**: 🔴 Tüm görevler YAPILACAK  
**Hazırlayan**: AI Assistant (Claude Sonnet 4.5)

---

## ✨ Motivasyon

> "Mükemmel bir proje değil, tamamlanmış bir proje hedefleyin. 
> 2 hafta sonra çalışan, demo edilebilir bir ürününüz olsun. 
> Geliştirmeye devam edebilirsiniz, ama önce MVP'yi bitirin!"

**İyi çalışmalar! 🚀**