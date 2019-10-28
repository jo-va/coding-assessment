import dotenv from 'dotenv';

const envFound = dotenv.config();

if (!envFound) {
  throw Error("Couldn't find .env file!");
}

const databaseConfig = {
  development: {
    url: process.env.DEV_DATABASE_URI,
  },
  test: {
    url: process.env.TEST_DATABASE_URI,
  },
  production: {
    url: process.env.DATABASE_URI,
  },
};

const environment = process.env.NODE_ENV || 'development';

export default {
  environment,
  port: environment === 'test' ? process.env.PORT_TEST : process.env.PORT,
  database: databaseConfig[environment],
  apiPrefix: '/api',
  logLevel: process.env.LOG_LEVEL,
};
