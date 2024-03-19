import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { TreeRepository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: TreeRepository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<any> {
    if (createCategoryDto.parentId) {
      const parent = await this.categoryRepository.findOneBy({
        id: createCategoryDto.parentId,
      });

      if (!parent) {
        throw new NotFoundException(
          `Category #${createCategoryDto.parentId} not found`,
        );
      }

      return await this.categoryRepository.save({
        ...createCategoryDto,
        parent,
      });
    }

    return await this.categoryRepository.save(createCategoryDto);
  }

  async findAll(): Promise<any> {
    return await this.categoryRepository.findTrees();
  }

  async findOne(id: number): Promise<any> {
    const category = await this.categoryRepository.findOneBy({ id });

    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }

    return await this.categoryRepository.findDescendantsTree(category);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<any> {
    const category = await this.categoryRepository.findOneBy({ id });

    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }

    if (updateCategoryDto.parentId) {
      const parent = await this.categoryRepository.findOneBy({
        id: updateCategoryDto.parentId,
      });

      if (!parent) {
        throw new NotFoundException(
          `Category #${updateCategoryDto.parentId} not found`,
        );
      }

      return await this.categoryRepository.save({
        ...category,
        ...updateCategoryDto,
        parent,
      });
    }

    return await this.categoryRepository.save({
      ...category,
      ...updateCategoryDto,
    });
  }

  async remove(id: number): Promise<any> {
    const category = await this.categoryRepository.findOneBy({ id });

    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }

    const childrenCount =
      await this.categoryRepository.countDescendants(category);

    if (childrenCount > 1) {
      throw new ForbiddenException(
        `Category #${id} has children. Please remove them first`,
      );
    }

    return await this.categoryRepository.remove(category);
  }
}
