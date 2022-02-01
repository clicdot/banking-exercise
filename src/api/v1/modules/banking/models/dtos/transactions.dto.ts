// activity-logs.dtos.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  ValidateNested,
  IsDate,
  IsDefined,
  IsOptional,
  IsEnum
} from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionsEntity } from '../entities';
import { TransactionActions, TransactionType } from '../interfaces';

class AuthUser implements Readonly<AuthUser> {
  @ApiProperty({ type: String, required: true })
  @IsString()
  id: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  email: string;
}

class Actions implements Readonly<Actions> {
  @ApiProperty({ type: String, required: true })
  @IsString()
  id: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  email: string;
}

class TransactionDetails implements Readonly<TransactionDetails> {
  @ApiProperty({ type: String, required: true })
  @IsString()
  type: TransactionType;

  @ApiProperty({ type: String, required: false })
  @IsString()
  from?: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  to?: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  vendor?: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  note?: string;
}

export class TransactionsDto implements Readonly<TransactionsDto> {
  @ApiProperty({ type: String, description: '', required: true })
  @IsString()
  accountNo: string;

  @ApiProperty({ type: Actions, description: '', required: true })
  @IsEnum(TransactionActions)
  @IsString()
  action: TransactionActions;

  @ApiProperty({ type: Number, required: true })
  amount: number;

  @ApiProperty({ type: TransactionDetails, required: true })
  @ValidateNested()
  transactionDetails: TransactionDetails;

  @ApiProperty({
    type: Boolean,
    description: 'This field is not required and defaults to false',
    required: false,
    example: false
  })
  @IsString()
  @IsOptional()
  test?: boolean;

  public static from(dto: Partial<TransactionsEntity>) {
    const accounts = new TransactionsEntity();
    accounts.id = dto.id;
    accounts.accountNo = dto.accountNo;
    accounts.action = dto.action;
    accounts.amount = dto.amount;
    accounts.transactionDetails = dto.transactionDetails;
    accounts.createdAt = dto.createdAt;
    accounts.updatedAt = dto.updatedAt;
    return accounts;
  }

  public static fromEntity(entity: TransactionsEntity) {
    return this.from({
      id: entity.id,
      accountNo: entity.accountNo,
      action: entity.action,
      amount: entity.amount,
      transactionDetails: entity.transactionDetails,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    });
  }

  public static toEntity(dto: Partial<TransactionsDto>, user: AuthUser) {
    const accounts = new TransactionsEntity();
    // activity.id = dto.id;
    accounts.accountNo = dto.accountNo;
    accounts.action = dto.action;
    accounts.amount = dto.amount;
    accounts.transactionDetails = dto.transactionDetails;
    accounts.isActive = true;
    accounts.isArchived = false;
    accounts.test = dto.test || false;
    accounts.createdBy = user.email;
    accounts.lastChangedBy = user.email;
    accounts.updatedAt = new Date();
    accounts.createdAt = new Date();
    return accounts;
  }
}

export class TransactionsResponseDto
  implements Readonly<TransactionsResponseDto>
{
  @ApiProperty({ type: Number, required: true, example: 20 })
  id: number;

  @ApiProperty({ type: String, description: '', required: true })
  @IsString()
  accountNo: string;

  @ApiProperty({ type: Actions, description: '', required: true })
  @IsEnum(TransactionActions)
  @IsString()
  action: TransactionActions;

  @ApiProperty({ type: Number, required: true })
  amount: number;

  @ApiProperty({ type: TransactionDetails, required: true })
  @ValidateNested()
  transactionDetails: TransactionDetails;

  @ApiProperty({ type: Date, required: true })
  createdAt: Date;

  @ApiProperty({ type: Date, required: true })
  updatedAt: Date;
}
