import { Module } from '@nestjs/common';

import { CoreModule } from './core/core.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [CoreModule, ProductsModule, CategoriesModule],
})
export class AppModule {}
