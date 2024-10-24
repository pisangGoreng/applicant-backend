import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ApplicantsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createApplicantDto: Prisma.ApplicantCreateInput) {
    return this.databaseService.applicant.create({
      data: {
        ...createApplicantDto,
        applicantRole: {
          connect: { id: Number(createApplicantDto.applicantRole) },
        },
      },
    });
  }

  async findAll() {
    return this.databaseService.applicant.findMany({
      include: {
        applicantRole: { select: { id: true, description: true } },
        applicantStatus: { select: { id: true, description: true } },
      },
    });
  }

  async findOne(id: number) {
    return this.databaseService.applicant.findUnique({
      where: { id },
      include: {
        applicantRole: { select: { id: true, description: true } },
        applicantStatus: { select: { id: true, description: true } },
      },
    });
  }

  async update(id: number, updateApplicantDto: Prisma.ApplicantUpdateInput) {
    return this.databaseService.applicant.update({
      where: { id },
      data: updateApplicantDto,
    });
  }

  async remove(id: number) {
    return this.databaseService.applicant.delete({ where: { id } });
  }
}
