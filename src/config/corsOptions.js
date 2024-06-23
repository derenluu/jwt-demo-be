/* eslint-disable comma-dangle */
/* eslint-disable semi */

export const corsOptions = {
  origin: function (origin, callback) {
    return callback(null, true);
  },

  //todo: Some legacy browsers (IE11, various SmartTVs) choke on 204
  optionsSuccessStatus: 200,

  //todo: CORS will allow cookies to be received from requests
  credentials: true,
};
