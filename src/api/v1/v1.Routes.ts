import { Routes } from 'nest-router';

import { BankingModule } from './modules/banking/banking.module';

export const v1Routes: Routes = [
  {
    path: '/v1',
    children: [
      {
        path: '/banking',
        module: BankingModule
      }
    ]
  }
];
