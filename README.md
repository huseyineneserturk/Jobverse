# 🚀 Jobverse - İş Arama ve Kariyer Platformu

<div align="center">

![Jobverse Logo](https://github.com/huseyineneserturk/Jobverse/blob/main/Resources/Logo_With_Background.png)

**İş ilanlarını keşfedin, kariyerinizi planlayın, AI destekli mülakat simülasyonları ile hazırlanın.**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-jobverse.tech-blue?style=for-the-badge)](https://jobverse.tech)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)

</div>

---

## ✨ Özellikler

| Özellik | Açıklama |
|---------|----------|
| 🔍 **İş Arama** | MongoDB'den binlerce iş ilanını arayın ve filtreleyin |
| 📊 **Analitik Dashboard** | İş piyasası trendleri, maaş analizleri, popüler yetenekler |
| 🤖 **AI Mülakat Simülasyonu** | Gemini AI ile gerçekçi mülakat pratikleri |
| 💬 **AI Kariyer Asistanı** | Kariyer sorularınıza anında cevaplar |
| 📄 **CV Uygunluk Skoru** | CV'niz ile iş ilanı arasındaki uyumu ölçün |
| 💾 **İlan Kaydetme** | Beğendiğiniz ilanları kaydedin |
| 👤 **Profil Yönetimi** | Fotoğraf, eğitim, CV yükleme |
| 🌙 **Dark Mode** | Göz yormayan karanlık tema |

---

## 🛠️ Teknolojiler

### Frontend
- **React 18** + Vite
- **TailwindCSS** - Modern UI
- **Firebase Auth** - Kimlik doğrulama
- **Firebase Storage** - Dosya yükleme

### Backend
- **Node.js + Express** - API sunucusu
- **TypeScript** - Tip güvenliği
- **MongoDB** - Veritabanı
- **Gemini AI** - AI özellikleri

### Deployment
- **Digital Ocean** - Cloud hosting
- **Nginx** - Reverse proxy
- **PM2** - Process manager
- **Let's Encrypt** - SSL sertifikası

---

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- MongoDB Atlas hesabı
- Firebase projesi
- Gemini API Key

### 1. Projeyi Klonlayın
```bash
git clone https://github.com/huseyineneserturk/Jobverse.git
cd Jobverse
```

### 2. Backend Kurulumu
```bash
cd jobverse-backend
npm install
cp .env.example .env
# .env dosyasını düzenleyin
npm run dev
```

### 3. Frontend Kurulumu
```bash
cd jobverse-frontend
npm install
npm run dev
```

### 4. Tarayıcıda Açın
```
http://localhost:5173
```

---

## 🌐 Production Deploy

### Digital Ocean
```bash
ssh root@YOUR_SERVER_IP
git clone https://github.com/huseyineneserturk/Jobverse.git
cd Jobverse

# Backend
cd jobverse-backend
npm install && npm run build

# Frontend
cd ../jobverse-frontend
npm install && npm run build

# PM2 ile başlat
cd ..
pm2 start ecosystem.config.js
```

### DNS Ayarları
```
A Record: @   → SERVER_IP
A Record: www → SERVER_IP
A Record: api → SERVER_IP
```

---

## 📁 Proje Yapısı

```
Jobverse/
├── jobverse-backend/       # Express + TypeScript API
│   ├── src/
│   │   ├── controllers/    # İş mantığı
│   │   ├── models/         # MongoDB modelleri
│   │   ├── routes/         # API rotaları
│   │   └── config/         # Yapılandırma
│   └── .env.example
│
├── jobverse-frontend/      # React + Vite
│   ├── src/
│   │   ├── components/     # UI bileşenleri
│   │   ├── pages/          # Sayfa bileşenleri
│   │   ├── context/        # React context
│   │   └── services/       # API servisleri
│   └── .env.example
│
├── Resources/              # Logo ve görseller
├── ecosystem.config.js     # PM2 yapılandırması
├── nginx.conf              # Nginx yapılandırması
└── README.md
```

---

## 🔑 API Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/jobs` | İş ilanları listesi |
| GET | `/api/jobs/:id` | Tek iş ilanı |
| GET | `/api/analytics/charts` | Grafik verileri |
| POST | `/api/ai/interview-questions` | Mülakat soruları (Auth) |
| POST | `/api/ai/analyze-answer` | Cevap analizi (Auth) |
| POST | `/api/ai/chat` | Chatbot (Auth) |
| POST | `/api/ai/job-match` | CV uygunluk skoru (Auth) |

---

## 👥 Ekip

| İsim | Rol | GitHub |
|------|-----|--------|
| Hüseyin Enes Ertürk | Full Stack Developer | [@huseyineneserturk](https://github.com/huseyineneserturk) |

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) ile lisanslanmıştır.

---

<div align="center">

**⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!**

[🌐 Demo](https://jobverse.tech) • [📧 İletişim](mailto:huseyineneserturk@gmail.com)

</div>
