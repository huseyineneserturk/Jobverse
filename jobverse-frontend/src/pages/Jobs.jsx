import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom'; // 1. YENİ IMPORT
import jobData from '../data/jobs.json';
import JobCard from '../components/JobCard';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const location = useLocation(); // 2. Kuryeyi (Location) çağırdık
  
  // --- STATE'LER ---
  // 3. BURASI ÇOK ÖNEMLİ:
  // Eğer ana sayfadan bir veri geldiyse (location.state?.searchQuery),
  // searchTerm'ü o yap. Yoksa boş başlat ("").
  const initialSearch =
    location.state?.searchQuery ||
    new URLSearchParams(location.search).get('search') ||
    "";
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  
  const [selectedCountry, setSelectedCountry] = useState("Tümü");
  const [selectedType, setSelectedType] = useState("Tümü");
  const [isRemote, setIsRemote] = useState(false);

  // ... (Geri kalan kodun, useEffect, useMemo, filtreleme mantığı vb. aynen kalacak)
  // KODUN DEVAMI AYNI...

  useEffect(() => {
    setJobs(jobData);
  }, []);

  // URL'den gelen arama parametresi değişirse searchTerm'i senkronize et
  useEffect(() => {
    const query = location.state?.searchQuery || new URLSearchParams(location.search).get('search') || "";
    setSearchTerm(query);
  }, [location.search, location.state?.searchQuery]);

  const uniqueCountries = useMemo(() => {
    const countries = jobData.map(job => job.jobCountry).filter(Boolean);
    return ["Tümü", ...new Set(countries)];
  }, []);

  const uniqueTypes = useMemo(() => {
    const types = jobData.map(job => job.jobEmploymentType).filter(Boolean);
    return ["Tümü", ...new Set(types)];
  }, []);

  const filteredJobs = jobs.filter((job) => {
// Aramayı küçük harfe çevir (Performans için bir kere yapıyoruz)
    const term = searchTerm.toLowerCase();

    // 1. Arama Kriteri (Artık her yere bakıyor!)
    const matchesSearch = 
      // A. Başlıkta var mı?
      job.jobTitle?.toLowerCase().includes(term) ||
      
      // B. Şirket adında var mı?
      job.employerName?.toLowerCase().includes(term) ||
      
      // C. Açıklama metninde var mı? (İŞTE EKSİK OLAN BUYDU)
      job.jobDescription?.toLowerCase().includes(term) ||
      
      // D. Nitelikler listesinde (Qualifications) var mı?
      // (some: Liste içinde en az bir tanesi uyuyorsa true döner)
      job.jobHighlights?.Qualifications?.some(q => q.toLowerCase().includes(term));

    // 2. Ülke Filtresi
    const matchesCountry = selectedCountry === "Tümü" || job.jobCountry === selectedCountry;

    // 3. Çalışma Tipi Filtresi
    const matchesType = selectedType === "Tümü" || job.jobEmploymentType === selectedType;

    // 4. Remote Kontrolü
    const matchesRemote = isRemote ? job.jobIsRemote === true : true;

    return matchesSearch && matchesCountry && matchesType && matchesRemote;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCountry("Tümü");
    setSelectedType("Tümü");
    setIsRemote(false);
  };

  return (
    <div>
      {/* ... (Tasarım kodların aynen kalacak) ... */}
      
      {/* Sadece kolaylık olsun diye JSX kısmını tekrar yazmıyorum, 
          yukarıdaki JS değişikliğini yapman yeterli. 
          Ama eğer "kafam karışır" dersen Jobs.jsx'in tamamını aşağıya ekleyebilirim. */}
      
      {/* --- BAŞLIK --- */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight transition-colors duration-200">Güncel İş İlanları</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg transition-colors duration-200">Kariyer hedeflerine uygun pozisyonları filtrele.</p>
      </div>

      {/* --- GELİŞMİŞ FİLTRE PANELİ --- */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mb-8 transition-colors duration-200">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          
          {/* 1. Arama Kutusu (5 birim) */}
          <div className="md:col-span-5">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 ml-1 transition-colors duration-200">Anahtar Kelime</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="Pozisyon, şirket veya yetenek..." 
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* 2. Ülke Seçimi (3 birim) */}
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 ml-1 transition-colors duration-200">Ülke</label>
            <div className="relative">
              <select 
                className="block w-full pl-3 pr-10 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer transition-colors duration-200"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
              >
                {uniqueCountries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* 3. Çalışma Tipi (2 birim) */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 ml-1 transition-colors duration-200">Çalışma Şekli</label>
            <div className="relative">
              <select 
                className="block w-full pl-3 pr-10 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer transition-colors duration-200"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
               <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* 4. Remote Checkbox (2 birim) */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-transparent uppercase mb-2 ml-1 select-none">
              Hizalama
            </label>
            <label 
              className={`flex items-center justify-center gap-2 w-full py-3 border rounded-xl cursor-pointer transition-all select-none shadow-sm
                ${isRemote 
                  ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 dark:border-indigo-500 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500" 
                  : "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-600"
                }`}
            >
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors 
                ${isRemote ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}>
                {isRemote && (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={isRemote}
                onChange={() => setIsRemote(!isRemote)}
              />
              <span className="font-medium text-sm">Uzaktan</span>
            </label>
          </div>

        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-sm transition-colors duration-200">
           <span className="text-slate-500 dark:text-slate-400 transition-colors duration-200">
             Toplam <strong className="text-slate-900 dark:text-white transition-colors duration-200">{filteredJobs.length}</strong> sonuç listelendi.
           </span>
           {(searchTerm || selectedCountry !== "Tümü" || selectedType !== "Tümü" || isRemote) && (
             <button 
               onClick={clearFilters}
               className="text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition-colors"
             >
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
               </svg>
               Filtreleri Temizle
             </button>
           )}
        </div>

      </div>

      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <div className="bg-slate-50 dark:bg-slate-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-200">
            <svg className="h-10 w-10 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white transition-colors duration-200">Eşleşen İlan Yok</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2 transition-colors duration-200">Seçtiğin kriterlere uygun ilan bulamadık.</p>
          <button 
            onClick={clearFilters}
            className="mt-6 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline transition-colors duration-200"
          >
            Tüm Filtreleri Kaldır
          </button>
        </div>
      )}

    </div>
  );
};

export default Jobs;