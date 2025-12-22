import { Request, Response } from 'express';
import { DailyInsight } from '../models/DailyInsight';

/**
 * Get all analytics data (raw format)
 * GET /api/analytics
 */
export const getAnalytics = async (req: Request, res: Response): Promise<void> => {
    try {
        const latestInsight = await DailyInsight.findOne().sort({ report_date: -1 }).lean();

        if (!latestInsight) {
            res.status(404).json({
                success: false,
                error: 'Analiz verisi bulunamadı'
            });
            return;
        }

        res.json({
            success: true,
            data: latestInsight
        });
    } catch (error) {
        console.error('getAnalytics error:', error);
        res.status(500).json({
            success: false,
            error: 'Analiz verileri alınırken bir hata oluştu'
        });
    }
};

/**
 * Get chart-ready analytics data
 * GET /api/analytics/charts
 */
export const getChartData = async (req: Request, res: Response): Promise<void> => {
    try {
        const latestInsight = await DailyInsight.findOne().sort({ report_date: -1 }).lean();

        if (!latestInsight) {
            res.status(404).json({
                success: false,
                error: 'Analiz verisi bulunamadı'
            });
            return;
        }

        // Transform skills object to array format
        const topSkillsArray = latestInsight['7_top_skills']
            ? Object.entries(latestInsight['7_top_skills'] as Record<string, number>)
                .map(([skill, count]) => ({ skill, count }))
                .sort((a, b) => b.count - a.count)
            : [];

        // Transform soft skills object to array format
        const softSkillsArray = latestInsight['12_soft_skills']
            ? Object.entries(latestInsight['12_soft_skills'] as Record<string, number>)
                .map(([skill, count]) => ({ skill, count }))
                .sort((a, b) => b.count - a.count)
            : [];

        // Transform education levels object to array format
        const educationLevelsArray = latestInsight['9_education_levels']
            ? Object.entries(latestInsight['9_education_levels'] as Record<string, number>)
                .map(([level, count]) => ({ level, count }))
                .sort((a, b) => b.count - a.count)
            : [];

        // Transform remote stats to proper format
        const remoteStats = latestInsight['3_remote_stats'];
        let remoteData = { remote_count: 0, office_count: 0 };
        if (Array.isArray(remoteStats)) {
            remoteStats.forEach((item: any) => {
                if (item.is_remote === true) {
                    remoteData.remote_count = item.count || 0;
                } else if (item.is_remote === false) {
                    remoteData.office_count = item.count || 0;
                }
            });
        }

        // Transform salary stats
        const salaryStats = latestInsight['5_salary_stats'];
        let salaryData = { avg_salary: 0, min_salary: 0, max_salary: 0 };
        if (salaryStats && typeof salaryStats === 'object') {
            salaryData = {
                avg_salary: (salaryStats as any).mean_avg || 0,
                min_salary: (salaryStats as any).min_avg || 0,
                max_salary: (salaryStats as any).max_avg || 0
            };
        }

        // Transform top titles - fix field names
        const topTitles = Array.isArray(latestInsight['1_top_titles'])
            ? latestInsight['1_top_titles'].map((item: any) => ({
                title: item.job_title || item.title || 'Bilinmiyor',
                count: item.count || 0
            }))
            : [];

        // Transform top cities - fix field names
        const topCities = Array.isArray(latestInsight['2_top_cities'])
            ? latestInsight['2_top_cities'].map((item: any) => ({
                city: item.city || item.job_city || 'Bilinmiyor',
                count: item.count || 0
            }))
            : [];

        // Transform top states - fix field names
        const topStates = Array.isArray(latestInsight['8_top_states'])
            ? latestInsight['8_top_states'].map((item: any) => ({
                state: item.state || item.job_state || 'Bilinmiyor',
                count: item.count || 0
            }))
            : [];

        // Transform posting days
        const postingDays = Array.isArray(latestInsight['10_posting_days'])
            ? latestInsight['10_posting_days'].map((item: any) => ({
                day: item.day || item.day_name || 'Bilinmiyor',
                count: item.count || 0
            }))
            : [];

        // Transform experience levels
        const experienceLevels = Array.isArray(latestInsight['11_experience_levels'])
            ? latestInsight['11_experience_levels'].map((item: any) => ({
                level: item.level || item.exp_level || 'Bilinmiyor',
                count: item.count || 0
            }))
            : [];

        res.json({
            success: true,
            data: {
                reportDate: latestInsight.report_date,
                totalJobsAnalyzed: latestInsight.total_jobs_analyzed || 0,
                topTitles,
                topCities,
                remoteStats: remoteData,
                topEmployers: latestInsight['4_top_employers'] || [],
                salaryStats: salaryData,
                publishers: latestInsight['6_publishers'] || [],
                topSkills: topSkillsArray,
                topStates,
                educationLevels: educationLevelsArray,
                postingDays,
                experienceLevels,
                softSkills: softSkillsArray,
                skillSalaryRoi: Array.isArray(latestInsight['13_skill_salary_roi'])
                    ? latestInsight['13_skill_salary_roi']
                    : [],
                employmentTypes: latestInsight['14_employment_types'] || []
            }
        });
    } catch (error) {
        console.error('getChartData error:', error);
        res.status(500).json({
            success: false,
            error: 'Grafik verileri alınırken bir hata oluştu'
        });
    }
};

/**
 * Get top skills data
 * GET /api/analytics/skills
 */
export const getSkillsData = async (req: Request, res: Response): Promise<void> => {
    try {
        const latestInsight = await DailyInsight.findOne().sort({ report_date: -1 }).lean();

        if (!latestInsight) {
            res.status(404).json({
                success: false,
                error: 'Analiz verisi bulunamadı'
            });
            return;
        }

        const topSkills = latestInsight['7_top_skills']
            ? Object.entries(latestInsight['7_top_skills'] as Record<string, number>)
                .map(([skill, count]) => ({ skill, count }))
                .sort((a, b) => b.count - a.count)
            : [];

        const softSkills = latestInsight['12_soft_skills']
            ? Object.entries(latestInsight['12_soft_skills'] as Record<string, number>)
                .map(([skill, count]) => ({ skill, count }))
                .sort((a, b) => b.count - a.count)
            : [];

        res.json({
            success: true,
            data: {
                topSkills,
                softSkills,
                skillSalaryRoi: latestInsight['13_skill_salary_roi']
            }
        });
    } catch (error) {
        console.error('getSkillsData error:', error);
        res.status(500).json({
            success: false,
            error: 'Yetenek verileri alınırken bir hata oluştu'
        });
    }
};

/**
 * Get salary statistics
 * GET /api/analytics/salaries
 */
export const getSalaryData = async (req: Request, res: Response): Promise<void> => {
    try {
        const latestInsight = await DailyInsight.findOne().sort({ report_date: -1 }).lean();

        if (!latestInsight) {
            res.status(404).json({
                success: false,
                error: 'Analiz verisi bulunamadı'
            });
            return;
        }

        res.json({
            success: true,
            data: {
                salaryStats: latestInsight['5_salary_stats'],
                skillSalaryRoi: latestInsight['13_skill_salary_roi']
            }
        });
    } catch (error) {
        console.error('getSalaryData error:', error);
        res.status(500).json({
            success: false,
            error: 'Maaş verileri alınırken bir hata oluştu'
        });
    }
};
