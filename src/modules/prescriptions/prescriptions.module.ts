
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomersModule } from '../customers/customers.module';
import { Customer } from '../customers/entities/customer.entity';
import { Drug } from '../drugs/entities/drug.entity';
import { Interaction } from '../interactions/entities/interaction.entity';
import { MedicationChecksModule } from '../medication-checks/medication-checks.module';

import { PrescriptionsController } from './prescriptions.controller';
import { PrescriptionsService } from './prescriptions.service';
import { Prescription } from './entities/prescription.entity';
import { PrescriptionItem } from './entities/prescription-item.entity';
import { PrescriptionInteraction } from './entities/prescription-interaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customer,
      Drug,
      Interaction,
      Prescription,
      PrescriptionItem,
      PrescriptionInteraction,
    ]),
    CustomersModule,
    MedicationChecksModule,
  ],
  controllers: [PrescriptionsController],
  providers: [PrescriptionsService],
  exports: [PrescriptionsService],
})
export class PrescriptionsModule {}
