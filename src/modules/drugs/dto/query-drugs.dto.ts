import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class QueryDrugsDto {
  @ApiPropertyOptional({
    description: 'Search by generic name, brand name or active ingredient',
    example: 'demo',
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by brand name',
    example: 'DemoBrand A',
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  brandName?: string;

  @ApiPropertyOptional({
    description: 'Filter by active ingredient',
    example: 'demo-substance-alpha',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  activeIngredient?: string;

  @ApiPropertyOptional({
    description: 'Filter by dosage form',
    example: 'tablet',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  dosageForm?: string;

  @ApiPropertyOptional({
    description: 'Filter by active status',
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

  @ApiPropertyOptional({ example: 1, default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    example: 10,
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
    enum: ['genericName', 'brandName', 'createdAt'],
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  @IsIn(['genericName', 'brandName', 'createdAt'])
  sortBy: 'genericName' | 'brandName' | 'createdAt' = 'createdAt';

  @ApiPropertyOptional({
    enum: ['ASC', 'DESC'],
    default: 'DESC',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    return value.toUpperCase();
  })
  @IsIn(['ASC', 'DESC'])
  sortOrder: 'ASC' | 'DESC' = 'DESC';
}
