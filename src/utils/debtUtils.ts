import type { Debt } from '../types';

export const calculateTotalOwed = (debts: Debt[]): number => {
  return debts.reduce((sum, debt) => !debt.isPaid ? sum + debt.amount : sum, 0);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const sortDebts = (debts: Debt[]): Debt[] => {
  return [...debts].sort((a, b) => {
    // Unpaid debts first
    if (a.isPaid !== b.isPaid) {
      return a.isPaid ? 1 : -1;
    }
    // Then by date (newest first)
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};