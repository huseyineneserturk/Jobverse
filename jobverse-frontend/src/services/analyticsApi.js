// Analytics API Service - connects to backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Get all analytics data
 */
export async function getAnalytics() {
    try {
        const response = await fetch(`${API_BASE_URL}/analytics`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('getAnalytics error:', error);
        return { success: false, error: 'Analiz verileri alınırken hata oluştu' };
    }
}

/**
 * Get chart data for analytics page
 */
export async function getChartData() {
    try {
        const response = await fetch(`${API_BASE_URL}/analytics/charts`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('getChartData error:', error);
        return { success: false, error: 'Grafik verileri alınırken hata oluştu' };
    }
}

/**
 * Get top skills data
 */
export async function getSkillsData() {
    try {
        const response = await fetch(`${API_BASE_URL}/analytics/skills`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('getSkillsData error:', error);
        return { success: false, error: 'Yetenek verileri alınırken hata oluştu' };
    }
}

/**
 * Get salary statistics
 */
export async function getSalaryData() {
    try {
        const response = await fetch(`${API_BASE_URL}/analytics/salaries`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('getSalaryData error:', error);
        return { success: false, error: 'Maaş verileri alınırken hata oluştu' };
    }
}
