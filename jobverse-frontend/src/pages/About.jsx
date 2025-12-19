import React from 'react';
import bgPattern from '../assets/images/fon.png';
// --- YENİ EKLENEN FOTOĞRAF IMPORTLARI ---
import alperenPhoto from '../assets/images/alperen.png';
import huseyinPhoto from '../assets/images/huseyin.png';
import ishakPhoto from '../assets/images/ishak.png';


const About = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen pb-20 font-sans relative transition-colors duration-200">

      {/* --- ARKA PLAN DESENİ (FIXED) --- */}
      <div
        className="fixed inset-0 z-0 opacity-[0.05] dark:opacity-[0.02] pointer-events-none h-full w-full transition-opacity duration-200"
        style={{
          backgroundImage: `url(${bgPattern})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '400px'
        }}
      ></div>

      {/* İçerik */}
      <div className="relative z-10">

        {/* --- BAŞLIK ALANI --- */}
        <div className="w-full">
          <div className="max-w-5xl mx-auto px-6 py-16 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#0f172a] dark:text-white mb-6 transition-colors duration-200">
              JOBVERSE Projesi
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed transition-colors duration-200">
              Farklı kaynaklardaki iş ilanlarını tek bir veri tabanında toplayan,
              kullanıcı dostu arayüz ile sunan web tabanlı iş arama platformu.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">

          {/* --- PROJE HAKKINDA --- */}
          <section className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-sm transition-colors duration-200">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-3 transition-colors duration-200">
              <span className="w-1 h-8 bg-indigo-600 rounded-full"></span>
              Proje Hakkında
            </h2>
            <div className="text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed transition-colors duration-200">
              <p>
                Bu proje, Veri Tabanı Yönetim Sistemleri dersi kapsamında,
                gerçek hayat problemlerine çözüm üretmek amacıyla geliştirilmiştir.
              </p>
              <p>
                Günümüzde iş ilanları birçok farklı siteye dağılmış durumdadır.
                <strong>JOBVERSE</strong>, Adzuna ve JSearch gibi servislerden (API) aldığı verileri işleyip
                kendi veri tabanına kaydeder. Kullanıcılar, karmaşık siteler arasında kaybolmak yerine
                tek bir panel üzerinden arama ve filtreleme yapabilirler. Ayrıca platform, toplanan veriler üzerinden
                detaylı analizler sunarak kullanıcıların sektör trendlerini, maaş dağılımlarını ve popüler yetenekleri
                inceleyebilmelerine olanak tanır.
              </p>
            </div>
          </section>

          {/* --- GELİŞTİRİCİ EKİP (FOTOĞRAFLI) --- */}
          <section>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 transition-colors duration-200">Geliştirici Ekip</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Alperen */}
              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors group">
                {/* FOTOĞRAF ALANI */}
                <img
                  src={alperenPhoto}
                  alt="Alperen"
                  // object-cover: Fotoğrafı bozmadan yuvarlağın içine doldurur.
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white dark:border-slate-800 shadow-md group-hover:scale-105 transition-transform duration-300"
                />
                <h3 className="font-bold text-slate-900 dark:text-white text-lg transition-colors duration-200">Alperen</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 transition-colors duration-200">Veri Tabanı & Veri Çekme</p>
              </div>

              {/* Hüseyin */}
              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors group">
                 {/* FOTOĞRAF ALANI */}
                 <img
                  src={huseyinPhoto}
                  alt="Hüseyin"
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white dark:border-slate-800 shadow-md group-hover:scale-105 transition-transform duration-300"
                />
                <h3 className="font-bold text-slate-900 dark:text-white text-lg transition-colors duration-200">Hüseyin</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 transition-colors duration-200">Backend & API Yönetimi</p>
              </div>

              {/* İshak */}
              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors group">
                 {/* FOTOĞRAF ALANI */}
                 <img
                  src={ishakPhoto}
                  alt="İshak"
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white dark:border-slate-800 shadow-md group-hover:scale-105 transition-transform duration-300"
                />
                <h3 className="font-bold text-slate-900 dark:text-white text-lg transition-colors duration-200">İshak</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 transition-colors duration-200">Frontend & Arayüz</p>
              </div>

            </div>
          </section>

          {/* --- TEKNİK DETAYLAR --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Kullanılan Teknolojiler */}
            <section className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-200">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-700 pb-2 transition-colors duration-200">
                Kullanılan Teknolojiler
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-sm font-medium transition-colors duration-200">React 19</span>
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-sm font-medium transition-colors duration-200">React Router DOM</span>
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-sm font-medium transition-colors duration-200">Vite</span>
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-sm font-medium transition-colors duration-200">Tailwind CSS</span>
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-sm font-medium transition-colors duration-200">PostCSS</span>
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-sm font-medium transition-colors duration-200">ESLint</span>
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-sm font-medium transition-colors duration-200">Python</span>
              </div>
            </section>

            {/* Ders Bilgileri (Güncellendi: 2025 Güz) */}
            <section className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-200">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-700 pb-2 transition-colors duration-200">
                Ders Künyesi
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400 transition-colors duration-200">Ders Adı:</span>
                  <span className="font-medium text-slate-900 dark:text-white transition-colors duration-200">Veri Tabanı Yön. Sis.</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400 transition-colors duration-200">Dönem:</span>
                  <span className="font-medium text-slate-900 dark:text-white transition-colors duration-200">2025 Güz</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400 transition-colors duration-200">Durum:</span>
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded text-xs font-bold transition-colors duration-200">Tamamlandı</span>
                </li>
              </ul>
            </section>

          </div>

        </div>
      </div>
    </div>
  );
};

export default About;