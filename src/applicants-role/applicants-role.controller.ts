import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApplicantsRoleService } from './applicants-role.service';
import { Prisma } from '@prisma/client';
import { ApiResponse } from 'src/common/utils/api-response';

@Controller('applicants-role')
export class ApplicantsRoleController {
  constructor(private readonly applicantsRoleService: ApplicantsRoleService) {}

  @Post()
  async create(
    @Body() createApplicantsRoleDto: Prisma.ApplicantRoleCreateInput,
  ) {
    return new ApiResponse(
      true,
      'Applicant Role created successfully',
      await this.applicantsRoleService.create(createApplicantsRoleDto),
      false,
    );
  }

  @Get()
  async findAll() {
    return new ApiResponse(
      true,
      'All Applicant Role fetched successfully',
      await this.applicantsRoleService.findAll(),
      false,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return new ApiResponse(
      true,
      'Applicant Role fetched successfully',
      await this.applicantsRoleService.findOne(+id),
      false,
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateApplicantsRoleDto: Prisma.ApplicantRoleUpdateInput,
  ) {
    return new ApiResponse(
      true,
      'Applicant Role updated successfully',
      await this.applicantsRoleService.update(+id, updateApplicantsRoleDto),
      false,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return new ApiResponse(
      true,
      'Applicant Role deleted successfully',
      await this.applicantsRoleService.remove(+id),
      false,
    );
  }
}
