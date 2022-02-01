import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  Post,
  Delete
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { AccountsService } from '../services/accounts.service';
import { AccountsDto, AccountsResponseDto } from '../models/dtos';
import { TransactionsResponseDto } from '../models/dtos/transactions.dto';
import { TransactionsEntity } from '../models/entities/transactions.entity';

@ApiTags('Accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly service: AccountsService) {}

  @Get()
  @ApiOperation({ summary: 'Get Accounts' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Activity Logs',
    type: [AccountsResponseDto]
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found'
  })
  accounts(): Promise<AccountsResponseDto[]> {
    return this.service.accounts();
  }

  @Get('/:accountId')
  @ApiOperation({ summary: 'Get Accounts' })
  @ApiParam({
    name: 'accountId',
    required: false
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Activity Logs',
    type: [AccountsResponseDto]
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found'
  })
  accountsById(
    @Param('accountId') accountId: string
  ): Promise<AccountsResponseDto[]> {
    return this.service.accountsById(accountId);
  }

  @Post('/create')
  @ApiOperation({ summary: 'Create Accounts' })
  @ApiBody({
    type: AccountsDto
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Activity Logs',
    type: AccountsResponseDto
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found'
  })
  create(@Body() dto) {
    return this.service.create(dto);
  }

  @Post('/modify/:accountId')
  @ApiOperation({ summary: 'Modify Accounts' })
  @ApiBody({
    type: AccountsDto
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Activity Logs',
    type: AccountsResponseDto
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found'
  })
  modify(@Param('accountId') accountId: string, @Body() dto) {
    return this.service.modify(accountId, dto);
  }

  @Delete('/delete/:accountId')
  @ApiOperation({ summary: 'Delete Accounts' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Activity Logs',
    type: AccountsResponseDto
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found'
  })
  delete(@Param('accountId') accountId: string) {
    return this.service.delete(accountId);
  }

  @Post('/deposit/:accountId')
  @ApiOperation({ summary: 'Deposit into Accounts' })
  @ApiBody({
    schema: {
      properties: {
        amount: {
          type: 'number',
          minLength: 1,
          examples: [0, 0.0, 0.05, 19.95, 255.5, 120000]
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Account Deposit',
    type: AccountsResponseDto
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found'
  })
  deposit(
    @Param('accountId') accountId: string,
    @Body('amount') amount: number
  ): Promise<AccountsResponseDto> {
    return this.service.deposit(accountId, amount);
  }

  @Post('/withdrawal/:accountId')
  @ApiOperation({ summary: 'Withdraw from Accounts' })
  @ApiBody({
    schema: {
      properties: {
        amount: {
          type: 'number',
          minLength: 1,
          examples: [0, 0.0, 0.05, 19.95, 255.5, 120000]
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Account Withdrawal',
    type: AccountsResponseDto
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found'
  })
  withdrawal(
    @Param('accountId') accountId: string,
    @Body('amount') amount: number
  ): Promise<AccountsResponseDto> {
    return this.service.withdrawal(accountId, amount);
  }

  @Post('/transfer/:fromAccountId/to/:toAccountId')
  @ApiOperation({ summary: 'Transfer to another Accounts' })
  @ApiBody({
    schema: {
      properties: {
        amount: {
          type: 'number',
          minLength: 1,
          examples: [0, 0.0, 0.05, 19.95, 255.5, 120000]
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Account Transfer',
    type: AccountsResponseDto
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found'
  })
  transfer(
    @Param('fromAccountId') fromAccountId: string,
    @Param('toAccountId') toAccountId: string,
    @Body('amount') amount: number
  ): Promise<AccountsResponseDto> {
    return this.service.transfer(fromAccountId, toAccountId, amount);
  }

  @Post('/transactions/:accountId')
  @ApiOperation({ summary: 'Get Transactions for Accounts' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Account Transactions',
    type: TransactionsResponseDto
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden',
    type: [TransactionsResponseDto]
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found'
  })
  transactions(
    @Param('accountId') accountId: string,
    @Body('dates') dates?: Date[]
  ): Promise<TransactionsResponseDto[]> {
    return this.service.transactions(accountId, dates);
  }
}
