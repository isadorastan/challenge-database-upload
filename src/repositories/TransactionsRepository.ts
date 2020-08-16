import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();
    const incomeTotal = this.sumTotalByType(transactions, 'income');
    const outcomeTotal = this.sumTotalByType(transactions, 'outcome');

    return {
      income: incomeTotal,
      outcome: outcomeTotal,
      total: incomeTotal - outcomeTotal,
    };
  }

  private sumTotalByType(
    transactions: Transaction[],
    type: 'income' | 'outcome',
  ) {
    return transactions.reduce((acc, obj) => {
      if (obj.type === type) {
        acc = acc + Number(obj.value);
      }
      return acc;
    }, 0);
  }
}

export default TransactionsRepository;
