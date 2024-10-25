import { Module } from '@nestjs/common';
import { ApplicantsRoleService } from './applicants-role.service';
import { ApplicantsRoleController } from './applicants-role.controller';

@Module({
  controllers: [ApplicantsRoleController],
  providers: [ApplicantsRoleService],
})
export class ApplicantsRoleModule {}
