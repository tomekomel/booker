import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { entitiesList } from './entities-list';

export const dbConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  autoLoadEntities: true,
  dropSchema: false,
  synchronize: false,
  entitySkipConstructor: true,
  entities: entitiesList,
};

export const loadStrategy = process.env.NODE_ENV !== 'test' ? 'query' : 'join';
