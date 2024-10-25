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
import { ApiResponse } from 'src/common/utils/api-response';

@Controller('applicants-status')
export class ApplicantsStatusController {
  constructor(
    private readonly applicantsStatusService: ApplicantsStatusService,
  ) {}

  @Post()
  async create(
    @Body() createApplicantsStatusDto: Prisma.ApplicantStatusCreateInput,
  ) {
    return new ApiResponse(
      true,
      'Applicant Status created successfully',
      await this.applicantsStatusService.create(createApplicantsStatusDto),
      false,
    );
  }

  @Get()
  async findAll() {
    return new ApiResponse(
      true,
      'All Applicant Status fetched successfully',
      await this.applicantsStatusService.findAll(),
      false,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return new ApiResponse(
      true,
      'Applicant Status fetched successfully',
      await this.applicantsStatusService.findOne(+id),
      false,
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateApplicantsStatusDto: Prisma.ApplicantStatusUpdateInput,
  ) {
    return new ApiResponse(
      true,
      'Applicant Status updated successfully',
      await this.applicantsStatusService.update(+id, updateApplicantsStatusDto),
      false,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return new ApiResponse(
      true,
      'Applicant Status deleted successfully',
      await this.applicantsStatusService.remove(+id),
      false,
    );
  }
}
