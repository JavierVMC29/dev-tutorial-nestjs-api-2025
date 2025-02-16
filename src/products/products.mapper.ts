import { Injectable } from '@nestjs/common';
import { Product } from '@src/database/entities/product';

import { ProductResponseDto } from './dtos/product-response.dto';

@Injectable()
export class ProductMapper {
  mapEntityToDto(product: Product): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      categories:
        product.categories?.map((category) => ({
          id: category.id,
          name: category.name,
        })) || [],
    };
  }
}
