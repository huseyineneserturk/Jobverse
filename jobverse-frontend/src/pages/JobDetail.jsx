import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import jobData from '../data/jobs.json';
import { timeAgo } from '../utils/dateUtils';
import { useSavedJobs } from '../context/SavedJobsContext';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/images/logo3.png';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isJobSaved, saveJob, removeJob } = useSavedJobs();
  const { isAuthenticated, user } = useAuth();
  const [cvMatchScore, setCvMatchScore] = useState(null);
  const [isLoadingMatch, setIsLoadingMatch] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isInterviewLoading, setIsInterviewLoading] = useState(false);
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [currentInterviewQuestion, setCurrentInterviewQuestion] = useState(0);
  const [interviewAnswers, setInterviewAnswers] = useState([]);
  const [interviewFinished, setInterviewFinished] = useState(false);
  const [showCvMatchModal, setShowCvMatchModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showFinishConfirmModal, setShowFinishConfirmModal] = useState(false);
  // URL'den gelen id string olduğu için parseInt ile sayıya çeviriyoruz
  const job = jobData.find((j) => j.id === parseInt(id));
  const saved = job && isJobSaved(job.id);

  // Bu ilana göre basit mock mülakat soruları üret
  const generateLocalInterviewQuestions = () => {
    if (!job) return [];

    const title = job.jobTitle || 'bu pozisyon';
    const company = job.employerName || 'bu şirket';

    return [
      `${company} bünyesindeki ${title} rolü için seni en uygun yapan 3 özelliğini anlatır mısın?`,
      `${title} rolünde şimdiye kadar karşılaştığın en zor teknik/iş problemi neydi, nasıl çözdün?`,
      `${company} gibi bir şirkette çalışırken ilk 90 günde neleri başarmayı hedeflersin?`,
      `Takım çalışması konusunda, geçmişte yaşadığın bir çatışma durumunu ve bunu nasıl yönettiğini örnekle anlatır mısın?`,
      `${title} rolünde sürekli kendini güncel tutmak için hangi kaynakları ve yöntemleri kullanıyorsun?`,
    ];
  };

  const handleSaveToggle = () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    if (saved) {
      removeJob(job.id);
    } else {
      saveJob(job);
    }
  };

  const handleOpenCvMatchModal = () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    setShowCvMatchModal(true);
    
    // CV yüklü mü kontrol et ve skor hesapla
    const hasCv = localStorage.getItem('userCv') !== null;
    if (hasCv && !cvMatchScore && !isLoadingMatch) {
      setIsLoadingMatch(true);
      setTimeout(() => {
        const mockScore = Math.floor(Math.random() * 30) + 70; // 70-100 arası
        setCvMatchScore(mockScore);
        setIsLoadingMatch(false);
      }, 1000);
    }
  };

  const handleStartInterview = () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    setShowInterviewModal(true);
    setIsInterviewLoading(true);
    setInterviewFinished(false);

    // Frontend tarafında mock olarak soruları hazırla
    setTimeout(() => {
      const questions = generateLocalInterviewQuestions();
      setInterviewQuestions(questions);
      setInterviewAnswers(new Array(questions.length).fill({ answer: '' }));
      setInterviewStarted(true);
      setCurrentInterviewQuestion(0);
      setIsInterviewLoading(false);
    }, 1500);
  };

  const handleInterviewAnswerChange = (value) => {
    setInterviewAnswers((prev) => {
      const next = [...prev];
      next[currentInterviewQuestion] = { answer: value };
      return next;
    });
  };

  const handleNextInterviewQuestion = () => {
    if (currentInterviewQuestion < interviewQuestions.length - 1) {
      setCurrentInterviewQuestion((prev) => prev + 1);
    }
  };

  const handlePreviousInterviewQuestion = () => {
    if (currentInterviewQuestion > 0) {
      setCurrentInterviewQuestion((prev) => prev - 1);
    }
  };

  const handleFinishInterview = () => {
    setShowFinishConfirmModal(true);
  };

  const confirmFinishInterview = () => {
    setInterviewFinished(true);
    setShowFinishConfirmModal(false);
  };

  const handleRestartInterview = () => {
    setInterviewFinished(false);
    setInterviewStarted(false);
    setInterviewQuestions([]);
    setInterviewAnswers([]);
    setCurrentInterviewQuestion(0);
    setIsInterviewLoading(true);
    setTimeout(() => {
      const questions = generateLocalInterviewQuestions();
      setInterviewQuestions(questions);
      setInterviewAnswers(questions.map(() => ({ answer: '' })));
      setIsInterviewLoading(false);
      setInterviewStarted(true);
    }, 1500);
  };


  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors duration-200">İlan Bulunamadı</h2>
        <Link to="/jobs" className="text-indigo-600 dark:text-indigo-400 hover:underline mt-4 font-medium transition-colors duration-200">← Listeye Dön</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans pb-20 transition-colors duration-200">
      
      {/* --- ÜST HEADER (BREADCRUMB) --- */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link to="/jobs" className="text-slate-500 dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-white text-sm font-medium flex items-center gap-2 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Tüm İlanlara Dön
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- SOL KOLON (ANA İÇERİK - 8 Birim) --- */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Başlık Kartı */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-200">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight mb-2 transition-colors duration-200">
                    {job.jobTitle}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mt-3 transition-colors duration-200">
                    <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300 transition-colors duration-200">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {job.employerName}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {job.jobCity}, {job.jobCountry}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                    <span className="text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded text-xs font-bold transition-colors duration-200">
                      {timeAgo(job.jobPostedAtDatetimeUtc)}
                    </span>
                  </div>
                </div>
                {/* Logo */}
                <div className="w-16 h-16 bg-[#0f172a] rounded-xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-md">
                  {job.employerName ? job.employerName[0] : "J"}
                </div>
              </div>
            </div>

            {/* Minimal Butonlar - CV Uygunluk ve Mülakat */}
            {isAuthenticated && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleOpenCvMatchModal}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-700/90 border-2 border-slate-400 dark:border-slate-500 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 hover:border-slate-500 dark:hover:border-slate-400 transition-all duration-200 text-sm font-semibold text-slate-900 dark:text-slate-100 shadow-md hover:shadow-lg"
                >
                  <svg className="w-4 h-4 text-slate-800 dark:text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  CV Uygunluk Skoru
                </button>
                <button
                  onClick={handleStartInterview}
                  disabled={isInterviewLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-700/90 border-2 border-slate-400 dark:border-slate-500 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 hover:border-slate-500 dark:hover:border-slate-400 transition-all duration-200 text-sm font-semibold text-slate-900 dark:text-slate-100 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-100 disabled:hover:border-slate-400"
                >
                  <svg className="w-4 h-4 text-slate-800 dark:text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Mülakat Simülasyonu
                </button>
              </div>
            )}

            {/* 2. İş Tanımı */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-200">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 transition-colors duration-200">
                <span className="w-1 h-6 bg-[#0f172a] dark:bg-sky-500 rounded-full"></span>
                Pozisyon Hakkında
              </h3>
              <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line transition-colors duration-200">
                {job.jobDescription}
              </div>
            </div>

            {/* 3. Nitelikler */}
            {job.jobHighlights?.Qualifications && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-200">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 transition-colors duration-200">
                  <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
                  Aranan Nitelikler
                </h3>
                <ul className="grid gap-3">
                  {job.jobHighlights.Qualifications.map((item, index) => (
                    <li key={index} className="flex gap-3 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700 transition-colors duration-200">
                      <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 4. Sorumluluklar */}
            {job.jobHighlights?.Responsibilities && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-200">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 transition-colors duration-200">
                  <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                  Sorumluluklar
                </h3>
                <ul className="space-y-3">
                  {job.jobHighlights.Responsibilities.map((item, index) => (
                    <li key={index} className="flex gap-3 text-slate-600 dark:text-slate-300 transition-colors duration-200">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                      <span className="text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

          {/* --- SAĞ KOLON (STICKY SIDEBAR - 4 Birim) --- */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto lg:pr-2 custom-scrollbar">
              
              {/* Başvuru Kartı */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg shadow-indigo-50/50 dark:shadow-indigo-900/20 transition-colors duration-200">
                <h3 className="font-bold text-slate-800 dark:text-white mb-1 transition-colors duration-200">İlgini çekti mi?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 transition-colors duration-200">Başvurunu hemen tamamla, fırsatı kaçırma.</p>
                
                <a 
                  href={job.jobApplyLink}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full text-center bg-[#0f172a] hover:bg-slate-700 text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mb-3"
                >
                  Şimdi Başvur
                </a>
                
                {/* Kaydet Butonu */}
                {isAuthenticated && (
                  <button
                    onClick={handleSaveToggle}
                    className={`w-full flex items-center justify-center gap-2 font-semibold py-3 px-4 rounded-xl transition-all shadow-sm hover:shadow-md ${
                      saved
                        ? 'bg-sky-50 dark:bg-sky-900/30 hover:bg-sky-100 dark:hover:bg-sky-900/40 text-sky-700 dark:text-sky-300 border-2 border-sky-200 dark:border-sky-800'
                        : 'bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600 hover:border-sky-300 dark:hover:border-sky-600'
                    }`}
                  >
                    {saved ? (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.5 21h-11c-1.105 0-2-.895-2-2V5c0-1.105.895-2 2-2h11c1.105 0 2 .895 2 2v14c0 1.105-.895 2-2 2zm0-16h-11v14h11V5zM12 14l-3-3h2V9h2v2h2l-3 3z"/>
                          <path d="M12 2L8 6h2v2h4V6h2L12 2z" fill="currentColor" opacity="0.3"/>
                        </svg>
                        <span>Kaydedildi</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        <span>Kaydet</span>
                      </>
                    )}
                  </button>
                )}
                
                <p className="text-xs text-center text-slate-400 dark:text-slate-500 mt-4 transition-colors duration-200">
                  Jobverse üzerinden yönlendirileceksiniz.
                </p>
              </div>

              {/* Özet Bilgiler Kartı */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-200">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-700 pb-2 transition-colors duration-200">İlan Özeti</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 transition-colors duration-200">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 dark:text-slate-500 uppercase font-bold transition-colors duration-200">Çalışma Şekli</p>
                      <p className="font-medium text-slate-700 dark:text-slate-300 transition-colors duration-200">{job.jobEmploymentType}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 transition-colors duration-200">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 dark:text-slate-500 uppercase font-bold transition-colors duration-200">Konum Türü</p>
                      <p className="font-medium text-slate-700 dark:text-slate-300 transition-colors duration-200">{job.jobIsRemote ? "Uzaktan (Remote)" : "Ofiste / Hibrit"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 transition-colors duration-200">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 dark:text-slate-500 uppercase font-bold transition-colors duration-200">Yayınlanma</p>
                      <p className="font-medium text-slate-700 dark:text-slate-300 transition-colors duration-200">{timeAgo(job.jobPostedAtDatetimeUtc)}</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>

      {/* CV Uygunluk Skoru Modal */}
      {showCvMatchModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setShowCvMatchModal(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">CV Uygunluk Skoru</h3>
              <button
                onClick={() => setShowCvMatchModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {isLoadingMatch ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0f172a] dark:border-sky-500 mb-4"></div>
                <p className="text-sm text-slate-600 dark:text-slate-400">CV uygunluk skoru hesaplanıyor...</p>
              </div>
            ) : (() => {
              const hasCv = localStorage.getItem('userCv') !== null;
              if (!hasCv) {
                return (
                  <div className="space-y-4">
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        Bu işlem için öncelikle CV yüklemesi yapmalısınız.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setShowCvMatchModal(false);
                        navigate('/cv-upload');
                      }}
                      className="w-full bg-gradient-to-r from-[#0f172a] to-slate-800 hover:from-slate-900 hover:to-slate-700 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg"
                    >
                      CV Yükle
                    </button>
                  </div>
                );
              }

              return (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className={`text-5xl font-bold mb-2 ${
                      cvMatchScore >= 85 ? 'text-green-600 dark:text-green-400' :
                      cvMatchScore >= 70 ? 'text-sky-600 dark:text-sky-400' :
                      cvMatchScore >= 50 ? 'text-yellow-600 dark:text-yellow-400' : 'text-orange-600 dark:text-orange-400'
                    }`}>
                      {cvMatchScore}%
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">CV Uygunluk Oranı</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        cvMatchScore >= 85 ? 'bg-green-500' :
                        cvMatchScore >= 70 ? 'bg-sky-500' :
                        cvMatchScore >= 50 ? 'bg-yellow-500' : 'bg-orange-500'
                      }`}
                      style={{ width: `${cvMatchScore}%` }}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowCvMatchModal(false)}
                      className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
                    >
                      Kapat
                    </button>
                    <button
                      onClick={() => {
                        setShowCvMatchModal(false);
                        navigate('/cv-upload');
                      }}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-[#0f172a] to-slate-800 hover:from-slate-900 hover:to-slate-700 text-white rounded-lg transition-all font-medium shadow-sm hover:shadow-md"
                    >
                      CV Güncelle
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Mülakat Simülasyonu Full Screen Modal */}
      {showInterviewModal && (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 z-50 flex flex-col">
          {/* Header */}
          <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="max-w-5xl mx-auto px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#0f172a] to-slate-700 dark:from-sky-600 dark:to-sky-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                      AI Destekli Mülakat Simülasyonu
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                      {job.jobTitle} • {job.employerName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowInterviewModal(false);
                    setInterviewStarted(false);
                    setInterviewFinished(false);
                    setInterviewQuestions([]);
                    setInterviewAnswers([]);
                    setCurrentInterviewQuestion(0);
                  }}
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          {isInterviewLoading ? (
            <div className="flex-1 bg-[#0f172a] flex flex-col items-center justify-center relative">
              <div className="flex flex-col items-center justify-center">
                <div className="relative mb-8">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-700 border-t-white"></div>
                </div>
                <h3 className="text-2xl font-bold text-white">Mülakat Başlatılıyor</h3>
              </div>
              <div className="absolute bottom-8 flex justify-center">
                <img src={logo} alt="Jobverse Logo" className="h-12 w-auto object-contain opacity-80" />
              </div>
            </div>
          ) : interviewStarted ? (
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="space-y-5 flex flex-col h-full">
                  {!interviewFinished && interviewQuestions.length > 0 && (
                    <>
                      <div className="flex gap-6 flex-1 min-h-0">
                        {/* Dikey Progress Indicator */}
                        <div className="flex flex-col items-center gap-2 pt-1">
                          {interviewQuestions.map((_, index) => (
                            <div key={index} className="flex flex-col items-center">
                              <div
                                className={`transition-all duration-500 ease-in-out ${
                                  index < currentInterviewQuestion
                                    ? 'w-3 h-3 rounded-full bg-gradient-to-r from-[#0f172a] to-slate-700 dark:from-sky-500 dark:to-sky-600 shadow-md'
                                    : index === currentInterviewQuestion
                                    ? 'w-4 h-4 rounded-full bg-gradient-to-r from-[#0f172a] to-slate-700 dark:from-sky-500 dark:to-sky-600 shadow-lg ring-2 ring-[#0f172a]/30 dark:ring-sky-500/30 scale-110'
                                    : 'w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600'
                                }`}
                              />
                              {index < interviewQuestions.length - 1 && (
                                <div
                                  className={`w-0.5 mt-2 mb-2 transition-all duration-500 ease-in-out ${
                                    index < currentInterviewQuestion
                                      ? 'h-8 bg-gradient-to-b from-[#0f172a] to-slate-700 dark:from-sky-500 dark:to-sky-600'
                                      : 'h-8 bg-slate-200 dark:bg-slate-700'
                                  }`}
                                />
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Soru Kartı */}
                        <div 
                          key={currentInterviewQuestion}
                          className="flex-1 bg-white dark:bg-slate-800 rounded-2xl p-7 border border-slate-200 dark:border-slate-700 shadow-lg transition-all duration-500 ease-in-out flex flex-col"
                        >
                          <div className="flex items-start gap-4 mb-5">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#0f172a] to-slate-700 dark:from-sky-500 dark:to-sky-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md transition-all duration-500 ease-in-out">
                              <span className="text-white font-bold text-lg transition-all duration-300">{currentInterviewQuestion + 1}</span>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-relaxed transition-all duration-500 ease-in-out">
                                {interviewQuestions[currentInterviewQuestion]}
                              </h3>
                            </div>
                          </div>
                          <div className="flex-1 flex flex-col min-h-0">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                              Cevabınız
                            </label>
                            <textarea
                              value={interviewAnswers[currentInterviewQuestion]?.answer || ''}
                              onChange={(e) => handleInterviewAnswerChange(e.target.value)}
                              placeholder="Cevabınızı buraya yazın..."
                              rows={8}
                              className="w-full flex-1 px-5 py-4 text-base rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0f172a] dark:focus:ring-sky-500 focus:border-[#0f172a] dark:focus:border-sky-500 resize-none transition-all duration-300 ease-in-out font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
                        <button
                          type="button"
                          onClick={handlePreviousInterviewQuestion}
                          disabled={currentInterviewQuestion === 0}
                          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                          Önceki
                        </button>

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setShowInterviewModal(false);
                              setInterviewStarted(false);
                              setInterviewFinished(false);
                              setInterviewQuestions([]);
                              setInterviewAnswers([]);
                              setCurrentInterviewQuestion(0);
                            }}
                            className="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all"
                          >
                            Çıkış
                          </button>
                          {currentInterviewQuestion === interviewQuestions.length - 1 ? (
                            <button
                              type="button"
                              onClick={handleFinishInterview}
                              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Tamamla
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={handleNextInterviewQuestion}
                              disabled={interviewQuestions.length === 0}
                              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0f172a] to-slate-700 dark:from-sky-600 dark:to-sky-700 hover:from-slate-800 hover:to-slate-900 dark:hover:from-sky-700 dark:hover:to-sky-800 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              Sonraki
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {interviewFinished && (
                    <div className="mt-8 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl p-8 shadow-lg">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-3">
                            Mülakat Simülasyonu Tamamlandı
                          </h3>
                          <p className="text-base text-emerald-800 dark:text-emerald-200 leading-relaxed mb-4">
                            Tüm soruları başarıyla tamamladınız. Cevaplarınız kaydedildi ve analiz için hazır.
                          </p>
                          <div className="bg-white/60 dark:bg-slate-800/60 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800 mb-4">
                            <p className="text-sm text-emerald-700 dark:text-emerald-300 leading-relaxed">
                              <span className="font-semibold">Not:</span> Bu aşamada analiz ve geri bildirim kısmı henüz sadece tasarım olarak hazır. 
                              Cevaplarınız yalnızca bu sayfada tutulur. Backend/Gemini entegrasyonu yapıldığında, bu cevaplar üzerinden 
                              detaylı bir değerlendirme ve puanlama gösterilebilir.
                            </p>
                          </div>
                          <button
                            onClick={handleRestartInterview}
                            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Simülasyonu Tekrar Başlat
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Mülakat Tamamlama Onay Modal */}
      {showFinishConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl max-w-md w-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Mülakat Simülasyonunu Tamamlamak İstiyor musunuz?
                </h3>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              Tüm soruları tamamladınız. Mülakat simülasyonunu bitirmek istediğinizden emin misiniz? 
              Bu işlemden sonra sorulara geri dönemezsiniz.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowFinishConfirmModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={confirmFinishInterview}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold shadow-md hover:shadow-lg transition-all"
              >
                Evet, Tamamla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;