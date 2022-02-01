import { Body, Controller, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionsService } from '../services/transactions.service';
import {
  TransactionsDto
  // TransactionsResponseDto
} from '../../banking/models/dtos';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}
}
