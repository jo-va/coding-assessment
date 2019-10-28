import { Sequelize } from 'sequelize';
import config from '../config';
import loadModels from '../models';
import Logger from './logger';

export default async () => {
  const logging = msg => {
    if (config.environment !== 'test') Logger.debug(msg);
  };
  const sequelize = new Sequelize(config.database.url, { logging });

  loadModels(sequelize);

  await sequelize.sync({ force: config.environemnt === 'test' });

  // return a cleanup function that closes the database connection
  return async () => {
    await sequelize.close();
  };
};
