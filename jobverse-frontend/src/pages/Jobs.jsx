import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import JobCard from '../components/JobCard';
import { getJobs, getFilterOptions } from '../services/jobsApi';

const Jobs = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 0 });
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        location: searchParams.get('location') || '',
        employmentType: searchParams.get('employmentType') || '',
        remote: searchParams.get('remote') === 'true',
        sortBy: searchParams.get('sortBy') || 'date'
    });
    const [filterOptions, setFilterOptions] = useState({ employmentTypes: [], locations: [] });

    const fetchJobs = useCallback(async (page = 1) => {
        setIsLoading(true);
        setError(null);
        try {
            const params = {
                page,
                limit: pagination.limit,
                ...filters,
                remote: filters.remote ? 'true' : undefined
            };

            Object.keys(params).forEach(key => !params[key] && delete params[key]);

            const response = await getJobs(params);
            if (response.success) {
                setJobs(response.data);
                setPagination(response.pagination);
            } else {
                setError(response.error);
            }
        } catch (err) {
            setError('İş ilanları yüklenirken bir hata oluştu');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [filters, pagination.limit]);

    useEffect(() => {
        fetchJobs(1);
        const fetchFilters = async () => {
            const options = await getFilterOptions();
            if (options.success) {
                setFilterOptions(options.data);
            }
        };
        fetchFilters();
    }, []);

    useEffect(() => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.set(key, String(value));
        });
        setSearchParams(params);
    }, [filters, setSearchParams]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs(1);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchJobs(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4 transition-colors duration-200">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-2">İş İlanları</h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        {pagination.total} adet ilan bulundu
                    </p>
                </div>

                {/* Filters */}
                <form onSubmit={handleSearch} className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Anahtar kelime..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                        />
                        <input
                            type="text"
                            placeholder="Konum..."
                            value={filters.location}
                            onChange={(e) => handleFilterChange('location', e.target.value)}
                            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                        />
                        <select
                            value={filters.employmentType}
                            onChange={(e) => handleFilterChange('employmentType', e.target.value)}
                            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
                        >
                            <option value="">Tüm Tipler</option>
                            {filterOptions.employmentTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        <label className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={filters.remote}
                                onChange={(e) => handleFilterChange('remote', e.target.checked)}
                                className="rounded text-sky-500 focus:ring-sky-500"
                            />
                            <span className="text-slate-700 dark:text-slate-300">Remote</span>
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="w-full md:w-auto px-6 py-2 bg-[#0f172a] dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-700 text-white rounded-lg font-medium transition-colors"
                    >
                        Ara
                    </button>
                </form>

                {/* Job Grid */}
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-red-500 mb-4">{error}</p>
                        <button onClick={() => fetchJobs(1)} className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600">
                            Tekrar Dene
                        </button>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-slate-600 dark:text-slate-400">Kriterlere uygun ilan bulunamadı.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {jobs.map((job) => (
                                <JobCard key={job._id || job.id} job={job} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                    className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700"
                                >
                                    Önceki
                                </button>
                                <span className="px-4 py-2 text-slate-600 dark:text-slate-400">
                                    {pagination.page} / {pagination.totalPages}
                                </span>
                                <button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page === pagination.totalPages}
                                    className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700"
                                >
                                    Sonraki
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Jobs;
