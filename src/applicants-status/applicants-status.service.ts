import { Injectable } from '@nestjs/common';
import { ApplicantStatus, Prisma } from '@prisma/client';
import { BaseService } from 'src/common/services/base.service';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ApplicantsStatusService extends BaseService<
  ApplicantStatus,
  Prisma.ApplicantStatusCreateInput,
  Prisma.ApplicantStatusUpdateInput
> {
  public uniqueFieldsModel: string[];
  constructor(databaseService: DatabaseService) {
    super(databaseService, databaseService.applicantStatus, ['description']);
    this.uniqueFieldsModel = ['description'];
  }
}
