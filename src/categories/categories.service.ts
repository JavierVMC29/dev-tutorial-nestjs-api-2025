import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Category } from '@src/database/entities/category';

import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { CategoryMapper } from './categories.mapper';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger('CategoriesService');

  constructor(
    @InjectRepository(Category, 'postgres')
    private readonly categoryRepository: Repository<Category>,
    private readonly categoryMapper: CategoryMapper,
  ) {}

  async getAll(pageNo: number = 0, pageSize: number = 10) {
    try {
      // Ensure pageNo is a non-negative integer and pageSize is within reasonable limits
      if (pageNo < 0 || pageSize <= 0) {
        throw new BadRequestException('Invalid page number or page size');
      }

      // Calculate skip value based on page number and page size
      const skip = pageNo * pageSize;

      // Get categories with pagination
      const [categories, totalElements] =
        await this.categoryRepository.findAndCount({
          skip,
          take: pageSize,
        });

      // Calculate totalPages and whether it's the last page
      const totalPages = Math.ceil(totalElements / pageSize);
      const last = pageNo + 1 >= totalPages;

      // Map the result into the desired format
      return {
        content: categories.map((category) =>
          this.categoryMapper.mapEntityToDto(category),
        ),
        pageNo,
        pageSize,
        totalElements,
        totalPages,
        last,
      };
    } catch (error) {
      this.handleError(error, 'An error occurred while getting categories');
    }
  }

  async getById(id: number) {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      return this.categoryMapper.mapEntityToDto(category);
    } catch (error) {
      this.handleError(error, 'An error occurred while fetching category');
    }
  }

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      // Create a new category
      const newCategory = this.categoryRepository.create(createCategoryDto);

      await this.categoryRepository.save(newCategory);
      return this.categoryMapper.mapEntityToDto(newCategory);
    } catch (error) {
      this.handleError(error, 'An error occurred while creating category');
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      category.name = updateCategoryDto.name;

      await this.categoryRepository.save(category);
      return this.categoryMapper.mapEntityToDto(category);
    } catch (error) {
      this.handleError(error, 'An error occurred while updating category');
    }
  }

  async delete(id: number) {
    try {
      const category = await this.categoryRepository.findOne({ where: { id } });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      await this.categoryRepository.remove(category);
      return { message: 'Category deleted successfully' };
    } catch (error) {
      this.handleError(error, 'An error occurred while deleting category');
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
      message: defaultErrorMessage ?? 'An error occurred in CategoriesService',
    });
  }
}
