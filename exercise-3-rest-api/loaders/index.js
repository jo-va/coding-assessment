import expressLoader from './express';
import databaseLoader from './database';
import Logger from './logger';

export default async expressApp => {
  const closeDatabase = await databaseLoader();
  Logger.info('Connected to Databse');

  expressLoader(expressApp);
  Logger.info('Express loaded');

  // return the cleanup function
  return async () => {
    await closeDatabase();
  };
};
