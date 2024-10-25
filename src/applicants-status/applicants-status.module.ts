import { Module } from '@nestjs/common';
import { ApplicantsStatusService } from './applicants-status.service';
import { ApplicantsStatusController } from './applicants-status.controller';

@Module({
  controllers: [ApplicantsStatusController],
  providers: [ApplicantsStatusService],
})
export class ApplicantsStatusModule {}
