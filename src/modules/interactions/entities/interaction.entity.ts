import { entityNames } from 'src/common/enums/entity-names.enum';

import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InteractionSeverity } from '../enums/interactions-severity.enum';
import { Drug } from 'src/modules/drugs/entities/drug.entity';

@Entity(entityNames.Interaction)
@Index(['drugAId', 'drugBId'], { unique: true })
@Check('"drugAId" <> "drugBId"')
export class Interaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  drugAId: string;

  @ManyToOne(() => Drug, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'drugAId' })
  drugA: Drug;

  @Column({ type: 'uuid' })
  drugBId: string;

  @ManyToOne(() => Drug, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'drugBId' })
  drugB: Drug;

  @Column({
    type: 'enum',
    enum: InteractionSeverity,
    default: InteractionSeverity.LOW,
  })
  severity: InteractionSeverity;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  recommendation: string | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
