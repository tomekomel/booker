import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { entitiesList } from './entities-list';

@Module({})
export class DatabaseModule {
  static initialise(dbConfig: TypeOrmModuleOptions): DynamicModule {
    const imports = [
      ConfigModule.forRoot(),
      TypeOrmModule.forRoot(dbConfig),
      TypeOrmModule.forFeature(),
    ];

    return {
      module: DatabaseModule,
      imports: imports,
      providers: [],
      exports: [],
    };
  }
}
