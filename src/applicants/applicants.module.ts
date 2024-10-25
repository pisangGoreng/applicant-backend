import { Module } from '@nestjs/common';
import { ApplicantsService } from './applicants.service';
import { ApplicantsController } from './applicants.controller';
import { ApplicantsRoleModule } from 'src/applicants-role/applicants-role.module';

@Module({
  imports: [ApplicantsRoleModule],
  controllers: [ApplicantsController],
  providers: [ApplicantsService],
})
export class ApplicantsModule {}
