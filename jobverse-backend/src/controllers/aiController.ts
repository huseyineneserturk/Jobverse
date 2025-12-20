import { Request, Response } from 'express';
import { config } from '../config/environment';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Gemini API response interface
interface GeminiResponse {
    candidates?: Array<{
        content?: {
            parts?: Array<{
                text?: string;
            }>;
        };
    }>;
}

/**
 * Generate interview questions based on job data
 * POST /api/ai/interview-questions
 */
export const generateInterviewQuestions = async (req: Request, res: Response): Promise<void> => {
    try {
        const { jobData } = req.body;

        if (!config.geminiApiKey) {
            // Return mock questions if no API key
            res.json({
                success: true,
                data: getMockQuestions(),
            });
            return;
        }

        const prompt = `
      Aşağıdaki iş ilanı için profesyonel mülakat soruları oluştur.
      İş İlanı Başlığı: ${jobData?.title || 'Yazılım Geliştirici'}
      Şirket: ${jobData?.company || 'Teknoloji Şirketi'}
      Açıklama: ${jobData?.description || ''}
      
      SADECE 5-7 adet mülakat sorusu yaz. Her satıra bir soru.
      Giriş cümlesi, açıklama veya kapanış yazma. SADECE sorular.
      Örnek format:
      Bu pozisyon için neden uygun olduğunuzu düşünüyorsunuz?
      Ekip çalışması deneyimlerinizden bahseder misiniz?
    `;

        const response = await fetch(`${GEMINI_API_URL}?key=${config.geminiApiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
            }),
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json() as GeminiResponse;
        const questionsText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // Giriş cümlelerini filtrele
        const excludePatterns = [
            /^(işte|buyrun|elbette|tabii|merhaba|aşağıda)/i,
            /^(mülakat|soru|örnek)/i,
            /^[\*\-\•]/,
        ];

        const questions = questionsText
            .split('\n')
            .map((line: string) => line.replace(/^[\d\*\-\•\.]+\s*/, '').trim())
            .filter((line: string) => {
                if (line.length < 15) return false;
                if (!line.includes('?')) return false;
                for (const pattern of excludePatterns) {
                    if (pattern.test(line)) return false;
                }
                return true;
            })
            .slice(0, 7);

        res.json({
            success: true,
            data: questions.length > 0 ? questions : getMockQuestions(),
        });
    } catch (error) {
        console.error('generateInterviewQuestions error:', error);
        res.json({
            success: true,
            data: getMockQuestions(),
        });
    }
};

/**
 * Analyze interview answers
 * POST /api/ai/analyze-answers
 */
export const analyzeInterviewAnswers = async (req: Request, res: Response): Promise<void> => {
    try {
        const { jobData, answers } = req.body;

        if (!config.geminiApiKey) {
            res.json({
                success: true,
                data: getMockAnalysis(),
            });
            return;
        }

        const prompt = `
      Aşağıdaki iş ilanı için verilen mülakat cevaplarını analiz et ve geri bildirim sağla.
      
      İş İlanı: ${jobData?.title || 'Yazılım Geliştirici'}
      Şirket: ${jobData?.company || 'Teknoloji Şirketi'}
      
      Sorular ve Cevaplar:
      ${(answers || []).map((answer: any, index: number) => `
        Soru ${index + 1}: ${answer.question || ''}
        Cevap: ${answer.answer || ''}
      `).join('\n')}
      
      Lütfen şu formatta JSON döndür:
      {
        "overallScore": 0-100 arası sayı,
        "feedback": "Genel geri bildirim metni",
        "suggestions": ["Öneri 1", "Öneri 2", "Öneri 3"]
      }
    `;

        const response = await fetch(`${GEMINI_API_URL}?key=${config.geminiApiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
            }),
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json() as GeminiResponse;
        const analysisText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        try {
            const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                res.json({
                    success: true,
                    data: JSON.parse(jsonMatch[0]),
                });
                return;
            }
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
        }

        res.json({
            success: true,
            data: getMockAnalysis(),
        });
    } catch (error) {
        console.error('analyzeInterviewAnswers error:', error);
        res.json({
            success: true,
            data: getMockAnalysis(),
        });
    }
};

/**
 * Chat with AI assistant
 * POST /api/ai/chat
 */
export const chatWithAI = async (req: Request, res: Response): Promise<void> => {
    try {
        const { message, context } = req.body;

        if (!config.geminiApiKey) {
            res.json({
                success: true,
                data: {
                    response: 'AI asistan şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.',
                },
            });
            return;
        }

        const prompt = `
      Sen Jobverse platformunun kariyer asistanısın. Kullanıcılara iş arama, CV hazırlama ve mülakat konularında yardım ediyorsun.
      
      ${context ? `Bağlam: ${context}` : ''}
      
      Kullanıcı mesajı: ${message}
      
      Türkçe ve yardımcı bir şekilde cevap ver. Kısa ve öz yanıtlar ver.
    `;

        const response = await fetch(`${GEMINI_API_URL}?key=${config.geminiApiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
            }),
        });

        // Rate limit hatası kontrolü
        if (response.status === 429) {
            console.warn('Gemini API rate limit reached');
            res.json({
                success: true,
                data: {
                    response: '⏳ AI asistan şu anda çok yoğun. Lütfen birkaç saniye bekleyip tekrar deneyin.',
                    isRateLimited: true,
                },
            });
            return;
        }

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json() as GeminiResponse;
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Üzgünüm, şu anda yanıt veremiyorum.';

        res.json({
            success: true,
            data: { response: responseText },
        });
    } catch (error) {
        console.error('chatWithAI error:', error);
        res.json({
            success: true,
            data: {
                response: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
            },
        });
    }
};

// Mock data functions
function getMockQuestions(): string[] {
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

/**
 * Calculate job match score based on user profile and job requirements
 * POST /api/ai/job-match
 */
export const calculateJobMatch = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userProfile, jobData } = req.body;

        if (!config.geminiApiKey) {
            res.json({
                success: true,
                data: getMockJobMatch(),
            });
            return;
        }

        const prompt = `
      Aşağıdaki kullanıcı profili ve iş ilanı için uygunluk analizi yap.
      
      Kullanıcı Profili:
      - Yetenekler: ${userProfile?.skills?.join(', ') || 'Belirtilmemiş'}
      - Deneyim: ${userProfile?.experience || 'Belirtilmemiş'}
      - Eğitim: ${userProfile?.education || 'Belirtilmemiş'}
      - Tercih edilen konum: ${userProfile?.preferredLocation || 'Belirtilmemiş'}
      
      İş İlanı:
      - Başlık: ${jobData?.title || 'Belirtilmemiş'}
      - Şirket: ${jobData?.company || 'Belirtilmemiş'}
      - Açıklama: ${jobData?.description?.substring(0, 1000) || 'Belirtilmemiş'}
      - Konum: ${jobData?.location || 'Belirtilmemiş'}
      - Remote: ${jobData?.isRemote ? 'Evet' : 'Hayır'}
      
      Lütfen şu formatta JSON döndür:
      {
        "matchScore": 0-100 arası sayı (uygunluk skoru),
        "matchedSkills": ["Eşleşen yetenek 1", "Eşleşen yetenek 2"],
        "missingSkills": ["Eksik yetenek 1", "Eksik yetenek 2"],
        "summary": "Kısa uygunluk özeti",
        "recommendations": ["Öneri 1", "Öneri 2"]
      }
    `;

        const response = await fetch(`${GEMINI_API_URL}?key=${config.geminiApiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
            }),
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json() as GeminiResponse;
        const analysisText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        try {
            const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                res.json({
                    success: true,
                    data: JSON.parse(jsonMatch[0]),
                });
                return;
            }
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
        }

        res.json({
            success: true,
            data: getMockJobMatch(),
        });
    } catch (error) {
        console.error('calculateJobMatch error:', error);
        res.json({
            success: true,
            data: getMockJobMatch(),
        });
    }
};

function getMockJobMatch() {
    return {
        matchScore: 72,
        matchedSkills: ['JavaScript', 'React', 'Problem çözme'],
        missingSkills: ['TypeScript', 'AWS'],
        summary: 'Profiliniz bu pozisyon için uygun görünüyor. Teknik yetenekleriniz pozisyonun gereksinimlerinin çoğunu karşılıyor.',
        recommendations: [
            'TypeScript öğrenmeyi düşünün',
            'Bulut teknolojileri deneyimi ekleyin',
            'Portfolyonuzu güncelleyin',
        ],
    };
}

