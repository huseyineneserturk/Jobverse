import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { generateInterviewQuestions, analyzeInterviewAnswers } from '../services/geminiApi.js';

const InterviewSimulation = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState(null);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Mock iş ilanları (backend'den gelecek - gerçek implementasyonda jobs.json'dan veya API'den gelecek)
  const mockJobs = [
    { id: 1, title: 'Frontend Developer', company: 'Tech Corp', description: 'React, Vue.js, TypeScript deneyimi' },
    { id: 2, title: 'Backend Developer', company: 'Soft Inc', description: 'Node.js, Python, API geliştirme' },
    { id: 3, title: 'Full Stack Developer', company: 'Dev Solutions', description: 'Full stack web development' },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
        <div className="text-center">
          <p className="text-slate-500 dark:text-slate-400 text-lg">Lütfen giriş yapın.</p>
        </div>
      </div>
    );
  }

  const handleStartInterview = async () => {
    if (!selectedJob) {
      alert('Lütfen bir iş ilanı seçin');
      return;
    }

    setIsLoading(true);
    
    try {
      // Google Gemini AI ile soruları oluştur
      const generatedQuestions = await generateInterviewQuestions(selectedJob);
      setQuestions(generatedQuestions);
      setInterviewStarted(true);
      setCurrentQuestion(0);
      setAnswers([]);
      setAnalysisResult(null);
    } catch (error) {
      console.error('Error generating questions:', error);
      alert('Sorular oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = {
      question: questions[currentQuestion],
      answer: answer
    };
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFinishInterview = async () => {
    setIsLoading(true);
    
    try {
      // Google Gemini AI ile cevapları analiz et
      const analysis = await analyzeInterviewAnswers(selectedJob, answers);
      setAnalysisResult(analysis);
      
      // Analiz sonuçlarını göster (yakında detaylı bir sonuç sayfası eklenebilir)
      alert(`Mülakat simülasyonu tamamlandı!\n\nGenel Puan: ${analysis.overallScore}/100\n\n${analysis.feedback}`);
      
      // Şimdilik simülasyonu bitir, ileride analiz sonuç sayfası eklenebilir
      // setInterviewStarted(false);
    } catch (error) {
      console.error('Error analyzing answers:', error);
      alert('Analiz yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        {/* Başlık Bölümü */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-1 bg-gradient-to-b from-sky-600 to-sky-500 rounded-full"></div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors duration-200">Mülakat Simülasyonu</h1>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 ml-4 transition-colors duration-200">
            Gerçek mülakat öncesi kendinizi test edin ve hazırlanın
          </p>
        </div>

        {!interviewStarted ? (
          /* İş İlanı Seçimi */
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 overflow-hidden transition-colors duration-200">
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2 transition-colors duration-200">
                  <div className="h-6 w-1 bg-sky-600 rounded-full"></div>
                  İş İlanı Seçin
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 ml-3 transition-colors duration-200">
                  Mülakat simülasyonu için bir iş ilanı seçin
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {mockJobs.map((job) => (
                  <button
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedJob?.id === job.id
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-600 bg-white dark:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white transition-colors duration-200">{job.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-200">{job.company}</p>
                      </div>
                      {selectedJob?.id === job.id && (
                        <svg className="w-5 h-5 text-sky-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    <p className="font-semibold mb-1">Mülakat Simülasyonu Nasıl Çalışır?</p>
                    <ul className="list-disc list-inside space-y-1 text-blue-600 dark:text-blue-400">
                      <li>Bir iş ilanı seçin</li>
                      <li>Size sorulacak sorulara cevap verin</li>
                      <li>AI destekli geri bildirim alın</li>
                      <li>Mülakata daha iyi hazırlanın</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => navigate(-1)}
                  className="px-6 py-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-sm font-medium transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleStartInterview}
                  disabled={!selectedJob || isLoading}
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Başlatılıyor...' : 'Simülasyonu Başlat'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Mülakat Soruları */
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 overflow-hidden transition-colors duration-200">
            <div className="p-8">
              {/* İlerleme Göstergesi */}
              {questions.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors duration-200">
                      Soru {currentQuestion + 1} / {questions.length}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-200">
                      {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Tamamlandı
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-sky-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Soru */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 transition-colors duration-200">
                  {questions[currentQuestion]}
                </h2>
                
                <textarea
                  value={answers[currentQuestion]?.answer || ''}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder="Cevabınızı buraya yazın..."
                  className="w-full h-48 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 resize-none font-medium transition-all"
                  rows="8"
                />
              </div>

              {/* Butonlar */}
              <div className="flex justify-between gap-3">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestion === 0}
                  className="px-6 py-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ← Önceki
                </button>
                
                <div className="flex gap-3">
                  {questions.length > 0 && currentQuestion === questions.length - 1 ? (
                    <button
                      onClick={handleFinishInterview}
                      disabled={isLoading}
                      className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Analiz ediliyor...' : 'Bitir ve Analiz Et'}
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      disabled={questions.length === 0 || currentQuestion >= questions.length - 1}
                      className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      Sonraki →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewSimulation;

