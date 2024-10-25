import { Injectable, NotFoundException } from '@nestjs/common';
import { Applicant, Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { GetApplicantsDto } from './dto/get-applicants.dto';
import { handleError } from 'src/common/utils/error-handler';
import { BaseService } from 'src/common/services/base.service';
// import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ApplicantsRoleService } from 'src/applicants-role/applicants-role.service';

@Injectable()
export class ApplicantsService extends BaseService<
  Applicant,
  Prisma.ApplicantCreateInput,
  Prisma.ApplicantUpdateInput
> {
  public uniqueFieldsModel: string[];

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly applicantRoleService: ApplicantsRoleService,
  ) {
    super(databaseService, databaseService.applicant, ['email', 'phoneNumber']);
    this.uniqueFieldsModel = ['email', 'phoneNumber'];
  }

  async create(createApplicant: Prisma.ApplicantCreateInput) {
    try {
      const { applicantRole } = createApplicant;
      await this.validateUniqueField(
        null,
        createApplicant,
        this.uniqueFieldsModel,
      );

      await this.applicantRoleService.findOne(Number(applicantRole));

      return await this.databaseService.applicant.create({
        data: {
          ...createApplicant,
          ...(applicantRole && {
            applicantRole: { connect: { id: Number(applicantRole) } },
          }),
        },
      });
    } catch (error) {
      handleError(error, null, 'Applicant');
    }
  }

  async findAllByQuery(query: GetApplicantsDto) {
    try {
      const { page, limit, applicantRole, applicantStatus, location } = query;
      const limitNum = limit ? limit : undefined;
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
          orderBy: { createdAt: 'desc' },
          include: {
            applicantRole: true,
            applicantStatus: true,
          },
          ...(limitNum ? { skip: (page - 1) * limitNum, take: limitNum } : {}),
        }),
      ]);

      return {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        data: applicants,
      };
    } catch (error) {
      handleError(error, null, 'Applicant');
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

      // return {
      //   message: 'Applicant fetched successfully',
      //   data: existingApplicant,
      // };
      return existingApplicant;
    } catch (error) {
      handleError(error, id, 'Applicant');
    }
  }

  async update(id: number, updateApplicant: Prisma.ApplicantUpdateInput) {
    try {
      const { applicantRole, applicantStatus } = updateApplicant;
      await this.validateUniqueField(
        id,
        updateApplicant,
        this.uniqueFieldsModel,
      );

      return await this.databaseService.applicant.update({
        where: { id },
        data: {
          ...updateApplicant,
          ...(applicantRole && {
            applicantRole: { connect: { id: Number(applicantRole) } },
          }),
          ...(applicantStatus && {
            applicantStatus: { connect: { id: Number(applicantStatus) } },
          }),
        },
      });

      // return {
      //   message: 'Applicant updated successfully',
      //   data: updatedApplicant,
      // };
    } catch (error) {
      handleError(error, id, 'Applicant');
    }
  }
}
