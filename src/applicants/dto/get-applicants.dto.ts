import { IsOptional, IsInt, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class GetApplicantsDto {
  @IsOptional()
  @Type(() => Number) // Transform query param to number
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number) // Transform query param to number
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsString()
  applicantRole?: string;

  @IsOptional()
  @IsString()
  applicantStatus?: string;

  @IsOptional()
  @IsString()
  location?: string;
}
