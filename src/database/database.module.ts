import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostgresqlDdProvider } from './providers/postgresql.provider';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'postgres', // Explicitly set the connection name for PostgreSQL
      useClass: PostgresqlDdProvider,
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
