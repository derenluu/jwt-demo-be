/* eslint-disable semi */
/* eslint-disable no-unused-vars */

import { StatusCodes } from 'http-status-codes';
import { JwtProvider } from '~/providers/JwtProvider';

const access = async (req, res) => {
  try {
    const user = { email: 'luuuydanh123c@gmail.com' };
    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

export const dashboardController = {
  access,
};
