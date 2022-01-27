import { Router } from 'express';

import { coins, buy, find, sell } from '../controllers/coin';

const router = Router();

router.post('/coins', coins);
router.post('/coins/buy', buy);
router.post('/coins/find', find);
router.post('/coins/sell', sell);

export default router;