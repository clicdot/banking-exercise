import { IsUUID } from 'class-validator';
import { PrimaryGeneratedColumn, Entity, Column, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { AccountDetails } from '../interfaces/account-details';
import { AuthUser } from '../interfaces';

@Entity('accounts')
export class AccountEntity extends BaseEntity {
  @Index('accountNo-idx')
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  @Column({ type: 'varchar' })
  accountNo: string;

  @Index('AuthUser-idx')
  @Column({ type: 'jsonb' })
  user: AuthUser;

  @Column({ type: 'varchar', length: 100 })
  type: string;

  @Column({ type: 'money' })
  balance: number;

  @Column({ type: 'jsonb' })
  accountDetails: AccountDetails;
}

// @Entity('accounts')
// export class AccountEntityTest extends BaseEntityTest {
//   @Index('accountNo-idx')
//   @PrimaryGeneratedColumn('uuid')
//   @IsUUID()
//   @Column({ type: 'varchar' })
//   accountNo: string;

//   @Column({ type: 'varchar', length: 100 })
//   type: string;

//   @Column({ type: 'double' })
//   balance: number;

//   @Column({ type: 'varchar' })
//   accountDetails: string;
// }
