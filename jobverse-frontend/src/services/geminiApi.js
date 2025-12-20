// Gemini AI API Service - uses backend proxy for security
import { authenticatedFetch } from './authApi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Generate interview questions based on job data
 */
export async function generateInterviewQuestions(jobData) {
    try {
        const response = await authenticatedFetch('/ai/interview-questions', {
            method: 'POST',
            body: JSON.stringify({ jobData })
        });

        const data = await response.json();

        if (data.success) {
            return data.data;
        }

        return getMockQuestions();
    } catch (error) {
        console.error('generateInterviewQuestions error:', error);
        return getMockQuestions();
    }
}

/**
 * Analyze interview answers
 */
export async function analyzeAnswer(jobData, answers) {
    try {
        const response = await authenticatedFetch('/ai/analyze-answers', {
            method: 'POST',
            body: JSON.stringify({ jobData, answers })
        });

        const data = await response.json();

        if (data.success) {
            return data.data;
        }

        return getMockAnalysis();
    } catch (error) {
        console.error('analyzeAnswer error:', error);
        return getMockAnalysis();
    }
}

/**
 * Chat with AI assistant
 */
export async function chatWithAI(message, context = null) {
    try {
        const response = await fetch(`${API_BASE_URL}/ai/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, context })
        });

        const data = await response.json();

        if (data.success) {
            return data.data.response;
        }

        return 'Üzgünüm, şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin.';
    } catch (error) {
        console.error('chatWithAI error:', error);
        return 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
    }
}

/**
 * Calculate job match score
 */
export async function calculateJobMatch(userProfile, jobData) {
    try {
        const response = await authenticatedFetch('/ai/job-match', {
            method: 'POST',
            body: JSON.stringify({ userProfile, jobData })
        });

        const data = await response.json();

        if (data.success) {
            return data.data;
        }

        return getMockJobMatch();
    } catch (error) {
        console.error('calculateJobMatch error:', error);
        return getMockJobMatch();
    }
}

// Mock data for fallback
function getMockQuestions() {
    return [
        'Kendinizi kısaca tanıtır mısınız?',
        'Bu pozisyon için neden uygun olduğunuzu düşünüyorsunuz?',
        'En güçlü teknik yetenekleriniz nelerdir?',
        'Zor bir projede nasıl problem çözüyorsunuz?',
        'Takım çalışması konusundaki deneyimleriniz nelerdir?',
        'Son projelerinizden birini detaylı olarak anlatır mısınız?',
        'Kariyer hedefleriniz nelerdir?',
    ];
}

function getMockAnalysis() {
    return {
        overallScore: 75,
        feedback: 'Cevaplarınız genel olarak iyi. Bazı alanlarda daha detaylı açıklamalar yapabilirsiniz.',
        suggestions: [
            'Teknik yeteneklerinizi daha somut örneklerle destekleyin',
            'Takım çalışması deneyimlerinizi detaylandırın',
            'Proje örneklerinizde ölçülebilir sonuçlar belirtin',
        ],
    };
}

function getMockJobMatch() {
    return {
        matchScore: 72,
        matchedSkills: ['JavaScript', 'React', 'Problem çözme'],
        missingSkills: ['TypeScript', 'AWS'],
        summary: 'Profiliniz bu pozisyon için uygun görünüyor.',
        recommendations: ['TypeScript öğrenmeyi düşünün', 'Bulut teknolojileri deneyimi ekleyin'],
    };
}
