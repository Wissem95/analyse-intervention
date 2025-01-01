import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const category = this.categoryRepository.create(createCategoryDto);
      return await this.categoryRepository.save(category);
    } catch (error) {
      this.logger.error('Erreur lors de la création de la catégorie:', error);
      throw error;
    }
  }

  async findAll(): Promise<Category[]> {
    try {
      return await this.categoryRepository.find();
    } catch (error) {
      this.logger.error(
        'Erreur lors de la récupération des catégories:',
        error,
      );
      throw error;
    }
  }

  async findOne(id: string): Promise<Category> {
    try {
      if (
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          id,
        )
      ) {
        throw new NotFoundException('Category not found');
      }

      const category = await this.categoryRepository.findOne({
        where: { id },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      return category;
    } catch (error) {
      this.logger.error(
        'Erreur lors de la récupération de la catégorie:',
        error,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Category not found');
    }
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    try {
      const category = await this.findOne(id);
      Object.assign(category, updateCategoryDto);
      return await this.categoryRepository.save(category);
    } catch (error) {
      this.logger.error(
        'Erreur lors de la mise à jour de la catégorie:',
        error,
      );
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const category = await this.findOne(id);
      if (category) {
        await this.categoryRepository.delete(id);
      }
    } catch (error) {
      this.logger.error(
        'Erreur lors de la suppression de la catégorie:',
        error,
      );
      throw error;
    }
  }
}
