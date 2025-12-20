import { Request, Response } from 'express';
import { Job, transformJobForFrontend } from '../models/Job';
import mongoose from 'mongoose';

/**
 * Get paginated job listings
 * GET /api/jobs
 */
export const getJobs = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        // Build query filters (use snake_case for MongoDB)
        const filters: any = {};

        if (req.query.search) {
            filters.$or = [
                { job_title: { $regex: req.query.search, $options: 'i' } },
                { job_description: { $regex: req.query.search, $options: 'i' } },
                { employer_name: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        if (req.query.location) {
            filters.$or = filters.$or || [];
            filters.$or.push(
                { job_city: { $regex: req.query.location, $options: 'i' } },
                { job_state: { $regex: req.query.location, $options: 'i' } },
                { job_country: { $regex: req.query.location, $options: 'i' } }
            );
        }

        if (req.query.employmentType) {
            filters.job_employment_type = req.query.employmentType;
        }

        if (req.query.remote === 'true') {
            filters.job_is_remote = true;
        }

        // Build sort (use snake_case for MongoDB)
        let sort: any = { job_posted_at_datetime_utc: -1 };
        if (req.query.sortBy === 'salary') {
            sort = { job_max_salary: -1 };
        } else if (req.query.sortBy === 'title') {
            sort = { job_title: 1 };
        }

        const [jobs, total] = await Promise.all([
            Job.find(filters).sort(sort).skip(skip).limit(limit).lean(),
            Job.countDocuments(filters)
        ]);

        // Transform to camelCase for frontend
        const transformedJobs = jobs.map(transformJobForFrontend);

        res.json({
            success: true,
            data: transformedJobs,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('getJobs error:', error);
        res.status(500).json({
            success: false,
            error: 'İş ilanları alınırken bir hata oluştu'
        });
    }
};

/**
 * Get single job by ID
 * GET /api/jobs/:id
 */
export const getJobById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        let job = null;

        // Check if id is a valid MongoDB ObjectId
        if (mongoose.Types.ObjectId.isValid(id)) {
            job = await Job.findById(id).lean();
        }

        // If not found by ObjectId, try numeric id
        if (!job) {
            const numericId = parseInt(id);
            if (!isNaN(numericId)) {
                job = await Job.findOne({ id: numericId }).lean();
            }
        }

        if (!job) {
            res.status(404).json({
                success: false,
                error: 'İş ilanı bulunamadı'
            });
            return;
        }

        // Transform to camelCase for frontend
        const transformedJob = transformJobForFrontend(job);

        res.json({
            success: true,
            data: transformedJob
        });
    } catch (error) {
        console.error('getJobById error:', error);
        res.status(500).json({
            success: false,
            error: 'İş ilanı alınırken bir hata oluştu'
        });
    }
};

/**
 * Get filter options
 * GET /api/jobs/filters
 */
export const getFilterOptions = async (req: Request, res: Response): Promise<void> => {
    try {
        const [employmentTypes, locations] = await Promise.all([
            Job.distinct('job_employment_type'),
            Job.distinct('job_city')
        ]);

        res.json({
            success: true,
            data: {
                employmentTypes: employmentTypes.filter(Boolean),
                locations: locations.filter(Boolean).slice(0, 50)
            }
        });
    } catch (error) {
        console.error('getFilterOptions error:', error);
        res.status(500).json({
            success: false,
            error: 'Filtre seçenekleri alınırken bir hata oluştu'
        });
    }
};
