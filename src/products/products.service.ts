import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { In, Repository } from 'typeorm';

import { Product } from '@src/database/entities/product';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Category } from '@src/database/entities/category';
import { ProductMapper } from './products.mapper';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product, 'postgres')
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category, 'postgres')
    private readonly categoryRepository: Repository<Category>,
    private readonly productMapper: ProductMapper,
  ) {}

  async getAll(pageNo: number = 0, pageSize: number = 10) {
    try {
      // Ensure pageNo is a non-negative integer and pageSize is within reasonable limits
      if (pageNo < 0 || pageSize <= 0) {
        throw new BadRequestException('Invalid page number or page size');
      }

      // Calculate skip value based on page number and page size
      const skip = pageNo * pageSize;

      // Get products with pagination
      const [products, totalElements] =
        await this.productRepository.findAndCount({
          skip,
          take: pageSize,
          relations: ['categories'], // To load related categories for each product
        });

      // Calculate totalPages and whether it's the last page
      const totalPages = Math.ceil(totalElements / pageSize);
      const last = pageNo + 1 >= totalPages;

      // Map the result into the desired format
      return {
        content: products.map((product) =>
          this.productMapper.mapEntityToDto(product),
        ),
        pageNo,
        pageSize,
        totalElements,
        totalPages,
        last,
      };
    } catch (error) {
      this.handleError(error, 'An error occurred while getting products');
    }
  }

  async getById(id: number) {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
        relations: ['categories'],
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      return this.productMapper.mapEntityToDto(product);
    } catch (error) {
      this.handleError(error, 'An error occurred while fetching product');
    }
  }

  async create(createProductDto: CreateProductDto) {
    try {
      // Convert category IDs to actual Category entities
      const categories = await this.categoryRepository.findBy({
        id: In(createProductDto.categories),
      });

      if (!categories.length) {
        throw new BadRequestException('Invalid category IDs');
      }

      // Create a new product with the categories attached
      const newProduct = this.productRepository.create({
        ...createProductDto,
        categories,
      });

      await this.productRepository.save(newProduct);
      return this.productMapper.mapEntityToDto(newProduct);
    } catch (error) {
      this.handleError(error, 'An error occurred while creating product');
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const { categories, ...updateProductDtoWithoutCategories } =
        updateProductDto;
      // Find the product by ID and preload with the updated values
      const product = await this.productRepository.preload({
        id,
        ...updateProductDtoWithoutCategories,
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      // If the update involves categories, convert category IDs to actual Category entities
      if (updateProductDto.categories) {
        const categories = await this.categoryRepository.findBy({
          id: In(updateProductDto.categories),
        });

        if (!categories.length) {
          throw new BadRequestException('Invalid category IDs');
        }

        product.categories = categories;
      }

      await this.productRepository.save(product);
      return this.productMapper.mapEntityToDto(product);
    } catch (error) {
      this.handleError(error, 'An error occurred while updating product');
    }
  }

  async delete(id: number) {
    try {
      const product = await this.productRepository.findOne({ where: { id } });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      await this.productRepository.remove(product);
      return { message: 'Product deleted successfully' };
    } catch (error) {
      this.handleError(error, 'An error occurred while deleting product');
    }
  }

  private handleError(error: unknown, defaultErrorMessage?: string) {
    // Log the error
    this.logger.error(error);

    // Handle known HTTP exceptions
    if (error instanceof HttpException) {
      throw error; // Preserve the original exception, don't modify it
    }

    // Handle unexpected errors
    if (error instanceof Error) {
      // Handle generic errors
      throw new InternalServerErrorException({
        message: defaultErrorMessage ?? 'An unexpected error occurred',
      });
    }

    // Default to a generic BadRequestException if error is unknown
    throw new BadRequestException({
      message: defaultErrorMessage ?? 'An error occurred in ProductsService',
    });
  }
}
