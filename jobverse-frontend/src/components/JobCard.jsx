import { Link } from 'react-router-dom';
import { timeAgo } from '../utils/dateUtils';
import { useSavedJobs } from '../context/SavedJobsContext';
import { useAuth } from '../context/AuthContext';

const JobCard = ({ job }) => {
  const { isJobSaved, saveJob, removeJob } = useSavedJobs();
  const { isAuthenticated } = useAuth();

  // MongoDB uses _id, fallback to id for compatibility
  const jobId = job._id || job.id;
  const saved = isJobSaved(jobId);

  const handleSaveToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      // Kullanıcı giriş yapmamışsa, login sayfasına yönlendir
      window.location.href = '/auth';
      return;
    }

    // Save job with consistent id field
    const jobToSave = { ...job, id: jobId };

    if (saved) {
      removeJob(jobId);
    } else {
      saveJob(jobToSave);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] dark:shadow-[0_2px_10px_-3px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-slate-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group relative">

      {/* Minimal Kaydet Butonu */}
      {isAuthenticated && (
        <button
          onClick={handleSaveToggle}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1"
          aria-label={saved ? 'Kaydedilenlerden çıkar' : 'Kaydet'}
          title={saved ? 'Kaydedilenlerden çıkar' : 'Kaydet'}
        >
          {saved ? (
            <svg className="w-5 h-5 text-sky-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-slate-400 hover:text-slate-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          )}
        </button>
      )}

      <div className="p-6 flex-grow">
        {/* Header: Firma & Tarih */}
        <div className="flex justify-between items-start mb-4 pr-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-200 text-sm transition-colors duration-200">
              {job.employerName || "Gizli Firma"}
            </span>
          </div>
          <span className="text-slate-400 dark:text-slate-500 text-xs font-medium bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded whitespace-nowrap transition-colors duration-200">
            {timeAgo(job.jobPostedAtDatetimeUtc)}
          </span>
        </div>

        {/* --- BAŞLIK ARTIK LİNK OLDU --- */}
        <Link to={`/jobs/${jobId}`} className="block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 leading-snug cursor-pointer transition-colors duration-200">
            {job.jobTitle}
          </h2>
        </Link>

        {/* Etiketler */}
        <div className="flex flex-wrap gap-2 mb-5">
          <div className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-md bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-600 transition-colors duration-200">
            <svg className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.jobCity || "Konum Yok"}, {job.jobCountry}
          </div>

          <div className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-md bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-600 transition-colors duration-200">
            <svg className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {job.jobEmploymentType}
          </div>

          {job.jobIsRemote && (
            <div className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-md bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-800 transition-colors duration-200">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Uzaktan
            </div>
          )}
        </div>

        {/* Nitelikler */}
        {job.jobHighlights?.Qualifications && (
          <div className="border-t border-slate-100 dark:border-slate-700 pt-4 transition-colors duration-200">
            <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 transition-colors duration-200">Aranan Nitelikler</h4>
            <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5 transition-colors duration-200">
              {job.jobHighlights.Qualifications.slice(0, 2).map((qual, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="mt-1 w-1 h-1 rounded-full bg-indigo-400 flex-shrink-0"></span>
                  <span className="line-clamp-1">{qual}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Buton */}
      <div className="p-6 pt-0 mt-auto">
        <a
          href={job.jobApplyLink}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-indigo-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300"
        >
          <span>Başvur</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default JobCard;