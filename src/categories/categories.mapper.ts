import { Injectable } from '@nestjs/common';
import { Category } from '@src/database/entities/category';

import { CategoryResponseDto } from './dtos/category-response.dto';

@Injectable()
export class CategoryMapper {
  mapEntityToDto(category: Category): CategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
    };
  }
}
