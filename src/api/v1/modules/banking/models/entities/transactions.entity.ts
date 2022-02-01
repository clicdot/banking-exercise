import { IsUUID } from 'class-validator';
import { PrimaryGeneratedColumn, Entity, Column, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TransactionActions, TransactionDetails } from '../interfaces';

@Entity('transactions')
export class TransactionsEntity extends BaseEntity {
  @Index('transactionsAccountNo-idx')
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  @Column({ type: 'varchar' })
  accountNo: string;

  @Column({
    type: 'enum',
    enum: TransactionActions,
    default: TransactionActions.DEPOSIT
  })
  action: TransactionActions;

  @Column({ type: 'money' })
  amount: number;

  @Index('transactionDetails-idx')
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
