import { Injectable } from '@nestjs/common';
import { ApplicantRole, Prisma } from '@prisma/client';
import { BaseService } from 'src/common/services/base.service';

import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ApplicantsRoleService extends BaseService<
  ApplicantRole,
  Prisma.ApplicantRoleCreateInput,
  Prisma.ApplicantRoleUpdateInput
> {
  constructor(databaseService: DatabaseService) {
    super(databaseService, databaseService.applicantRole);
  }
}
