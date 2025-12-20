import { Router } from 'express';
import { getAnalytics, getChartData, getSkillsData, getSalaryData } from '../controllers/analyticsController';

const router = Router();

// GET /api/analytics - Get all analytics data
router.get('/', getAnalytics);

// GET /api/analytics/charts - Get chart-ready data
router.get('/charts', getChartData);

// GET /api/analytics/skills - Get skills data
router.get('/skills', getSkillsData);

// GET /api/analytics/salaries - Get salary data
router.get('/salaries', getSalaryData);

export default router;
