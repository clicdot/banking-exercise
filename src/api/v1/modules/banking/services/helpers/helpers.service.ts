import { Injectable } from '@nestjs/common';
import { RefundsStatus } from '../../models/interfaces/refunds';

@Injectable()
export class HelpersService {
  private dollarConverter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  convertDollarToNumber(dollar) {
    return Number(dollar.replace(/[^0-9.-]+/g, ''));
  }

  deposit(amount, balance) {
    return amount + balance;
  }

  withdrawal(amount, balance) {
    return balance - amount;
  }

  getTransactionDates(dates?: Date[]) {
    if (!dates) {
      const date = new Date();
      const y = date.getFullYear();
      const m = date.getMonth();
      const firstDay = new Date(y, m, 1);
      const lastDay = new Date(y, m + 1, 0);
      lastDay.setDate(lastDay.getDate() + 1);
      return [firstDay, lastDay];
    } else {
      const date1 = new Date(dates[0]);
      const date2 = new Date(dates[1]);
      date2.setDate(date2.getDate() + 1);

      if (date1.getTime() < date2.getTime()) {
        return [
          `${new Date(date1).toISOString().slice(0, 10)}T00:00:00.000Z`,
          `${new Date(date2).toISOString().slice(0, 10)}T00:00:00.000Z`
        ];
      } else {
        return [
          `${new Date(date1).toISOString().slice(0, 10)}T00:00:00.000Z`,
          `${new Date(date2).toISOString().slice(0, 10)}T00:00:00.000Z`
        ];
      }
    }
  }

  dollarFormatter(amount) {
    return this.dollarConverter.format(amount);
  }

  copyJson(json) {
    const copy = JSON.parse(JSON.stringify(json));
    copy.status = RefundsStatus.PENDING;
    copy.transactionId = copy.id;
    copy.transactionDetails.note = `Refund Creation: Account No: ${copy.accountNo} for amount ${copy.amount}`;
    return copy;
  }
}
