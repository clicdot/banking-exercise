import { IsUUID } from 'class-validator';
import { PrimaryGeneratedColumn, Entity, Column, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import {
  RefundsStatus,
  TransactionActions,
  TransactionDetails
} from '../interfaces';

@Entity('refunds')
export class RefundsEntity extends BaseEntity {
  @Index('refundsAccountNo-idx')
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  @Column({ type: 'varchar' })
  accountNo: string;

  @Column({ type: 'bigint', nullable: false })
  transactionId: number;

  @Column({ type: 'enum', enum: RefundsStatus, default: RefundsStatus.PENDING })
  status: RefundsStatus;

  @Column({
    type: 'enum',
    enum: TransactionActions,
    default: TransactionActions.DEPOSIT
  })
  action: TransactionActions;

  @Column({ type: 'money' })
  amount: number;

  @Index('refundsDetails-idx')
  @Column({ type: 'jsonb' })
  transactionDetails: TransactionDetails;
}

// @Entity('transactions')
// export class TransactionsEntityTest extends BaseEntityTest {
//   @Index('transactionsAccountNo-idx')
//   @PrimaryGeneratedColumn('uuid')
//   @IsUUID()
//   @Column({ type: 'varchar' })
//   accountNo: string;

//   @Column({
//     type: 'varchar'
//   })
//   action: TransactionActions;

//   @Column({ type: 'double' })
//   amount: number;

//   @Index('transactionDetails-idx')
//   @Column({ type: 'varchar' })
//   transactionDetails: string;
// }
