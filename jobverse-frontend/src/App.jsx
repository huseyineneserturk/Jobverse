import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import ScrollToTop from './components/ScrollToTop';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Analytics from './pages/Analytics';
import About from './pages/About';
import AuthPage from './pages/AuthPage.jsx';
import Profile from './pages/Profile.jsx';
import SavedJobs from './pages/SavedJobs.jsx';
import CVUpload from './pages/CVUpload.jsx';
import InterviewSimulation from './pages/InterviewSimulation.jsx';
import { useTheme } from './context/ThemeContext.jsx';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';
  const { isDark } = useTheme();

  return (
    <div className={`${isDark ? 'dark' : ''} min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200`}>
      <ScrollToTop />
      
      {/* Header her sayfada sabit, AuthPage hariç */}
      {!isAuthPage && <Header />}

      {/* Chatbot - AuthPage hariç tüm sayfalarda */}
      {!isAuthPage && <Chatbot />}

      <main>
        <Routes>
          {/* Ana Sayfa (Tam Ekran) */}
          <Route path="/" element={<Home />} />

          {/* Auth Sayfasi */}
          <Route path="/auth" element={<AuthPage />} />
          
          {/* İlanlar Listesi (Kenarlardan boşluklu container içinde) */}
          <Route path="/jobs" element={
            <div className="max-w-7xl mx-auto p-6 md:p-12 bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
              <Jobs />
            </div>
          } />
          
          {/* İlan Detay Sayfası (Tam Ekran - Kendi header'ı var) */}
          <Route path="/jobs/:id" element={<JobDetail />} />
          
          {/* Diğer Sayfalar */}
          <Route path="/analytics" element={
            <div className="max-w-7xl mx-auto p-6 bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
              <Analytics />
            </div>
          } />
          
          <Route path="/about" element={
            <div className="max-w-7xl mx-auto p-6 bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
              <About />
            </div>
          } />

          {/* Profil Düzenleme Sayfası */}
          <Route path="/profile" element={
            <div className="max-w-7xl mx-auto bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
              <Profile />
            </div>
          } />

          {/* Kaydedilen İlanlar Sayfası */}
          <Route path="/saved-jobs" element={
            <div className="max-w-7xl mx-auto bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
              <SavedJobs />
            </div>
          } />

                 {/* CV Yükleme Sayfası */}
                 <Route path="/cv-upload" element={
                   <div className="max-w-7xl mx-auto bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
                     <CVUpload />
                   </div>
                 } />

                 {/* Mülakat Simülasyonu Sayfası */}
                 <Route path="/interview-simulation" element={
                   <div className="max-w-7xl mx-auto bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
                     <InterviewSimulation />
                   </div>
                 } />
               </Routes>
             </main>

    </div>
  );
}

export default App;