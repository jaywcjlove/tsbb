import dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

const env = dotenv.config();
if (!env.parsed) env.parsed = {};

export const options: DataSourceOptions = {
  type: 'postgres',
  host: env.parsed.DB_HOST || 'localhost',
  port: env.parsed.DB_PORT ? Number(env.parsed.DB_PORT) : 5432,
  username: env.parsed.DB_USER || 'postgres',
  password: env.parsed.DB_PASS || 'wcj123',
  database: env.parsed.DB_NAME || 'passworder-manager',
  synchronize: true,
  logging: false,
  entities: ['lib/entity/*.js'],
};

export const appDataSource = new DataSource({ ...options });
