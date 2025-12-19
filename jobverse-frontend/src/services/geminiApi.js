/**
 * Google Gemini AI API Service
 * 
 * Kullanım:
 * 1. .env dosyasına GEMINI_API_KEY=your_api_key ekleyin
 * 2. API key'i https://aistudio.google.com/app/apikey adresinden alabilirsiniz
 * 3. Bu servis, mülakat simülasyonu için Gemini AI ile entegrasyon sağlar
 */

// API Key - Environment variable'dan alınacak
// .env dosyasına şunu ekleyin: VITE_GEMINI_API_KEY=your_api_key_here
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

/**
 * Gemini AI ile mülakat soruları oluştur
 * @param {Object} jobData - İş ilanı bilgileri (title, company, description, etc.)
 * @returns {Promise<Array>} - Mülakat soruları dizisi
 */
export const generateInterviewQuestions = async (jobData) => {
  if (!GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY bulunamadı. Mock sorular kullanılacak.');
    // Mock sorular döndür (backend hazır olana kadar)
    return getMockQuestions();
  }

  try {
    const prompt = `
      Aşağıdaki iş ilanı için profesyonel mülakat soruları oluştur.
      İş İlanı Başlığı: ${jobData.title || 'Yazılım Geliştirici'}
      Şirket: ${jobData.company || 'Teknoloji Şirketi'}
      Açıklama: ${jobData.description || ''}
      
      Lütfen 5-7 adet mülakat sorusu oluştur. Sorular teknik ve davranışsal soruları içermeli.
      Sadece soruları listeleyin, numaralandırmadan.
    `;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const questionsText = data.candidates[0].content.parts[0].text;
    
    // Metni sorulara böl
    const questions = questionsText
      .split('\n')
      .filter(line => line.trim() && line.trim().length > 10)
      .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim())
      .slice(0, 7);

    return questions.length > 0 ? questions : getMockQuestions();
  } catch (error) {
    console.error('Gemini API error:', error);
    // Hata durumunda mock sorular döndür
    return getMockQuestions();
  }
};

/**
 * Gemini AI ile cevap analizi yap
 * @param {Object} jobData - İş ilanı bilgileri
 * @param {Array} answers - Kullanıcının verdiği cevaplar
 * @returns {Promise<Object>} - Analiz sonuçları (score, feedback, suggestions)
 */
export const analyzeInterviewAnswers = async (jobData, answers) => {
  if (!GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY bulunamadı. Mock analiz döndürülecek.');
    return getMockAnalysis();
  }

  try {
    const prompt = `
      Aşağıdaki iş ilanı için verilen mülakat cevaplarını analiz et ve geri bildirim sağla.
      
      İş İlanı: ${jobData.title || 'Yazılım Geliştirici'}
      Şirket: ${jobData.company || 'Teknoloji Şirketi'}
      
      Sorular ve Cevaplar:
      ${answers.map((answer, index) => `
        Soru ${index + 1}: ${answer.question || ''}
        Cevap: ${answer.answer || ''}
      `).join('\n')}
      
      Lütfen şu formatta JSON döndür:
      {
        "overallScore": 0-100 arası sayı,
        "feedback": "Genel geri bildirim metni",
        "suggestions": ["Öneri 1", "Öneri 2", "Öneri 3"],
        "questionFeedback": [
          {
            "questionNumber": 1,
            "score": 0-100,
            "feedback": "Bu soru için geri bildirim"
          }
        ]
      }
    `;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const analysisText = data.candidates[0].content.parts[0].text;
    
    // JSON'u parse et
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
    }

    return getMockAnalysis();
  } catch (error) {
    console.error('Gemini API error:', error);
    return getMockAnalysis();
  }
};

/**
 * Mock sorular (API key yoksa veya hata durumunda)
 */
const getMockQuestions = () => {
  return [
    "Kendinizi kısaca tanıtır mısınız?",
    "Bu pozisyon için neden uygun olduğunuzu düşünüyorsunuz?",
    "En güçlü teknik yetenekleriniz nelerdir?",
    "Zor bir projede nasıl problem çözüyorsunuz?",
    "Takım çalışması konusundaki deneyimleriniz nelerdir?",
    "Son projelerinizden birini detaylı olarak anlatır mısınız?",
    "Kariyer hedefleriniz nelerdir?"
  ];
};

/**
 * Mock analiz (API key yoksa veya hata durumunda)
 */
const getMockAnalysis = () => {
  return {
    overallScore: 75,
    feedback: "Cevaplarınız genel olarak iyi. Bazı alanlarda daha detaylı açıklamalar yapabilirsiniz.",
    suggestions: [
      "Teknik yeteneklerinizi daha somut örneklerle destekleyin",
      "Takım çalışması deneyimlerinizi detaylandırın",
      "Proje örneklerinizde ölçülebilir sonuçlar belirtin"
    ],
    questionFeedback: []
  };
};

