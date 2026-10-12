import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { InteractionSeverity } from '../enums/interactions-severity.enum';


export class CreateInteractionDto {
  @ApiProperty({
    description: 'شناسه داروی اول',
    example: 'a7b8c9d0-1234-4567-8901-123456789abc',
  })
  @IsUUID()
  drugAId: string;

  @ApiProperty({
    description: 'شناسه داروی دوم',
    example: 'b8c9d0e1-2345-4678-9012-23456789abcd',
  })
  @IsUUID()
  drugBId: string;

  @ApiProperty({
    description: 'شدت تعامل آزمایشی',
    enum: InteractionSeverity,
    example: InteractionSeverity.MODERATE,
  })
  @IsEnum(InteractionSeverity)
  severity: InteractionSeverity;

  @ApiProperty({
    description: 'توضیحات تعامل آزمایشی',
    example: 'این توضیح صرفاً برای تست نرم‌افزار است.',
    minLength: 2,
    maxLength: 2000,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(2000)
  description: string;

  @ApiPropertyOptional({
    description: 'توضیحات تکمیلی آزمایشی',
    example: 'این متن توصیه پزشکی واقعی نیست.',
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  recommendation?: string;
}
