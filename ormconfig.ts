import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['src/booking/entities/*.entity.ts'],
    logging: true,
    synchronize: false,
    migrationsRun: false,
    migrations: ['src/migrations/*.ts'],
    migrationsTableName: 'history',
});
