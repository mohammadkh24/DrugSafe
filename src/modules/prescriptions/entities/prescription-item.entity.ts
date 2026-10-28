import { entityNames } from 'src/common/enums/entity-names.enum';
import { Drug } from 'src/modules/drugs/entities/drug.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Prescription } from './prescription.entity';

@Entity(entityNames.PrescriptionItem)
export class PrescriptionItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  prescriptionId: string;

  @ManyToOne(() => Prescription, (prescription) => prescription.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'prescriptionId' })
  prescription: Prescription;

  @Column({ type: 'uuid' })
  drugId: string;

  @ManyToOne(() => Drug, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'drugId' })
  drug: Drug;

  // Snapshot مشخصات دارو در زمان ثبت نسخه
  @Column({ type: 'varchar', length: 150 })
  drugName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  strength: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  dosage: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  frequency: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  duration: string | null;

  @Column({ type: 'text', nullable: true })
  instructions: string | null;

  @Column({ type: 'int', default: 1 })
  quantity: number;
}