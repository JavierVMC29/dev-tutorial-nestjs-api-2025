import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '@src/database/entities/category';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategoryMapper } from './categories.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([Category], 'postgres')],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoryMapper],
  exports: [CategoriesService],
})
export class CategoriesModule {}
