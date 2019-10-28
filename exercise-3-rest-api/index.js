import express from 'express';
import config from './config';
import appLoader from './loaders';
import Logger from './loaders/logger';

export async function startServer() {
  const app = express();

  const unloadApp = await appLoader(app);

  app.listen(config.port, error => {
    if (error) {
      Logger.error(error);
      process.exit(1);
      return;
    }
    Logger.info(`Server listening on port: ${config.port}`);
  });

  // For the tests, we need access to the Express app,
  // and to a function that unloads the app
  return [app, unloadApp];
}

if (config.environment !== 'test') {
  startServer();
}
