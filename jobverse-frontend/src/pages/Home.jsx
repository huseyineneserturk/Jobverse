import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dinamikVeriToplama from '../assets/images/anasayfa/1_Dinamik_Veri_Toplama.png';
import akilliAnaliz from '../assets/images/anasayfa/2_Akılli_Analiz.png';
import gorselRaporlama from '../assets/images/anasayfa/3_Görsel_Raporlama.png';
import backgroundVideo from '../assets/videos/jobverse.mp4';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    // Arama yapınca İlanlar sayfasına yönlendir
    if (searchTerm.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen font-sans relative overflow-hidden transition-colors duration-200">
      
      {/* --- İÇERİK KATMANI --- */}
      <div className="relative">

        {/* --- HERO SECTION (GİRİŞ ALANI) --- */}
        <section className="relative pt-40 pb-52 px-6 overflow-hidden min-h-[90vh]">
          
          {/* --- ARKA PLAN VİDEOSU (Sadece Hero Section'da) --- */}
          <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute top-0 left-0 w-full h-full object-cover"
            >
              <source src={backgroundVideo} type="video/mp4" />
              {/* Tarayıcı video desteklemiyorsa fallback */}
              Tarayıcınız video oynatmayı desteklemiyor.
            </video>
            {/* Video üzerine overlay (okunabilirlik ve gece/gündüz modu için) */}
            <div className="absolute inset-0 bg-slate-900/20 dark:bg-slate-900/70 transition-colors duration-200"></div>
          </div>

          {/* Hero İçerik */}
          <div className="relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            
            {/* Ana Başlık */}
            <h1 className="text-5xl md:text-7xl font-extrabold text-white dark:text-white/75 leading-tight tracking-tight mb-6 transition-colors duration-200">
              JOBVERSE 
            </h1>
            
            {/* Alt Başlık */}
            <p className="text-lg md:text-2xl text-white dark:text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed font-light transition-colors duration-200">
              Güncel iş ilanlarını tek bir platformdan takip edin, analiz edin ve 
              fırsatları anında yakalayın.
            </p>

            {/* --- ARAMA ÇUBUĞU --- */}
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-2 rounded-full shadow-[0_8px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_40px_-10px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-slate-700 flex items-center max-w-2xl mx-auto transition-all hover:scale-[1.01] duration-300">
              
              {/* Input İkonu */}
              <div className="pl-6 pr-2 text-slate-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Input Alanı */}
              <input 
                type="text" 
                placeholder="İş ilanı, şirket veya pozisyon ara..." 
                className="flex-grow bg-transparent py-4 text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 outline-none text-lg font-medium transition-colors duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              
              {/* Ara Butonu */}
              <button 
                onClick={handleSearch}
                className="bg-[#0f172a] hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-full transition-all duration-200 text-lg shadow-lg hover:shadow-xl ml-2"
              >
                Ara
              </button>
            </div>

            {/* Hızlı Etiketler */}
            <div className="mt-8 text-sm font-medium text-white dark:text-white/70 transition-colors duration-200">
              Popüler Aramalar: 
              <button onClick={() => navigate('/jobs?search=React')} className="text-white dark:text-white/70 hover:text-blue-300 dark:hover:text-blue-400 cursor-pointer mx-2 transition-colors">React Developer</button>
              <span className="text-white/60 dark:text-white/40">•</span>
              <button onClick={() => navigate('/jobs?search=Backend')} className="text-white dark:text-white/70 hover:text-blue-300 dark:hover:text-blue-400 cursor-pointer mx-2 transition-colors">Backend</button>
              <span className="text-white/60 dark:text-white/40">•</span>
              <button onClick={() => navigate('/jobs?search=Remote')} className="text-white dark:text-white/70 hover:text-blue-300 dark:hover:text-blue-400 cursor-pointer mx-2 transition-colors">Uzaktan</button>
            </div>
          </div>
          </div>
        </section>

        {/* --- NEDEN JOBVERSE? (ÖZELLİKLER) --- */}
        <section className="py-24 px-6 border-t border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-800 transition-colors duration-200">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#0f172a] dark:text-white transition-colors duration-200">Neden JOBVERSE?</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg transition-colors duration-200">Profesyonel iş arama deneyimi için tasarlanmış kapsamlı çözümler</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              
              {/* Kart 1 */}
              <div className="p-10 rounded-3xl bg-white/80 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-shadow duration-200">
                <div className="mb-6 rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src={dinamikVeriToplama} 
                    alt="Dinamik Veri Toplama" 
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 transition-colors duration-200">Dinamik Veri Toplama</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg transition-colors duration-200">
                  Adzuna, JSearch gibi API'lardan anlık çekilen verilerle en taze ilanlara herkesten önce ulaşın.
                </p>
              </div>

              {/* Kart 2 */}
              <div className="p-10 rounded-3xl bg-white/80 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-shadow duration-200">
                <div className="mb-6 rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src={akilliAnaliz} 
                    alt="Akıllı Analiz" 
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 transition-colors duration-200">Akıllı Analiz</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg transition-colors duration-200">
                  Piyasa trendlerini, maaş beklentilerini ve en çok aranan yetkinlikleri yapay zeka desteğiyle analiz edin.
                </p>
              </div>

              {/* Kart 3 */}
              <div className="p-10 rounded-3xl bg-white/80 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-shadow duration-200">
                <div className="mb-6 rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src={gorselRaporlama} 
                    alt="Görsel Raporlama" 
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 transition-colors duration-200">Görsel Raporlama</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg transition-colors duration-200">
                  Toplanan verileri karmaşık tablolar yerine anlaşılır ve etkileşimli grafiklerle görselleştirin.
                </p>
              </div>

            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Home;