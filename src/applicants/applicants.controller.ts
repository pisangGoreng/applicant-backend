import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApplicantsService } from './applicants.service';
import { Prisma } from '@prisma/client';
import { GetApplicantsDto } from './dto/get-applicants.dto';
import { ApiResponse } from 'src/common/utils/api-response';

@Controller('applicants')
export class ApplicantsController {
  constructor(private readonly applicantsService: ApplicantsService) {}

  @Post()
  async create(@Body() createApplicantDto: Prisma.ApplicantCreateInput) {
    return new ApiResponse(
      true,
      'Applicant created successfully',
      await this.applicantsService.create(createApplicantDto),
      false,
    );
  }

  @Get()
  async findAll(@Query() queryPagination: GetApplicantsDto) {
    return new ApiResponse(
      true,
      'All Applicant fetched successfully',
      await this.applicantsService.findAllByQuery(queryPagination),
      false,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return new ApiResponse(
      true,
      'Applicant fetched successfully',
      await this.applicantsService.findOne(+id),
      false,
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateApplicantDto: Prisma.ApplicantUpdateInput,
  ) {
    return new ApiResponse(
      true,
      'Applicant updated successfully',
      await this.applicantsService.update(+id, updateApplicantDto),
      false,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return new ApiResponse(
      true,
      'Applicant deleted successfully',
      await this.applicantsService.remove(+id),
      false,
    );
  }
}
