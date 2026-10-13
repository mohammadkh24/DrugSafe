import { Module } from '@nestjs/common';
import { MedicationChecksService } from './medication-checks.service';
import { MedicationChecksController } from './medication-checks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Drug } from '../drugs/entities/drug.entity';
import { Interaction } from '../interactions/entities/interaction.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Drug , Interaction])],
  controllers: [MedicationChecksController],
  providers: [MedicationChecksService],
})
export class MedicationChecksModule {}