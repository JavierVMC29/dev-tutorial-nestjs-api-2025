export class ProductResponseDto {
  id: number;
  name: string;
  description: string;
  price: number;
  categories: CategoryResponseDto[];
}

export class CategoryResponseDto {
  id: number;
  name: string;
}
