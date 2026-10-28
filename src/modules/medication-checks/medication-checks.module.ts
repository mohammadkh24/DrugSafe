import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Drug } from '../drugs/entities/drug.entity';
import { Interaction } from '../interactions/entities/interaction.entity';
import { MedicationChecksController } from './medication-checks.controller';
import { MedicationChecksService } from './medication-checks.service';

@Module({
  imports: [TypeOrmModule.forFeature([Drug, Interaction])],
  controllers: [MedicationChecksController],
  providers: [MedicationChecksService],
  exports: [MedicationChecksService],
})
export class MedicationChecksModule {}
