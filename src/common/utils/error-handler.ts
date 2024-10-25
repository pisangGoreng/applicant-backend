import {
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

export const handleError = (error: any, id: number, modelName: string) => {
  console.error('Error Message:', error.message);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        const constraint = error.meta?.target || 'unknown field';
        throw new BadRequestException(
          `Duplicate field value detected. Unique constraint violation on field: ${constraint}`,
        );
      case 'P2025':
        throw new NotFoundException(
          `Record ${modelName} with ID ${id} not found`,
        );
      default:
        throw new InternalServerErrorException('Database error occurred');
    }
  }

  if (error instanceof NotFoundException) {
    throw error;
  }

  if (error instanceof BadRequestException) {
    throw error;
  }

  if (error instanceof ConflictException) {
    throw error;
  }

  throw new InternalServerErrorException('Unexpected error occurred');
};
