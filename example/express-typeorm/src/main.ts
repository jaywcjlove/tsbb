import 'reflect-metadata';
import path from 'path';
import crypto from 'crypto';
import { createConnection, ConnectionOptions, getRepository } from 'typeorm';
import { expressApp } from './app';
import { User } from './entity/User';
import { getEntity } from './utils/entity';

async function run() {
  try {
    const entities = await getEntity();
    const options: ConnectionOptions = {
      type: 'sqlite',
      synchronize: true,
      logging: false,
      database: path.resolve('data/database.sqlite'),
      // database: 'data/database.sqlite',
      entities: [
        // 'src/entity/*.ts'
        ...entities,
      ],
    };
    const connection = await createConnection(options);
    await expressApp();

    // Init admin user
    const userRepository = getRepository(User);
    const adminUser = await userRepository.findOne(1);
    if (!adminUser) {
      const hashPassword = crypto.createHmac('sha256', '123456').digest('hex');
      await connection.manager.save(
        connection.manager.create(User, {
          username: 'admin',
          password: hashPassword,
        }),
      );
    }
  } catch (error) {
    console.log('\x1b[31m ERR:MAIN: \x1b[0m');
    console.log(error);
  }
}

run();
