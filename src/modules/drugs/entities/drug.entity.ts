import { entityNames } from 'src/common/enums/entity-names.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity(entityNames.Drug)
@Index(['genericName'])
@Index(['brandName'])
export class Drug {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  genericName: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  brandName: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  activeIngredient: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  strength: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  dosageForm: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
