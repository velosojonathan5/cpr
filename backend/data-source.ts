import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [
    'src/**/repository/*.model.ts',
    'src/infra/repository/typeORM/*.model.ts',
  ],
  migrations: ['typeorm/migrations/*.{ts,js}'],
  synchronize: false,
  logging: true,
});
