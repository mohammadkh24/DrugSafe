import { entityNames } from 'src/common/enums/entity-names.enum';
import { InteractionSeverity } from 'src/modules/interactions/enums/interactions-severity.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Prescription } from './prescription.entity';

@Entity(entityNames.PrescriptionInteraction)
export class PrescriptionInteraction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  prescriptionId: string;

  @ManyToOne(
    () => Prescription,
    (prescription) => prescription.interactionResults,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'prescriptionId' })
  prescription: Prescription;

  @Column({ type: 'uuid' })
  drugAId: string;

  @Column({ type: 'uuid' })
  drugBId: string;

  @Column({ type: 'varchar', length: 150 })
  drugAName: string;

  @Column({ type: 'varchar', length: 150 })
  drugBName: string;

  @Column({ type: 'boolean', default: false })
  interactionFound: boolean;

  @Column({ type: 'uuid', nullable: true })
  interactionId: string | null;

  @Column({
    type: 'enum',
    enum: InteractionSeverity,
    nullable: true,
  })
  severity: InteractionSeverity | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'text', nullable: true })
  recommendation: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  checkedAt: Date;
}