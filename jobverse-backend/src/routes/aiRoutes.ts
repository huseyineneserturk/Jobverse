import { Router } from 'express';
import { generateInterviewQuestions, analyzeInterviewAnswers, chatWithAI, calculateJobMatch } from '../controllers/aiController';
import { optionalAuth, verifyFirebaseToken } from '../middleware/authMiddleware';

const router = Router();

// Chat endpoint - optional auth (works for both logged in and anonymous users)
router.post('/chat', optionalAuth, chatWithAI);

// Protected endpoints - require authentication
router.post('/interview-questions', verifyFirebaseToken, generateInterviewQuestions);
router.post('/analyze-answers', verifyFirebaseToken, analyzeInterviewAnswers);
router.post('/job-match', verifyFirebaseToken, calculateJobMatch);

export default router;
