import { Router } from 'express';

import coinflip from '../controllers/coinflip';

const router = Router();

router.post('/coinflip', coinflip);

export default router;