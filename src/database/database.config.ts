import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const dbConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    autoLoadEntities: true,
    namingStrategy: new SnakeNamingStrategy(),
    dropSchema: false,
    synchronize: false,
    entitySkipConstructor: true,
};

export const loadStrategy = process.env.NODE_ENV !== 'test' ? 'query' : 'join';
