/* eslint-disable semi */

import express from 'express';
import { dashboardController } from '~/controllers/dashboardController';
import { authMiddleware } from '~/middlewares/authMiddleware';

const Router = express.Router();

Router.route('/access').get(
  authMiddleware.isAuthorizaed,
  dashboardController.access
);

export const dashboardRoute = Router;
