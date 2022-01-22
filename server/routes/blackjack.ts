import { Router } from 'express';

import blackjack from '../controllers/blackjack';

const router = Router();

router.post('/blackjack', blackjack);

export default router;