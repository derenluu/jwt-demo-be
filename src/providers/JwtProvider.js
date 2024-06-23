/* eslint-disable comma-dangle */
/* eslint-disable semi */
/* eslint-disable no-unused-vars */

import JWT from 'jsonwebtoken';

//todo: Generate token
const generateToken = async (payload, privateKey, tokenLife) => {
  try {
    //? sign() from JWT
    return JWT.sign(payload, privateKey, {
      algorithm: 'HS256', //? Algorithm
      expiresIn: tokenLife, //? Expired time
    });
  } catch (error) {
    throw new Error(error);
  }
};

//? Function checks if the token is valid
const verifyToken = async (token, privateKey) => {
  try {
    return JWT.verify(token, privateKey);
  } catch (error) {
    throw new Error(error);
  }
};

//~ Because it is demo, it should be placed in the controller. If in a real project, it should be placed in the environment variable in the .env file
export const ACCESS_PRIVATE_KEY = 'KBgJwUETt4HeCD05WaXXI9V3JnwCVP';
export const REFRESH_PRIVATE_KEY = 'fcCjhnpeopVn2Hg1jG75DUi62051yL';

export const JwtProvider = {
  generateToken,
  verifyToken,
};
