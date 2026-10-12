import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { InteractionSeverity } from '../enums/interactions-severity.enum';


export class QueryInteractionsDto {
  @ApiPropertyOptional({
    description: 'جست‌وجو در توضیحات تعامل و توصیه',
    example: 'demo interaction',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  search?: string;

  @ApiPropertyOptional({
    description: 'فیلتر بر اساس شناسه داروی اول یا دوم',
    example: 'a7b8c9d0-1234-4567-8901-123456789abc',
  })
  @IsOptional()
  @IsUUID()
  drugId?: string;

  @ApiPropertyOptional({
    description: 'فیلتر بر اساس شدت تعامل',
    enum: InteractionSeverity,
  })
  @IsOptional()
  @IsEnum(InteractionSeverity)
  severity?: InteractionSeverity;

  @ApiPropertyOptional({
    description: 'فیلتر بر اساس وضعیت فعال بودن',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'شماره صفحه',
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    description: 'تعداد رکورد در هر صفحه',
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @ApiPropertyOptional({
    description: 'فیلد مرتب‌سازی',
    enum: ['createdAt', 'updatedAt', 'severity'],
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  @IsIn(['createdAt', 'updatedAt', 'severity'])
  sortBy: 'createdAt' | 'updatedAt' | 'severity' = 'createdAt';

  @ApiPropertyOptional({
    description: 'جهت مرتب‌سازی',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsIn(['ASC', 'DESC'])
  sortOrder: 'ASC' | 'DESC' = 'DESC';
}
