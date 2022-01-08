import { Router } from 'express';

import { balances } from '../controllers/account';

const router = Router();

router.post('/account/balances', balances);

export default router;