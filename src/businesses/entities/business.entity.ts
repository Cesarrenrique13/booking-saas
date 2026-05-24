import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BusinessCategory } from '../enums/business-category.enum';
import { User } from '@/users/entities/user.entity';
import { Service } from '@/services/entities/service.entity';

@Entity('businesses')
export class Business {
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
    type: 'enum',
    enum: BusinessCategory,
  })
  category: BusinessCategory;

  @Column({
    type: 'varchar',
    length: 255,
  })
  address: string;

  @Column({
    type: 'varchar',
    length: 60,
    nullable: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 15,
    nullable: true,
  })
  phone: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isVerified: boolean;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 120, unique: true })
  slug: string;

  @ManyToOne(() => User, (user) => user.businesses)
  @JoinColumn({ name: 'user_id' })
  owner: User;

  @OneToMany(() => Service, (service) => service.business)
  services: Service[];

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  generateSlug() {
    const slug = this.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    this.slug = slug;
  }

  @BeforeUpdate()
  slugifyUpdate() {
    this.generateSlug();
  }
}
