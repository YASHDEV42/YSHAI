import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Options } from '@mikro-orm/core';
import { config as loadEnv } from 'dotenv';
import { join } from 'path';

const envPath = join(process.cwd(), '.env');
loadEnv({ path: envPath });

const config: Options = {
  driver: PostgreSqlDriver,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  entities: ['dist/entities/**/*.entity.js'],
  entitiesTs: ['src/entities/**/*.entity.ts'],
  driverOptions: {
    connection: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
};

export default config;
