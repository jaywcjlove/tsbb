/// <reference path="./types/global.d.ts" />
import 'reflect-metadata';
import crypto from 'crypto';
import { createDatabase } from 'typeorm-extension';
import { expressApp } from './app';
import { User } from './entity/User';
import { appDataSource, options } from './app-data-source';

async function run() {
  try {
    await createDatabase({ ifNotExist: true, options });
    const dataSource = await appDataSource.initialize();
    if (!dataSource.isInitialized) {
      throw new Error('Initialization and establishment of initial connection/connection pool to database failed.');
    }
    const repository = appDataSource.getRepository(User);
    const adminUser = await repository.findOneBy({ username: 'wcj' });
    if (!adminUser) {
      const hashPassword = crypto.createHmac('sha256', '123456').digest('hex');
      const user = await repository.create({
        username: 'wcj',
        password: hashPassword,
      });
      await repository.save(user);
    }
    await expressApp();
  } catch (error) {
    console.log('\x1b[31m ERR:MAIN: \x1b[0m');
    console.log(error);
  }
}

run();
