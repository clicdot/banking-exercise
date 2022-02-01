// activity-logs.dtos.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  ValidateNested,
  IsDefined,
  IsOptional
} from 'class-validator';
import { AccountEntity } from '../entities';

class AuthUser implements Readonly<AuthUser> {
  @ApiProperty({ type: String, required: true })
  @IsString()
  id: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  email: string;
}

class AccountDetails implements Readonly<AccountDetails> {
  @ApiProperty({ type: String, required: true })
  @IsString()
  fullName: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  streetAddress: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  address2: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  city: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  state: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  postCode: string;
}

export class AccountsDto implements Readonly<AccountsDto> {
  @ApiProperty({ type: AuthUser, required: true })
  @ValidateNested()
  @IsDefined()
  user: AuthUser;

  // @ApiProperty({ type: String, description: '', required: true })
  // @IsString()
  // accountNo: string;

  @ApiProperty({ type: String, description: '', required: true })
  @IsString()
  type: string;

  @ApiProperty({ type: Number, required: true })
  balance: number;

  @ApiProperty({ type: AccountDetails, required: true })
  @ValidateNested()
  accountDetails: AccountDetails;

  @ApiProperty({
    type: Boolean,
    description: 'This field is not required and defaults to false',
    required: false,
    example: false
  })
  @IsString()
  @IsOptional()
  test?: boolean;

  public static from(dto: Partial<AccountEntity>) {
    const accounts = new AccountEntity();
    accounts.id = dto.id;
    accounts.accountNo = dto.accountNo;
    accounts.user = dto.user;
    accounts.type = dto.type;
    accounts.balance = dto.balance;
    accounts.createdAt = dto.createdAt;
    accounts.updatedAt = dto.updatedAt;
    accounts.accountDetails = dto.accountDetails;
    return accounts;
  }

  public static fromEntity(entity: AccountEntity) {
    return this.from({
      id: entity.id,
      accountNo: entity.accountNo,
      user: entity.user,
      type: entity.type,
      balance: entity.balance,
      accountDetails: entity.accountDetails,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    });
  }

  public static toEntity(dto: Partial<AccountsDto>, user: AuthUser) {
    const accounts = new AccountEntity();
    // activity.id = dto.id;
    // accounts.accountNo = dto.accountNo;
    accounts.user = dto.user;
    accounts.type = dto.type;
    accounts.balance = dto.balance;
    accounts.accountDetails = dto.accountDetails;
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

export class AccountsResponseDto implements Readonly<AccountsResponseDto> {
  @ApiProperty({ type: Number, required: true, example: 20 })
  id: number;

  @ApiProperty({ type: AuthUser, required: true })
  @ValidateNested()
  @IsDefined()
  user: AuthUser;

  @ApiProperty({
    type: String,
    format: 'uuid',
    description: '',
    required: true
  })
  @IsString()
  accountNo: string;

  @ApiProperty({ type: String, description: '', required: true })
  @IsString()
  type: string;

  @ApiProperty({ type: Number, required: true })
  balance: number;

  @ApiProperty({ type: AccountDetails, required: true })
  @ValidateNested()
  accountDetails: AccountDetails;

  @ApiProperty({ type: Date, required: true })
  createdAt: Date;

  @ApiProperty({ type: Date, required: true })
  updatedAt: Date;
}
