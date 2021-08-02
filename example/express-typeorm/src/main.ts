import 'reflect-metadata';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { createDatabase } from 'typeorm-extension';
import { createConnection, ConnectionOptions, getRepository } from 'typeorm';
import { expressApp } from './app';
import { User } from './entity/User';
import { getEntity } from './utils/entity';

const env = dotenv.config();

async function run() {
  try {
    const entities = await getEntity();
    const options: ConnectionOptions = {
      type: 'postgres',
      host: env.parsed.DB_HOST || 'localhost',
      port: env.parsed.DB_PORT ? Number(env.parsed.DB_PORT) : 5432,
      username: env.parsed.DB_USER || 'postgres',
      password: env.parsed.DB_PASS || 'wcj123',
      database: env.parsed.DB_NAME || 'smg',
      synchronize: true,
      logging: false,
      entities: [
        // 'src/entity/*.ts'
        ...entities,
      ],
    };
    await createDatabase({ ifNotExist: true }, options);
    const connection = await createConnection(options);
    // Init admin user
    const userRepository = getRepository(User);
    const adminUser = await userRepository.findOne({ username: 'wcj' });
    if (!adminUser) {
      const hashPassword = crypto.createHmac('sha256', '123456').digest('hex');
      await connection.manager.save(
        connection.manager.create(User, {
          username: 'wcj',
          password: hashPassword,
        }),
      );
    }
    await expressApp(connection.manager);
  } catch (error) {
    console.log('\x1b[31m ERR:MAIN: \x1b[0m');
    console.log(error);
  }
}

run();
