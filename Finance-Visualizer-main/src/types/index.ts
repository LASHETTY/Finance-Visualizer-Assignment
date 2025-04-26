
export interface Transaction {
  id: string;
  amount: number;
  date: Date;
  description: string;
  categoryId: string;
  type: 'income' | 'expense';
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
  budget?: number;
}

export interface BudgetSummary {
  categoryId: string;
  categoryName: string;
  budget: number;
  spent: number;
  remaining: number;
  percentage: number;
}

export interface MonthlyTotal {
  month: string;
  expenses: number;
  income: number;
}
