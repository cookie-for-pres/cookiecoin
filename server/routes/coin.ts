import { Router } from 'express';

import { coins, buy, find } from '../controllers/coin';

const router = Router();

router.post('/coins', coins);
router.post('/coins/buy', buy);
router.post('/coins/find', find);

export default router;