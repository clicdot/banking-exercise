// base.entity.ts
import {
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  Index
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isArchived: boolean;

  @Column({ type: 'boolean', default: false })
  test: boolean;

  @Column({ type: 'varchar', length: 300 })
  createdBy: string;

  @Column({ type: 'varchar', length: 300 })
  lastChangedBy: string;

  @Index()
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}

// export abstract class BaseEntityTest {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ type: 'boolean', default: true })
//   isActive: boolean;

//   @Column({ type: 'boolean', default: false })
//   isArchived: boolean;

//   @Column({ type: 'boolean', default: false })
//   test: boolean;

//   @Column({ type: 'varchar', length: 300 })
//   createdBy: string;

//   @Column({ type: 'varchar', length: 300 })
//   lastChangedBy: string;

//   @Index()
//   @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
//   createdAt: Date;

//   @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
//   updatedAt: Date;
// }
