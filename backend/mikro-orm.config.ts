import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Options } from '@mikro-orm/core';
import { config as loadEnv } from 'dotenv';
import { join } from 'path';

const envPath = join(process.cwd(), '.env');
loadEnv({ path: envPath });

const config: Options = {
  driver: PostgreSqlDriver,
  entities: ['./dist/src/entities'],
  entitiesTs: ['./src/entities'],
  driverOptions: {
    connection: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
  clientUrl: process.env.DATABASE_URL,
};

export default config;
