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

  // async validateUniqueField(
  //   id,
  //   data: Partial<CreateInput | UpdateInput>,
  //   uniqueFields?: string[],
  // ) {
  //   const existingEntity = await this.model.findFirst({
  //     where: { OR: [data] },
  //   });

  //   const duplicateFields: string[] = [];
  //   for (const [key, value] of Object.entries(data)) {
  //     if (existingEntity && existingEntity[key] === value) {
  //       duplicateFields.push(key);
  //     }
  //   }

  //   if (duplicateFields.length > 0) {
  //     throw new ConflictException({
  //       message: `${this.model.name}  with this data already exists`,
  //       duplicateFields,
  //     });
  //   }
  // }

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
      const createdData = await this.model.create({ data });

      return {
        message: `${this.model.name} created successfully`,
        data: createdData,
      };
    } catch (error) {
      handleError(error, null, this.model.name);
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

      return {
        message: `${this.model.name} fetched successfully`,
        data: existingData,
      };
    } catch (error) {
      handleError(error, id, this.model.name);
    }
  }

  async update(id: number, data: UpdateInput) {
    try {
      // const existingData = await this.model.findUnique({ where: { id } });
      // if (!existingData) {
      //   throw new NotFoundException(
      //     `${this.model.name} with ID ${id} not found`,
      //   );
      // }

      await this.validateUniqueField(id, data, ['description']);

      const updatedExistingData = await this.model.update({
        where: { id },
        data,
      });

      return {
        message: `${this.model.name} updated successfully`,
        data: updatedExistingData,
      };
    } catch (error) {
      handleError(error, id, this.model.name);
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
      handleError(error, id, this.model.name);
    }
  }
}
