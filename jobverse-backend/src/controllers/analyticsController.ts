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

        res.json({
            success: true,
            data: {
                reportDate: latestInsight.report_date,
                totalJobsAnalyzed: latestInsight.total_jobs_analyzed,
                topTitles: latestInsight['1_top_titles'],
                topCities: latestInsight['2_top_cities'],
                remoteStats: latestInsight['3_remote_stats'],
                topEmployers: latestInsight['4_top_employers'],
                salaryStats: latestInsight['5_salary_stats'],
                publishers: latestInsight['6_publishers'],
                topSkills: topSkillsArray,
                topStates: latestInsight['8_top_states'],
                educationLevels: latestInsight['9_education_levels'],
                postingDays: latestInsight['10_posting_days'],
                experienceLevels: latestInsight['11_experience_levels'],
                softSkills: latestInsight['12_soft_skills'],
                skillSalaryRoi: latestInsight['13_skill_salary_roi'],
                employmentTypes: latestInsight['14_employment_types']
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
