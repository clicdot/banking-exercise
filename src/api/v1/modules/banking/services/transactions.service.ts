import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HelpersService } from './helpers/helpers.service';
import { TransactionsDto, RefundsDto } from '../models/dtos';
import { TransactionsEntity } from '../models/entities';
import { RefundsEntity } from '../models/entities/refunds.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(RefundsEntity)
    private readonly refundsModel: Repository<RefundsEntity>,
    @InjectRepository(TransactionsEntity)
    private readonly transactionsModel: Repository<TransactionsEntity>,
    private readonly __helpers: HelpersService
  ) {}

  create(data) {
    try {
      return this.transactionsModel
        .save(TransactionsDto.toEntity(data, data.user))
        .then((e) => TransactionsDto.fromEntity(e));
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
