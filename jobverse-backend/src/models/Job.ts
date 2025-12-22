import mongoose, { Schema, Document } from 'mongoose';

// Interface matching the raw_jobs_list collection schema (MongoDB uses snake_case)
export interface IJob extends Document {
    id: number;
    job_title: string;
    employer_name: string;
    employer_logo: string | null;
    job_publisher: string;
    job_employment_type: string;
    job_apply_link: string;
    job_description: string;
    job_is_remote: boolean;
    job_posted_at_datetime_utc: Date | null;
    job_location: string;
    job_city: string;
    job_state: string;
    job_country: string;
    job_benefits: string[] | null;
    job_google_link: string;
    job_salary: number | null;
    job_min_salary: number | null;
    job_max_salary: number | null;
    job_salary_period: string | null;
    job_highlights: {
        Qualifications?: string[];
        Benefits?: string[];
        Responsibilities?: string[];
    };
    job_onet_soc: number;
}

// Transform snake_case to camelCase for frontend compatibility
export const transformJobForFrontend = (job: any) => {
    if (!job) return null;
    return {
        _id: job._id,
        id: job.id,
        jobTitle: job.job_title,
        employerName: job.employer_name,
        employerLogo: job.employer_logo || null,
        jobPublisher: job.job_publisher,
        jobEmploymentType: job.job_employment_type,
        jobApplyLink: job.job_apply_link,
        jobDescription: job.job_description,
        jobIsRemote: job.job_is_remote,
        jobPostedAtDatetimeUtc: job.job_posted_at_datetime_utc,
        jobLocation: job.job_location,
        jobCity: job.job_city,
        jobState: job.job_state,
        jobCountry: job.job_country,
        jobBenefits: job.job_benefits,
        jobGoogleLink: job.job_google_link,
        jobSalary: job.job_salary,
        jobMinSalary: job.job_min_salary,
        jobMaxSalary: job.job_max_salary,
        jobSalaryPeriod: job.job_salary_period,
        jobHighlights: job.job_highlights,
        jobOnetSoc: job.job_onet_soc,
    };
};

const JobSchema: Schema = new Schema({
    id: { type: Number, required: true },
    job_title: { type: String, required: true },
    employer_name: { type: String },
    employer_logo: { type: String },
    job_publisher: { type: String },
    job_employment_type: { type: String },
    job_apply_link: { type: String },
    job_description: { type: String },
    job_is_remote: { type: Boolean, default: false },
    job_posted_at_datetime_utc: { type: Date },
    job_location: { type: String },
    job_city: { type: String },
    job_state: { type: String },
    job_country: { type: String },
    job_benefits: { type: [String] },
    job_google_link: { type: String },
    job_salary: { type: Number },
    job_min_salary: { type: Number },
    job_max_salary: { type: Number },
    job_salary_period: { type: String },
    job_highlights: {
        Qualifications: { type: [String] },
        Benefits: { type: [String] },
        Responsibilities: { type: [String] },
    },
    job_onet_soc: { type: Number },
}, {
    collection: 'raw_jobs_list',
    timestamps: false,
});

JobSchema.index({
    job_title: 'text',
    job_description: 'text',
    employer_name: 'text'
});

export const Job = mongoose.model<IJob>('Job', JobSchema);
