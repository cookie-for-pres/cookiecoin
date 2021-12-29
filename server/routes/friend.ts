import { Router } from 'express';

import { add, remove } from '../controllers/friend';

const router = Router();

router.post('/friend/add', add);
router.delete('/friend/remove', remove);

export default router;