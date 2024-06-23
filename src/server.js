/* eslint-disable no-trailing-spaces */
/* eslint-disable semi */
/* eslint-disable no-console */

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { corsOptions } from '~/config/corsOptions';
import { APIs_V1 } from '~/routes/v1/';

const START_SERVER = () => {
  //todo: Run Express App
  const app = express();

  //todo: Fix Cache from disk from ExpressJS
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  });

  //todo: Use Cookie
  app.use(cookieParser());

  //todo: Config allow CORS
  app.use(cors(corsOptions));

  //todo: Enable req.body json data
  app.use(express.json());

  //todo: Use Route APIs V1
  app.use('/v1', APIs_V1);

  //~ Because it is demo, it should be placed in the controller. If in a real project, it should be placed in the environment variable in the .env file
  const port = 8017;
  const host = 'localhost';
  const author = 'Deren';

  app.listen(port, host, () => {
    console.log(
      `Local DEV: Hello ${author}, Back-end Server is running successfully at Host: ${host} and Port: ${port}`
    );
  });
};

(async () => {
  try {
    //todo: Start Back-end Server
    START_SERVER();
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
})();
