import { ArrayNotEmpty, IsArray, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  categories: number[];
}
