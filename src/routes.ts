import { Router } from 'express';
import authenticate from './middlewares/auth.middleware';
import subscriptionMiddleware from './middlewares/subscription.middleware';

import auth from './modules/auth/auth.routes';
import users from './modules/users/users.routes';
import childrens from './modules/childrens/childrens.routes';
import screenTimes from './modules/screen-times/screen-times.routes';
import contentFilters from './modules/content-filters/content-filters.routes';
import alerts from './modules/alerts/alerts.routes';
import devices from './modules/devices/devices.routes';
import subscriptions from './modules/subscriptions/subscriptions.routes';
import chats from './modules/chats/chats.routes';
import contactUs from './modules/contact-us/contact-us.routes';
import pages from './modules/pages/pages.routes';
import faqs from './modules/faqs/faqs.routes';
import notifications from './modules/notifications/notifications.routes';
import appFiltering from './modules/app-filtering/app-filtering.routes';
import admin from './modules/admin/admin.routes';

const router = Router();
router.use(`/auth`, auth);
router.use(`/users`, authenticate, subscriptionMiddleware, users);
router.use(`/childrens`, childrens);
router.use(`/screen-times`, authenticate, subscriptionMiddleware, screenTimes);
router.use(`/content-filters`, authenticate, subscriptionMiddleware, contentFilters);
router.use(`/alerts`, authenticate, subscriptionMiddleware, alerts);
router.use(`/devices`, authenticate, subscriptionMiddleware, devices);
router.use(`/subscriptions`, subscriptions);
router.use(`/chats`, authenticate, subscriptionMiddleware, chats);
router.use(`/contact-us`, authenticate, subscriptionMiddleware, contactUs);
router.use(`/pages`, authenticate, subscriptionMiddleware, pages);
router.use(`/faqs`, authenticate, faqs);
router.use(`/notifications`, authenticate, notifications);
router.use(`/app-filtering`, authenticate, appFiltering);
router.use(`/admin`, authenticate, admin);

export = router;
