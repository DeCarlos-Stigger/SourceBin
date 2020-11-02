import { Router } from 'express';

import auth from './auth';
import billing from './billing';
import bins from './bins';
import code from './code';
import user from './user';
import webhooks from './webhooks';

const router = Router();

router.get('/ping', (_, res) => res.send('Pong'));

router.use('/auth', auth);
router.use('/billing', billing);
router.use('/bins', bins);
router.use('/code', code);
router.use('/user', user);
router.use('/webhooks', webhooks);

export default router;
