import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ example: 'علی رضایی' })
  @IsString()
  @MinLength(3)
  @MaxLength(150)
  fullName: string;

  @ApiProperty({ example: '09123456789' })
  @IsString()
  @Matches(/^09\d{9}$/, {
    message: 'شماره تماس باید ۱۱ رقم و با 09 شروع شود',
  })
  phone: string;

  @ApiPropertyOptional({ example: '1234567890' })
  @IsOptional()
  @IsString()
  @Length(10, 10)
  @Matches(/^\d{10}$/, {
    message: 'کد ملی باید ۱۰ رقم باشد',
  })
  nationalCode?: string;

  @ApiPropertyOptional({ example: '2005-04-20' })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional({ example: 'حساسیت ثبت‌شده توسط داروساز' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
