import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ApplicantsModule } from './applicants/applicants.module';
import { ApplicantsRoleModule } from './applicants-role/applicants-role.module';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getLoggerConfig } from './config/logger.config';
import { ApplicantsStatusModule } from './applicants-status/applicants-status.module';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getLoggerConfig,
    }),
    ConfigModule.forRoot(),
    DatabaseModule,
    ApplicantsModule,
    ApplicantsRoleModule,
    ApplicantsStatusModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
