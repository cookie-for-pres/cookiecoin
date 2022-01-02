import { Router } from 'express';

import { games, find } from '../controllers/game';

const router = Router();

router.post('/games', games);
router.post('/games/find', find)

export default router;