import { Router } from 'express';
import { getJobs, getJobById, getFilterOptions } from '../controllers/jobController';

const router = Router();

// GET /api/jobs - Get paginated job listings
router.get('/', getJobs);

// GET /api/jobs/filters - Get filter options
router.get('/filters', getFilterOptions);

// GET /api/jobs/:id - Get single job by ID
router.get('/:id', getJobById);

export default router;
