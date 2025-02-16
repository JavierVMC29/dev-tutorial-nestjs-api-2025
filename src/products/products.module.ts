import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '@src/database/entities/category';
import { Product } from '@src/database/entities/product';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductMapper } from './products.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category], 'postgres')],
  controllers: [ProductsController],
  providers: [ProductsService, ProductMapper],
  exports: [ProductsService],
})
export class ProductsModule {}
