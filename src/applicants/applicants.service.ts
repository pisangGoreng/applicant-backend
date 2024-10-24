import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { GetApplicantsDto } from './dto/get-applicants.dto';
import { handleError } from 'src/common/utils/error-handler';

@Injectable()
export class ApplicantsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async validateUniqueField(createApplicantDto: Prisma.ApplicantCreateInput) {
    const { email, phoneNumber } = createApplicantDto;
    const existingApplicant = await this.databaseService.applicant.findFirst({
      where: {
        OR: [{ email }, { phoneNumber }],
      },
    });

    const duplicateFields: string[] = [];
    if (existingApplicant?.email === email) duplicateFields.push('email');
    if (existingApplicant?.phoneNumber === phoneNumber)
      duplicateFields.push('phoneNumber');

    if (duplicateFields.length > 0) {
      throw new ConflictException({
        message: 'Applicant with this data already exists.',
        duplicateFields,
      });
    }
  }

  async create(createApplicantDto: Prisma.ApplicantCreateInput) {
    try {
      await this.validateUniqueField(createApplicantDto);
      const { applicantRole } = createApplicantDto;

      const isRoleExist = await this.databaseService.applicantRole.findUnique({
        where: { id: Number(applicantRole) },
      });
      if (!isRoleExist) {
        throw new NotFoundException(`Role with ID ${applicantRole} not found`);
      }

      const createdApplicant = await this.databaseService.applicant.create({
        data: {
          ...createApplicantDto,
          ...(applicantRole && {
            applicantRole: { connect: { id: Number(applicantRole) } },
          }),
        },
      });

      return {
        message: 'Applicant created successfully',
        data: createdApplicant,
      };
    } catch (error) {
      handleError(error);
    }
  }

  async findAll(query: GetApplicantsDto) {
    try {
      const { page, limit, applicantRole, applicantStatus, location } = query;

      const filter: Prisma.ApplicantWhereInput = {};
      if (applicantRole) {
        filter.applicantRole = { description: { contains: applicantRole } };
      }

      if (applicantStatus) {
        filter.applicantStatus = { description: { contains: applicantStatus } };
      }

      if (location) {
        filter.location = { contains: location };
      }

      const [totalCount, applicants] = await this.databaseService.$transaction([
        this.databaseService.applicant.count({ where: filter }),
        this.databaseService.applicant.findMany({
          where: filter,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            applicantRole: true,
            applicantStatus: true,
          },
        }),
      ]);

      return {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        data: applicants,
      };
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: number) {
    try {
      const existingApplicant = await this.databaseService.applicant.findUnique(
        {
          where: { id },
          include: {
            applicantRole: { select: { id: true, description: true } },
            applicantStatus: { select: { id: true, description: true } },
          },
        },
      );

      if (!existingApplicant) {
        throw new NotFoundException(`Applicant with ID ${id} not found`);
      }

      return {
        message: 'Applicant fetched successfully',
        data: existingApplicant,
      };
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: number, updateApplicantDto: Prisma.ApplicantUpdateInput) {
    try {
      const { applicantRole, applicantStatus } = updateApplicantDto;
      const { applicant } = this.databaseService;

      const existingApplicant = await applicant.findUnique({ where: { id } });
      if (!existingApplicant) {
        throw new NotFoundException(`Applicant with ID ${id} not found`);
      }

      const updatedApplicant = await applicant.update({
        where: { id },
        data: {
          ...updateApplicantDto,
          ...(applicantRole && {
            applicantRole: { connect: { id: Number(applicantRole) } },
          }),
          ...(applicantStatus && {
            applicantStatus: { connect: { id: Number(applicantStatus) } },
          }),
        },
      });

      return {
        message: 'Applicant updated successfully',
        data: updatedApplicant,
      };
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: number) {
    try {
      const deletedApplicant = await this.databaseService.applicant.delete({
        where: { id },
      });

      return {
        message: 'Applicant deleted successfully',
        data: deletedApplicant,
      };
    } catch (error) {
      handleError(error, id);
    }
  }
}
