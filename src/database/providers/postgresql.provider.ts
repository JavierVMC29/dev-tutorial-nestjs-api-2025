import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Product } from '@src/database/entities/product';
import { Category } from '../entities/category';

@Injectable()
export class PostgresqlDdProvider implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<'string'>('POSTGRES_DB_HOST'),
      port: parseInt(
        this.configService.get<'string'>('POSTGRES_DB_PORT') ?? '5432',
      ),
      username: this.configService.get<'string'>('POSTGRES_DB_USERNAME'),
      password: this.configService.get<'string'>('POSTGRES_DB_PASSWORD'),
      database: this.configService.get<'string'>('POSTGRES_DB_NAME'),
      entities: [Product, Category],
      synchronize: true,
      logging: false,
    };
  }
}
