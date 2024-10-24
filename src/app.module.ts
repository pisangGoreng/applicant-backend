import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ApplicantsModule } from './applicants/applicants.module';

@Module({
  imports: [DatabaseModule, ApplicantsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
