import { entityNames } from 'src/common/enums/entity-names.enum';
import { Customer } from 'src/modules/customers/entities/customer.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PrescriptionItem } from './prescription-item.entity';
import { PrescriptionInteraction } from './prescription-interaction.entity';
import { PrescriptionStatus } from '../enums/Prescription-Status.enum';

@Entity(entityNames.Prescription)
@Index(['customerId', 'createdAt'])
export class Prescription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  customerId: string;

  @ManyToOne(() => Customer, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column({
    type: 'enum',
    enum: PrescriptionStatus,
    default: PrescriptionStatus.ACTIVE,
  })
  status: PrescriptionStatus;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @OneToMany(() => PrescriptionItem, (item) => item.prescription, {
    cascade: false,
  })
  items: PrescriptionItem[];

  @OneToMany(
    () => PrescriptionInteraction,
    (interaction) => interaction.prescription,
    { cascade: false },
  )
  interactionResults: PrescriptionInteraction[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
