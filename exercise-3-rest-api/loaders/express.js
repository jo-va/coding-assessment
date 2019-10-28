import bodyParser from 'body-parser';
import cors from 'cors';
import routes from '../routes';
import config from '../config';
import { RouteNotFoundError, sendHttpErrorResponse } from '../errors';

export default app => {
  app.enable('trust proxy');

  app.use(bodyParser.json());

  app.use(cors());

  app.use(config.apiPrefix, routes());

  app.use(() => {
    throw new RouteNotFoundError();
  });

  app.use((error, _req, res, _next) => {
    return sendHttpErrorResponse(res, error);
  });
};
