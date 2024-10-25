import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { handleError } from 'src/common/utils/error-handler';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  constructor() {
    super();
    this.createApplicantMiddleware();
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('Connected to database');
    } catch (error) {
      console.log(error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect().catch((error) => {
      console.error('Error disconnecting from database:', error);
    });
  }

  /**
   * A middleware that sets default status to "applied" for new applicants.
   *
   * It will only run on Applicant create operations, and will only set the
   * applicantStatus if the create operation does not already specify it.
   */
  private createApplicantMiddleware() {
    this.$use(async (params, next) => {
      try {
        if (params.model === 'Applicant' && params.action === 'create') {
          const appliedStatus = await this.applicantStatus.findUnique({
            where: { description: 'applied' },
          });

          if (!appliedStatus) {
            throw new NotFoundException(
              `Status with description "applied" not found`,
            );
          }

          if (!params.args.data.applicantStatus && appliedStatus) {
            params.args.data.applicantStatus = {
              connect: { id: appliedStatus.id },
            };
          }
        }

        return next(params);
      } catch (error) {
        handleError(error, null, 'ApplicantStatus');
      }
    });
  }
}
