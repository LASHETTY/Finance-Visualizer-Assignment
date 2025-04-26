
import React, { useState, useEffect } from "react";
import AppNavbar from "@/components/AppNavbar";
import DashboardSummary from "@/components/DashboardSummary";
import MonthlyExpensesChart from "@/components/charts/MonthlyExpensesChart";
import CategoryPieChart from "@/components/charts/CategoryPieChart";
import BudgetComparisonChart from "@/components/charts/BudgetComparisonChart";
import { Transaction, Category } from "@/types";
import {
  getInitialTransactions,
  getInitialCategories,
  calculateMonthlyData,
  calculateCategoryTotals,
  calculateBudgetSummaries,
  calculateTotalBalance,
  calculateTotalIncome,
  calculateTotalExpenses,
} from "@/lib/data";

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Initialize data
  useEffect(() => {
    setTransactions(getInitialTransactions());
    setCategories(getInitialCategories());
  }, []);

  // Derived data
  const monthlyData = calculateMonthlyData(transactions);
  const categoryTotals = calculateCategoryTotals(transactions, categories);
  const budgetSummaries = calculateBudgetSummaries(categories, transactions);
  
  const totalBalance = calculateTotalBalance(transactions);
  const totalIncome = calculateTotalIncome(transactions);
  const totalExpenses = calculateTotalExpenses(transactions);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppNavbar />
      <main className="flex-1 container px-4 py-8 md:px-6">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <DashboardSummary 
          transactions={transactions}
          categories={categories}
          balance={totalBalance}
          income={totalIncome}
          expenses={totalExpenses}
        />

        <div className="grid gap-6 md:grid-cols-2 mt-6">
          <MonthlyExpensesChart data={monthlyData} />
          <CategoryPieChart data={categoryTotals} />
          <div className="md:col-span-2">
            <BudgetComparisonChart data={budgetSummaries} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
