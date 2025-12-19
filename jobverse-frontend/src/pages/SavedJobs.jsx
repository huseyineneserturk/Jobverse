import { useNavigate, Link } from 'react-router-dom';
import { useSavedJobs } from '../context/SavedJobsContext';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/JobCard';

const SavedJobs = () => {
  const { savedJobs, isLoading, removeJob } = useSavedJobs();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  if (!isAuthenticated) {
    navigate('/auth');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Başlık */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3 transition-colors duration-200">
                <svg className="w-8 h-8 text-sky-600 dark:text-sky-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                </svg>
                Kaydedilen İlanlar
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg transition-colors duration-200">
                {savedJobs.length > 0
                  ? `${savedJobs.length} ilan kayıtlı`
                  : 'Henüz kaydedilmiş ilan yok'}
              </p>
            </div>
          </div>
        </div>

        {/* İlan Listesi */}
        {savedJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center transition-colors duration-200">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-200">
                <svg className="w-12 h-12 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 transition-colors duration-200">Henüz kaydedilmiş ilan yok</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 transition-colors duration-200">
                Beğendiğiniz ilanları kaydederek daha sonra kolayca bulabilirsiniz.
              </p>
              <Link
                to="/jobs"
                className="inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                İlanları Keşfet
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;

