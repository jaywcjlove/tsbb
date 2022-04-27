import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

const env = dotenv.config();
if (!env.parsed) env.parsed = {};

export const appDataSource = new DataSource({
  type: 'postgres',
  host: env.parsed.DB_HOST || 'localhost',
  port: env.parsed.DB_PORT ? Number(env.parsed.DB_PORT) : 5432,
  username: env.parsed.DB_USER || 'postgres',
  password: env.parsed.DB_PASS || 'wcj123',
  database: env.parsed.DB_NAME || 'smg',
  synchronize: true,
  logging: false,
  entities: ['lib/entity/*.js'],
});
