import { Router } from 'express';

import dashboard from '../controllers/dashboard';

const router = Router();

router.post('/dashboard', dashboard);

export default router;