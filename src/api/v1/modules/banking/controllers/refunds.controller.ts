import { Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RefundsService } from '../services/refunds.service';
import { TransactionsDto, RefundsResponseDto } from '../models/dtos';

@ApiTags('Refunds')
@Controller('refunds')
export class RefundsController {
  constructor(private readonly service: RefundsService) {}

  @Post('/process/:accountId/refunds/:refundsId')
  @ApiOperation({ summary: 'Process Refunds Requests' })
  @ApiBody({
    type: TransactionsDto
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Refunds Request',
    type: RefundsResponseDto
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found'
  })
  refundProcess(
    @Param('accountId') accountId: string,
    @Param('refundsId') refundsId: number
  ): Promise<RefundsResponseDto> {
    return this.service.refundProcess(accountId, refundsId);
  }

  @Post('/approval/:accountId/refunds/:refundsId/:approval')
  @ApiOperation({ summary: 'Approve/Reject Refunds Requests' })
  // @ApiBody({
  //   type: TransactionsDto
  // })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Refunds Request Approval',
    type: RefundsResponseDto
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found'
  })
  refundApproval(
    @Param('accountId') accountId: string,
    @Param('refundsId') refundsId: number,
    @Param('approval') approval = true
  ): Promise<RefundsResponseDto> {
    return this.service.refundApproval(accountId, refundsId, approval);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Refunds Requests',
    type: [RefundsResponseDto]
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found'
  })
  refundsRequests(): Promise<RefundsResponseDto[]> {
    return this.service.refundsRequests();
  }
}
