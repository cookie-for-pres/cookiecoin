import { Router } from 'express';

import leaderboard from '../controllers/leaderboard';

const router = Router();

router.post('/leaderboard', leaderboard);

export default router;