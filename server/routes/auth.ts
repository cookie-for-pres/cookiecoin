import { Router } from 'express';

import auth from '../controllers/auth';

const router = Router();

router.post('/auth-check', auth);

export default router;