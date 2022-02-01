import { Module } from '@nestjs/common';
import { RouterModule } from 'nest-router';

import { v1Routes } from './v1.Routes';
import { BankingModule } from './modules/banking/banking.module';

@Module({
  imports: [RouterModule.forRoutes(v1Routes), BankingModule],
  controllers: [],
  providers: []
})
export class V1Module {}
