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
    private uniqueFields: string[],
  ) {}

  async validateUniqueField(
    id: number,
    updateApplicant: Partial<CreateInput | UpdateInput>,
    uniqueFields: string[],
  ) {
    const [conditions, conditionsValue] = Object.entries(
      updateApplicant,
    ).reduce(
      (results, [key, value]) => {
        if (uniqueFields.includes(key)) {
          results[0].push({ [key]: value });
          results[1].push(value);
        }
        return results;
      },
      [[], []],
    );

    const existingApplicant = await this.model.findMany({
      where: { OR: conditions, ...(id && { NOT: { id } }) },
    });

    const duplicateFields = existingApplicant.reduce((results, item) => {
      Object.entries(item).forEach(([key, value]) => {
        if (conditionsValue.includes(value)) {
          results.push(key);
        }
      });
      return results;
    }, []);

    if (duplicateFields.length > 0) {
      throw new ConflictException({
        message: `${this.model.name} with this data already exists`,
        duplicateFields,
      });
    }
  }

  async create(data: CreateInput) {
    try {
      await this.validateUniqueField(null, data, ['description']);
      return await this.model.create({ data });
    } catch (error) {
      handleError(error, null, this.model.name);
    }
  }

  async findAll() {
    try {
      return await this.model.findMany();
    } catch (error) {
      handleError(error, null, this.model.name);
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

      return existingData;
    } catch (error) {
      handleError(error, id, this.model.name);
    }
  }

  async update(id: number, data: UpdateInput) {
    try {
      await this.validateUniqueField(id, data, ['description']);
      return await this.model.update({
        where: { id },
        data,
      });
    } catch (error) {
      handleError(error, id, this.model.name);
    }
  }

  async remove(id: number) {
    try {
      return await this.model.delete({ where: { id } });
    } catch (error) {
      handleError(error, id, this.model.name);
    }
  }
}
