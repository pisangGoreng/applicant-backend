import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { handleError } from '../utils/error-handler';

@Injectable()
export abstract class BaseService<T, CreateInput, UpdateInput> {
  constructor(
    protected readonly prismaClient: PrismaClient,
    private model: any,
  ) {}

  async validateUniqueField(uniqueFields: Partial<CreateInput>) {
    const existingEntity = await this.model.findFirst({
      where: { OR: [uniqueFields] },
    });

    const duplicateFields: string[] = [];
    for (const [key, value] of Object.entries(uniqueFields)) {
      if (existingEntity && existingEntity[key] === value) {
        duplicateFields.push(key);
      }
    }

    if (duplicateFields.length > 0) {
      throw new ConflictException({
        message: `${this.model.name}  with this data already exists`,
        duplicateFields,
      });
    }
  }

  async create(data: CreateInput) {
    try {
      await this.validateUniqueField(data);
      const createdData = await this.model.create({ data });

      return {
        message: `${this.model.name} created successfully`,
        data: createdData,
      };
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      const existingData = await this.model.findMany();

      return {
        message: `${this.model.name} fetched successfully`,
        data: existingData,
      };
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: number) {
    try {
      const existingData = await this.model.findUnique({ where: { id } });

      if (!existingData) {
        throw new NotFoundException(
          `${this.model.name} with ID ${id} not found`,
        );
      }

      return {
        message: `${this.model.name} fetched successfully`,
        data: existingData,
      };
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: number, data: UpdateInput) {
    try {
      const existingData = await this.model.findUnique({ where: { id } });
      if (!existingData) {
        throw new NotFoundException(
          `${this.model.name} with ID ${id} not found`,
        );
      }

      const updatedExistingData = await this.model.update({
        where: { id },
        data,
      });

      return {
        message: `${this.model.name} updated successfully`,
        data: updatedExistingData,
      };
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: number) {
    try {
      const deletedExistingData = await this.model.delete({ where: { id } });

      return {
        message: `${this.model.name} deleted successfully`,
        data: deletedExistingData,
      };
    } catch (error) {
      handleError(error, id);
    }
  }
}
