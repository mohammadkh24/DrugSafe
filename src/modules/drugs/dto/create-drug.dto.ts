
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateDrugDto {
  @ApiProperty({
    description: 'Generic name of the drug',
    example: 'DemoDrug Alpha',
    minLength: 2,
    maxLength: 150,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  genericName: string;

  @ApiPropertyOptional({
    description: 'Brand name of the drug',
    example: 'DemoBrand A',
    maxLength: 150,
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  brandName?: string;

  @ApiPropertyOptional({
    description: 'Active ingredient of the drug',
    example: 'demo-substance-alpha',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  activeIngredient?: string;

  @ApiPropertyOptional({
    description: 'Drug strength or concentration',
    example: '100 mg',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  strength?: string;

  @ApiPropertyOptional({
    description: 'Pharmaceutical dosage form',
    example: 'tablet',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  dosageForm?: string;

  @ApiPropertyOptional({
    description: 'Additional description of the drug',
    example: 'Fictional data for software testing only',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Whether the drug is active',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
