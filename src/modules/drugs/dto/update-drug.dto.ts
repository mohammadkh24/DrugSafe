import { PartialType } from '@nestjs/swagger';
import { CreateDrugDto } from './create-drug.dto';

export class UpdateDrugDto extends PartialType(CreateDrugDto) {}
