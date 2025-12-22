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

        // DEBUG: MongoDB'deki gerçek veri yapısını logla
        console.log('=== DEBUG: 1_top_titles sample ===');
        console.log(JSON.stringify(latestInsight['1_top_titles']?.slice(0, 2), null, 2));
        console.log('=== DEBUG: 2_top_cities sample ===');
        console.log(JSON.stringify(latestInsight['2_top_cities']?.slice(0, 2), null, 2));
        console.log('=== DEBUG: 10_posting_days sample ===');
        console.log(JSON.stringify(latestInsight['10_posting_days']?.slice(0, 2), null, 2));

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
        // Python: df['job_is_remote'].value_counts().reset_index().rename(columns={'index': 'is_remote', 'job_is_remote': 'count'})
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
        if (salaryStats && typeof salaryStats === 'object' && typeof salaryStats !== 'string') {
            salaryData = {
                avg_salary: (salaryStats as any).mean_avg || 0,
                min_salary: (salaryStats as any).min_avg || 0,
                max_salary: (salaryStats as any).max_avg || 0
            };
        }

        // Python script field names:
        // 1_top_titles: {job_title: string, count: number}
        // 2_top_cities: {city: string, count: number}
        // 4_top_employers: {employer: string, count: number}
        // 6_publishers: {publisher: string, count: number}
        // 8_top_states: {state: string, count: number}
        // 10_posting_days: {day: string, count: number}
        // 11_experience_levels: {level: string, count: number}
        // 14_employment_types: {type: string, count: number}

        const topTitles = Array.isArray(latestInsight['1_top_titles'])
            ? latestInsight['1_top_titles']
                .filter((item: any) => item.job_title && item.job_title.trim() !== '')
                .map((item: any) => ({
                    title: item.job_title,
                    count: item.count || 0
                }))
            : [];

        const topCities = Array.isArray(latestInsight['2_top_cities'])
            ? latestInsight['2_top_cities']
                .filter((item: any) => item.city && item.city.trim() !== '')
                .map((item: any) => ({
                    city: item.city,
                    count: item.count || 0
                }))
            : [];

        const topStates = Array.isArray(latestInsight['8_top_states'])
            ? latestInsight['8_top_states']
                .filter((item: any) => item.state && item.state.trim() !== '')
                .map((item: any) => ({
                    state: item.state,
                    count: item.count || 0
                }))
            : [];

        const topEmployers = Array.isArray(latestInsight['4_top_employers'])
            ? latestInsight['4_top_employers']
                .filter((item: any) => item.employer && item.employer.trim() !== '')
                .map((item: any) => ({
                    employer: item.employer,
                    count: item.count || 0
                }))
            : [];

        const publishers = Array.isArray(latestInsight['6_publishers'])
            ? latestInsight['6_publishers']
                .filter((item: any) => item.publisher && item.publisher.trim() !== '')
                .map((item: any) => ({
                    publisher: item.publisher,
                    count: item.count || 0
                }))
            : [];

        const postingDays = Array.isArray(latestInsight['10_posting_days'])
            ? latestInsight['10_posting_days']
                .filter((item: any) => item.day && item.day.trim() !== '')
                .map((item: any) => ({
                    day: item.day,
                    count: item.count || 0
                }))
            : [];

        const experienceLevels = Array.isArray(latestInsight['11_experience_levels'])
            ? latestInsight['11_experience_levels']
                .filter((item: any) => item.level && String(item.level).trim() !== '')
                .map((item: any) => ({
                    level: String(item.level),
                    count: item.count || 0
                }))
            : [];

        const employmentTypes = Array.isArray(latestInsight['14_employment_types'])
            ? latestInsight['14_employment_types']
                .filter((item: any) => item.type && item.type.trim() !== '')
                .map((item: any) => ({
                    type: item.type,
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
                topEmployers,
                salaryStats: salaryData,
                publishers,
                topSkills: topSkillsArray,
                topStates,
                educationLevels: educationLevelsArray,
                postingDays,
                experienceLevels,
                softSkills: softSkillsArray,
                skillSalaryRoi: Array.isArray(latestInsight['13_skill_salary_roi'])
                    ? latestInsight['13_skill_salary_roi']
                    : [],
                employmentTypes
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
