// Jobs API Service - connects to backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Get all jobs with pagination and filtering
 */
export async function getJobs(params = {}) {
    try {
        const queryParams = new URLSearchParams();

        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.search) queryParams.append('search', params.search);
        if (params.country && params.country !== 'Tümü') queryParams.append('country', params.country);
        if (params.employmentType && params.employmentType !== 'Tümü') queryParams.append('employmentType', params.employmentType);
        if (params.isRemote) queryParams.append('isRemote', params.isRemote);
        if (params.minSalary) queryParams.append('minSalary', params.minSalary);
        if (params.maxSalary) queryParams.append('maxSalary', params.maxSalary);

        const response = await fetch(`${API_BASE_URL}/jobs?${queryParams.toString()}`);
        const data = await response.json();

        return data;
    } catch (error) {
        console.error('getJobs error:', error);
        return { success: false, error: 'İş ilanları alınırken hata oluştu' };
    }
}

/**
 * Get a single job by ID
 */
export async function getJobById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/jobs/${id}`);
        const data = await response.json();

        return data;
    } catch (error) {
        console.error('getJobById error:', error);
        return { success: false, error: 'İş ilanı alınırken hata oluştu' };
    }
}

/**
 * Get filter options (countries, employment types)
 */
export async function getFilterOptions() {
    try {
        const response = await fetch(`${API_BASE_URL}/jobs/filters`);
        const data = await response.json();

        return data;
    } catch (error) {
        console.error('getFilterOptions error:', error);
        return { success: false, error: 'Filtre seçenekleri alınırken hata oluştu' };
    }
}
