import mongoose, { Schema, Document } from 'mongoose';

// Interface matching the daily_insights collection schema
export interface IDailyInsight extends Document {
    report_date: Date;
    query: string;
    total_jobs_analyzed: number;
    '1_top_titles': Array<{ job_title: string; count: number }>;
    '2_top_cities': Array<{ city: string; count: number }>;
    '3_remote_stats': Array<{ is_remote: boolean; count: number }>;
    '4_top_employers': Array<{ employer: string; count: number }>;
    '5_salary_stats': {
        min_avg: number;
        max_avg: number;
        mean_avg: number;
        sample_size: number;
    } | string;
    '6_publishers': Array<{ publisher: string; count: number }>;
    '7_top_skills': Record<string, number>;
    '8_top_states': Array<{ state: string; count: number }>;
    '9_education_levels': Record<string, number>;
    '10_posting_days': Array<{ day: string; count: number }>;
    '11_experience_levels': Array<{ level: string; count: number }>;
    '12_soft_skills': Record<string, number>;
    '13_skill_salary_roi': Array<{ skill: string; avg_salary: number }> | string;
    '14_employment_types': Array<{ type: string; count: number }>;
}

const DailyInsightSchema: Schema = new Schema({
    report_date: { type: Date, required: true },
    query: { type: String },
    total_jobs_analyzed: { type: Number },
    '1_top_titles': { type: Array },
    '2_top_cities': { type: Array },
    '3_remote_stats': { type: Array },
    '4_top_employers': { type: Array },
    '5_salary_stats': { type: Schema.Types.Mixed },
    '6_publishers': { type: Array },
    '7_top_skills': { type: Schema.Types.Mixed },
    '8_top_states': { type: Array },
    '9_education_levels': { type: Schema.Types.Mixed },
    '10_posting_days': { type: Array },
    '11_experience_levels': { type: Array },
    '12_soft_skills': { type: Schema.Types.Mixed },
    '13_skill_salary_roi': { type: Schema.Types.Mixed },
    '14_employment_types': { type: Array },
}, {
    collection: 'daily_insights',
    timestamps: false,
});

export const DailyInsight = mongoose.model<IDailyInsight>('DailyInsight', DailyInsightSchema);
