
import { entityNames } from 'src/common/enums/entity-names.enum';
import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity(entityNames.Customer)
  @Index('IDX_customers_phone', ['phone'])
  export class Customer {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'varchar', length: 150 })
    fullName: string;
  
    @Column({ type: 'varchar', length: 20 })
    phone: string;
  
    @Column({
      type: 'varchar',
      length: 10,
      nullable: true,
    })
    nationalCode: string | null;
  
    @Column({ type: 'date', nullable: true })
    birthDate: string | null;
  
    @Column({ type: 'text', nullable: true })
    notes: string | null;
  
    @Column({ type: 'boolean', default: true })
    isActive: boolean;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  