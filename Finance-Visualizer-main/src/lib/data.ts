
import { Transaction, Category, MonthlyTotal, BudgetSummary } from "@/types";
import { v4 as uuidv4 } from "uuid";

// Mock data for initial demo
const MOCK_CATEGORIES: Category[] = [
  { id: "cat1", name: "Housing", color: "#3B82F6", budget: 1500 },
  { id: "cat2", name: "Food & Dining", color: "#10B981", budget: 600 },
  { id: "cat3", name: "Transportation", color: "#F59E0B", budget: 300 },
  { id: "cat4", name: "Entertainment", color: "#6366F1", budget: 250 },
  { id: "cat5", name: "Shopping", color: "#EC4899", budget: 400 },
  { id: "cat6", name: "Health", color: "#14B8A6", budget: 200 },
  { id: "cat7", name: "Personal", color: "#8B5CF6", budget: 150 },
  { id: "cat8", name: "Income", color: "#34D399", budget: 0 },
  { id: "cat9", name: "Other", color: "#9CA3AF", budget: 100 },
];

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: uuidv4(),
    amount: 3500,
    date: new Date(2023, 3, 1),
    description: "Monthly Salary",
    categoryId: "cat8",
    type: "income",
  },
  {
    id: uuidv4(),
    amount: 1200,
    date: new Date(2023, 3, 3),
    description: "Rent",
    categoryId: "cat1",
    type: "expense",
  },
  {
    id: uuidv4(),
    amount: 85.75,
    date: new Date(2023, 3, 4),
    description: "Grocery Shopping",
    categoryId: "cat2",
    type: "expense",
  },
  {
    id: uuidv4(),
    amount: 45.50,
    date: new Date(2023, 3, 6),
    description: "Gas",
    categoryId: "cat3",
    type: "expense",
  },
  {
    id: uuidv4(),
    amount: 120,
    date: new Date(2023, 3, 8),
    description: "Concert Tickets",
    categoryId: "cat4",
    type: "expense",
  },
  {
    id: uuidv4(),
    amount: 200,
    date: new Date(2023, 3, 10),
    description: "New Shoes",
    categoryId: "cat5",
    type: "expense",
  },
  {
    id: uuidv4(),
    amount: 500,
    date: new Date(2023, 3, 15),
    description: "Freelance Work",
    categoryId: "cat8",
    type: "income",
  },
  {
    id: uuidv4(),
    amount: 65.30,
    date: new Date(2023, 3, 18),
    description: "Pharmacy",
    categoryId: "cat6",
    type: "expense",
  },
  {
    id: uuidv4(),
    amount: 90.25,
    date: new Date(2023, 3, 20),
    description: "Restaurant Dinner",
    categoryId: "cat2",
    type: "expense",
  },
  {
    id: uuidv4(),
    amount: 35,
    date: new Date(2023, 3, 23),
    description: "Haircut",
    categoryId: "cat7",
    type: "expense",
  },
  {
    id: uuidv4(),
    amount: 25.99,
    date: new Date(2023, 3, 25),
    description: "Streaming Service",
    categoryId: "cat4",
    type: "expense",
  },
];

// Get initial data from localStorage or use mock data
export const getInitialCategories = (): Category[] => {
  if (typeof window !== 'undefined') {
    const storedCategories = localStorage.getItem('categories');
    return storedCategories ? JSON.parse(storedCategories) : MOCK_CATEGORIES;
  }
  return MOCK_CATEGORIES;
};

export const getInitialTransactions = (): Transaction[] => {
  if (typeof window !== 'undefined') {
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      return JSON.parse(storedTransactions).map((t: any) => ({
        ...t,
        date: new Date(t.date),
      }));
    }
  }
  return MOCK_TRANSACTIONS;
};

// Helper functions for manipulating data
export const saveCategories = (categories: Category[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('categories', JSON.stringify(categories));
  }
};

export const saveTransactions = (transactions: Transaction[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

export const getMonthName = (monthIndex: number): string => {
  return new Intl.DateTimeFormat('en-US', { month: 'short' }).format(
    new Date(2000, monthIndex, 1)
  );
};

export const calculateBudgetSummaries = (categories: Category[], transactions: Transaction[]): BudgetSummary[] => {
  return categories.filter(cat => cat.budget && cat.budget > 0).map(category => {
    const spent = transactions
      .filter(t => t.categoryId === category.id && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const remaining = Math.max(0, (category.budget || 0) - spent);
    const percentage = category.budget ? Math.min(100, (spent / category.budget) * 100) : 0;
    
    return {
      categoryId: category.id,
      categoryName: category.name,
      budget: category.budget || 0,
      spent,
      remaining,
      percentage,
    };
  });
};

export const calculateTotalBalance = (transactions: Transaction[]): number => {
  return transactions.reduce((balance, transaction) => {
    return balance + (transaction.type === 'income' ? transaction.amount : -transaction.amount);
  }, 0);
};

export const calculateTotalIncome = (transactions: Transaction[]): number => {
  return transactions
    .filter(transaction => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0);
};

export const calculateTotalExpenses = (transactions: Transaction[]): number => {
  return transactions
    .filter(transaction => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0);
};

export const calculateMonthlyData = (transactions: Transaction[]): MonthlyTotal[] => {
  const currentYear = new Date().getFullYear();
  const months: MonthlyTotal[] = [];
  
  // Initialize months array with all months
  for (let i = 0; i < 12; i++) {
    months.push({
      month: getMonthName(i),
      expenses: 0,
      income: 0,
    });
  }
  
  // Fill with data
  transactions.forEach(transaction => {
    const transactionDate = new Date(transaction.date);
    if (transactionDate.getFullYear() === currentYear) {
      const monthIndex = transactionDate.getMonth();
      if (transaction.type === 'expense') {
        months[monthIndex].expenses += transaction.amount;
      } else {
        months[monthIndex].income += transaction.amount;
      }
    }
  });
  
  return months;
};

export const calculateCategoryTotals = (transactions: Transaction[], categories: Category[]) => {
  const categoryTotals = categories.map(category => {
    const total = transactions
      .filter(t => t.categoryId === category.id && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      name: category.name,
      value: total,
      color: category.color,
      id: category.id,
    };
  }).filter(cat => cat.value > 0);

  return categoryTotals;
};
