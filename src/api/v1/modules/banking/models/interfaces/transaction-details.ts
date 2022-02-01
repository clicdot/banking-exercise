export enum TransactionType {
  DEBIT = 'debit',
  CREDIT = 'credit'
}

export interface TransactionDetails {
  type: TransactionType;
  from?: string;
  to?: string;
  vendor?: string;
  transactionId?: number;
  note?: string;
}
