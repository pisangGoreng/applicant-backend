import { PartialType } from '@nestjs/mapped-types';
import { CreateApplicantsStatusDto } from './create-applicants-status.dto';

export class UpdateApplicantsStatusDto extends PartialType(CreateApplicantsStatusDto) {}
