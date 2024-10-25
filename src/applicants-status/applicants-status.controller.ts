import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApplicantsStatusService } from './applicants-status.service';
import { Prisma } from '@prisma/client';

@Controller('applicants-status')
export class ApplicantsStatusController {
  constructor(
    private readonly applicantsStatusService: ApplicantsStatusService,
  ) {}

  @Post()
  create(@Body() createApplicantsStatusDto: Prisma.ApplicantStatusCreateInput) {
    return this.applicantsStatusService.create(createApplicantsStatusDto);
  }

  @Get()
  findAll() {
    return this.applicantsStatusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicantsStatusService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateApplicantsStatusDto: Prisma.ApplicantStatusUpdateInput,
  ) {
    return this.applicantsStatusService.update(+id, updateApplicantsStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applicantsStatusService.remove(+id);
  }
}
