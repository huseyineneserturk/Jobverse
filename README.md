# 🚀 Jobverse - İş Trendleri Analiz Platformu

<div align="center">

![Jobverse Logo](https://github.com/huseyineneserturk/Jobverse/blob/main/Resources/Logo_With_Background.png)

**İş ilanlarını analiz eden, trendleri keşfeden platform projesi.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python Version](https://img.shields.io/badge/python-3.8%2B-blue)](https://www.python.org/downloads/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

[Demo](#-demo) • [Özellikler](#-özellikler) • [Kurulum](#-kurulum) • [Kullanım](#-kullanım) • [Katkıda Bulunun](#-katkıda-bulunma)

</div>

---

## 📋 İçindekiler

- [Proje Hakkında](#-proje-hakkında)
- [Demo](#-demo)
- [Özellikler](#-özellikler)
- [Teknolojiler](#-teknolojiler)
- [Sprint Planı](#-sprint-planı)
- [Kurulum](#-kurulum)
- [Kullanım](#-kullanım)
- [Ekran Görüntüleri](#-ekran-görüntüleri)
- [API Dokümantasyonu](#-api-dokümantasyonu)
- [Katkıda Bulunma](#-katkıda-bulunma)
- [Lisans](#-lisans)
- [Ekip](#-ekip)

---

## 💡 Proje Hakkında

Jobverse, iş piyasasındaki güncel trendleri analiz eden, beceri taleplerini haritalayan ve kariyer planlaması için öngörüler sunan kapsamlı bir analiz platformudur. Binlerce iş ilanını otomatik olarak toplar.

### 🎯 Proje Hedefleri

- İş ilanlarını otomatik olarak toplamak ve kategorize etmek
- Sektörel trendleri görselleştirmek
- En çok talep gören becerileri belirlemek
- Maaş aralıklarını ve şirket kültürünü analiz etmek

---

## 🎬 Demo

### Video Tanıtım

[![Jobverse Demo Video](https://via.placeholder.com/800x450/1E293B/FFFFFF?text=Demo+Video+-+Tıklayın)](https://www.youtube.com/watch?v=demo)

> 📹 **Not:** Demo videosu yüklenecek - Projenin tüm özelliklerini gösteren detaylı bir tanıtım

---

## ✨ Özellikler

### 🔍 Veri Toplama ve İşleme
- 

### 📊 Analiz ve Görselleştirme
- 

### 🤖 Yapay Zeka Özellikleri
- 

### 👤 Kullanıcı Özellikleri
- 

---

## 🛠️ Teknolojiler

### Backend
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)


### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)


### Veri Analizi ve ML
- **Pandas** - Veri manipülasyonu

### DevOps
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

---

## 📅 Sprint Planı

### Sprint 1: Temel Altyapı ve Veri Toplama (Hafta 1)

<details>
<summary><b>🎯 Sprint Hedefleri</b></summary>

#### Tamamlanan Görevler
- [x] Proje fikri
- [x] Fonksiyonel gereksinimler
- [x] Kullanılacak teknolojiler
- [x] Sunum

#### Teknik Detaylar
- 

#### Çıktılar
- Sunum dosyası hazırlandı.

#### Sunum

![Sprint 1 Sunum](https://github.com/huseyineneserturk/Jobverse/blob/main/Resources/Presentations/VTYS%20Proje%20Sunumu-1.pdf)

</details>

#### Sprint 1 Sonuçları

![Sprint 1 Grafik](https://github.com/huseyineneserturk/Jobverse/blob/main/Resources/Jira_Board/Jira_Board_1.png)

---

### Sprint 2: Veri İşleme ve Analiz (Hafta 2)

<details>
<summary><b>🎯 Sprint Hedefleri</b></summary>

#### Tamamlanan Görevler
- [x] Veri temizleme pipeline'ı

#### Teknik Detaylar
- SpaCy ile entity recognition

#### Çıktılar
- Temiz ve kategorize edilmiş veri seti

</details>

#### Sprint 2 Sonuçları

![Sprint 2 Grafik](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=Sprint+2+Burndown+Chart)

---

### Sprint 3: Frontend ve Görselleştirme (Hafta 3)

<details>
<summary><b>🎯 Sprint Hedefleri</b></summary>

#### Tamamlanan Görevler
- [x] React projesi kurulumu

#### Teknik Detaylar
- React komponenti mimarisi

#### Çıktılar
- Kullanıcı dostu arayüz

</details>

#### Sprint 3 Sonuçları

![Sprint 3 Grafik](https://via.placeholder.com/800x400/8B5CF6/FFFFFF?text=Sprint+3+Burndown+Chart)

---

### Sprint 4: Özellik Geliştirme ve Test (Hafta 4)

<details>
<summary><b>🎯 Sprint Hedefleri</b></summary>

#### Tamamlanan Görevler
- [x] Kullanıcı kimlik doğrulama sistemi

#### Teknik Detaylar
- JWT authentication

#### Çıktılar
- Production-ready uygulama

</details>

#### Sprint 4 Sonuçları

![Sprint 4 Grafik](https://via.placeholder.com/800x400/EF4444/FFFFFF?text=Sprint+4+Burndown+Chart)

---

## 🚀 Kurulum

### Gereksinimler

- Node.js 18+
- MongoDB Atlas hesabı
- Firebase projesi
- Gemini API Key

### Backend Kurulumu

```bash
# Backend klasörüne git
cd jobverse-backend

# Bağımlılıkları yükle
npm install

# .env dosyasını oluştur
cp .env.example .env
# .env dosyasını düzenle ve gerekli değerleri gir

# Development modunda çalıştır
npm run dev

# Production build
npm run build
```

### Frontend Kurulumu

```bash
# Frontend klasörüne git
cd jobverse-frontend

# Bağımlılıkları yükle
npm install

# .env dosyasını oluştur
cp .env.example .env
# API URL'ini ayarla

# Development modunda çalıştır
npm run dev

# Production build
npm run build
```

### 🌐 Digital Ocean Deploy

```bash
# Sunucuya SSH ile bağlan
ssh root@YOUR_SERVER_IP

# Repo'yu klonla
git clone https://github.com/huseyineneserturk/Jobverse.git
cd Jobverse

# Deploy scriptini çalıştır
chmod +x deploy.sh
./deploy.sh
```

**DNS Ayarları (jobverse.tech):**
```
A Record: @ → Server IP
A Record: www → Server IP
A Record: api → Server IP
```

---

## 📖 Kullanım

### Veri Toplama

```python

```

### API Kullanımı

```bash

```

### Dashboard Erişimi


---

## 📸 Ekran Görüntüleri

### Ana Dashboard
![Dashboard](https://via.placeholder.com/800x500/1E293B/FFFFFF?text=Ana+Dashboard)

### Trend Analizi
![Trend Analysis](https://via.placeholder.com/800x500/0F172A/FFFFFF?text=Trend+Analizi)

### Beceri Haritası
![Skills Map](https://via.placeholder.com/800x500/334155/FFFFFF?text=Beceri+Haritası)

### Maaş Analizi
![Salary Analysis](https://via.placeholder.com/800x500/475569/FFFFFF?text=Maaş+Analizi)

---

## 📡 API Dokümantasyonu

### Endpoints

#### İş İlanları

```

```

#### Analitik

```

```

#### Kullanıcı

```

```


---

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Katkıda bulunmak için:

1. Bu repository'yi fork edin
2. Feature branch'i oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add some AmazingFeature'`)
4. Branch'inizi push edin (`git push origin feature/AmazingFeature`)
5. Pull Request oluşturun

### Geliştirme Kuralları

- PEP 8 kod standartlarına uyun
- Yeni özellikler için test yazın
- Commit mesajlarında Conventional Commits kullanın
- Dokümantasyonu güncel tutun

---

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

## 👥 Ekip

<div align="center">

### Proje Geliştiricileri

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/huseyineneserturk">
        <img src="https://avatars.githubusercontent.com/u/47718441?v=4"/>
        <br />
        <sub><b>Hüseyin Enes Ertürk</b></sub>
      </a>
      <br />
      <sub>Backend Developer & Frontend Developer & Scrum Master</sub>
      <br />
      🔧 Backend | 🗄️ Frontend | 🎯 Project Management
    </td>
    <td align="center">
      <a href="https://github.com/AlperenYasemin">
        <img src="https://avatars.githubusercontent.com/u/57956644?v=4"/>
        <br />
        <sub><b>Alperen Yasemin</b></sub>
      </a>
      <br />
      <sub>Data Analyst</sub>
      <br />
      📊 Data Analysis
    </td>
    <td align="center">
      <a href="https://github.com/ishakkaratas05">
        <img src="https://avatars.githubusercontent.com/u/170670866?v=4"/>
        <br />
        <sub><b>İshak Karataş</b></sub>
      </a>
      <br />
      <sub>Backend Developer & Frontend Developer </sub>
      <br />
      🔧 Backend | 🗄️ Frontend
    </td>
  </tr>
</table>

</div>

---

<div align="center">

### 🌟 Projeyi Beğendiyseniz Yıldız Vermeyi Unutmayın!

**Made with ❤️ by Jobverse Team**
**2025**

[⬆ Başa Dön](#-jobverse---i̇ş-trendleri-analiz-platformu)

</div>
