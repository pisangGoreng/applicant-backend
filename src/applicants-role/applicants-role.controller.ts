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

@Controller('applicants-role')
export class ApplicantsRoleController {
  constructor(private readonly applicantsRoleService: ApplicantsRoleService) {}

  @Post()
  create(@Body() createApplicantsRoleDto: Prisma.ApplicantRoleCreateInput) {
    return this.applicantsRoleService.create(createApplicantsRoleDto);
  }

  @Get()
  findAll() {
    return this.applicantsRoleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicantsRoleService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateApplicantsRoleDto: Prisma.ApplicantRoleUpdateInput,
  ) {
    return this.applicantsRoleService.update(+id, updateApplicantsRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applicantsRoleService.remove(+id);
  }
}
