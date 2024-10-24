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

@Controller('applicants')
export class ApplicantsController {
  constructor(private readonly applicantsService: ApplicantsService) {}

  @Post()
  async create(@Body() createApplicantDto: Prisma.ApplicantCreateInput) {
    return await this.applicantsService.create(createApplicantDto);
  }

  @Get()
  findAll(@Query() queryPagination: GetApplicantsDto) {
    return this.applicantsService.findAll(queryPagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicantsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateApplicantDto: Prisma.ApplicantUpdateInput,
  ) {
    return this.applicantsService.update(+id, updateApplicantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applicantsService.remove(+id);
  }
}
