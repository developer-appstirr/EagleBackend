import { ConnectionOptions } from 'typeorm';
import Configuration from './config';

const { DATABASE } = Configuration;

const config: ConnectionOptions = {
  type: DATABASE.TYPE,
  host: DATABASE.HOST,
  port: DATABASE.PORT,
  username: DATABASE.USERNAME,
  password: DATABASE.PASSWORD,
  database: DATABASE.DATABASE,
  entities: DATABASE.ENTITIES,
  migrations: DATABASE.MIGRATIONS,
  synchronize: DATABASE.TYPEORM_SYNCHRONIZE,
  dropSchema: DATABASE.DROP_SCHEMA,
  logging: DATABASE.LOGGING,
  ssl: DATABASE.SSL,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
};

export default config;
