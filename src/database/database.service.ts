import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

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
      if (params.model === 'Applicant' && params.action === 'create') {
        const appliedStatus = await this.applicantStatus.findUnique({
          where: { description: 'applied' },
        });

        if (!params.args.data.applicantStatus && appliedStatus) {
          params.args.data.applicantStatus = {
            connect: { id: appliedStatus.id },
          };
        }
      }

      return next(params);
    });
  }
}
