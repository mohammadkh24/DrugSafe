
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePrescriptionItemDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID('4')
  drugId: string;

  @ApiProperty({ example: 'یک قرص' })
  @IsString()
  @MaxLength(100)
  dosage: string;

  @ApiProperty({ example: 'هر ۸ ساعت' })
  @IsString()
  @MaxLength(100)
  frequency: string;

  @ApiProperty({ example: '۷ روز' })
  @IsString()
  @MaxLength(100)
  duration: string;

  @ApiPropertyOptional({ example: 'بعد از غذا' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  instructions?: string;

  @ApiProperty({ example: 21, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreatePrescriptionDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID('4')
  customerId: string;

  @ApiPropertyOptional({ example: 'توضیحات نسخه' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;

  @ApiProperty({ type: [CreatePrescriptionItemDto], minItems: 1, maxItems: 10 })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => CreatePrescriptionItemDto)
  items: CreatePrescriptionItemDto[];
}
