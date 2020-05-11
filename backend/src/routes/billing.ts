import { Router } from 'express';
import bodyParser from 'body-parser';

import { rateLimits } from '../config';

import { rateLimit } from '../middleware/rateLimit';
import { jsonParser } from '../middleware/jsonParser';
import { requiredAuth } from '../middleware/authenticate';

import { getCustomer } from '../controllers/billing/getCustomer';
import { getPlan } from '../controllers/billing/getPlan';
import { getCoupon } from '../controllers/billing/getCoupon';
import { getUpcomingInvoice } from '../controllers/billing/getUpcomingInvoice';
import { subscribe } from '../controllers/billing/subscribe';
import { cancel } from '../controllers/billing/cancel';
import { reenable } from '../controllers/billing/reenable';
import { webhook } from '../controllers/billing/webhook';

const router = Router();

router.get(
  '/customer',
  requiredAuth,
  // TODO: ratelimit
  getCustomer,
);

router.get(
  '/plan/:plan',
  // TODO: ratelimit
  getPlan,
);

router.get(
  '/coupon/:coupon',
  // TODO: ratelimit
  getCoupon,
);

router.get(
  '/upcoming-invoice/',
  // TODO: ratelimit
  requiredAuth,
  getUpcomingInvoice,
);

router.post(
  '/subscribe',
  requiredAuth,
  rateLimit(rateLimits.billing.subscribe),
  jsonParser,
  subscribe,
);

router.delete(
  '/cancel',
  requiredAuth,
  rateLimit(rateLimits.billing.cancel),
  cancel,
);

router.post(
  '/reenable',
  requiredAuth,
  // TODO: ratelimit
  reenable,
);

router.post(
  '/webook',
  // TODO: ratelimit
  bodyParser.raw({ type: 'application/json' }),
  webhook,
);

export default router;
