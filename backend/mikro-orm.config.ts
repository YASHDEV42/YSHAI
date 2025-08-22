import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Options } from '@mikro-orm/core';
import { config as loadEnv } from 'dotenv';
import { join } from 'path';

loadEnv({ path: join(__dirname, '.env') });
const config: Options = {
  driver: PostgreSqlDriver,
  entities: ['./dist/entities'],
  entitiesTs: ['./src/entities'],
  migrations: {
    path: './dist/migrations',
    pathTs: './src/migrations',
  },
  driverOptions: {
    connection: {
      ssl: true,
      rejectUnauthorized: false,
    },
  },
  clientUrl: process.env.DATABASE_URL,
  debug: true,
};

export default config;
