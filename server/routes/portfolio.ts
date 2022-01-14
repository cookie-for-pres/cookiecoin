import { Router } from 'express';

import { portfolio, transfer } from '../controllers/portfolio';

const router = Router();

router.post('/portfolio', portfolio);
router.post('/transfer', transfer);

export default router;