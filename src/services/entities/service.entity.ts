import { Business } from '@/businesses/entities/business.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  UpdateDateColumn,
} from 'typeorm';
import { JoinColumn } from 'typeorm/browser';
import { ManyToOne } from 'typeorm/browser';
import { PrimaryGeneratedColumn } from 'typeorm/browser';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'int',
    unsigned: true,
  })
  price: number;

  @Column({
    type: 'uuid',
  })
  businessId: string;

  @ManyToOne(() => Business, (business) => business.services)
  @JoinColumn({ name: 'user_service' })
  business: Business;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
