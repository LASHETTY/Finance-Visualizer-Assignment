
import React, { useState, useEffect } from "react";
import AppNavbar from "@/components/AppNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Category, Transaction, BudgetSummary } from "@/types";
import {
  getInitialCategories,
  getInitialTransactions,
  calculateBudgetSummaries,
  formatCurrency,
  saveCategories,
} from "@/lib/data";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import BudgetComparisonChart from "@/components/charts/BudgetComparisonChart";

const BudgetsPage: React.FC = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgetInputs, setBudgetInputs] = useState<Record<string, string>>({});
  const [budgetSummaries, setBudgetSummaries] = useState<BudgetSummary[]>([]);

  // Initialize data
  useEffect(() => {
    const initialCategories = getInitialCategories();
    const initialTransactions = getInitialTransactions();
    
    setCategories(initialCategories);
    setTransactions(initialTransactions);
    
    // Initialize budget inputs from categories
    const initialBudgetInputs: Record<string, string> = {};
    initialCategories.forEach((category) => {
      if (category.budget) {
        initialBudgetInputs[category.id] = category.budget.toString();
      }
    });
    setBudgetInputs(initialBudgetInputs);
  }, []);

  // Calculate budget summaries whenever categories or transactions change
  useEffect(() => {
    setBudgetSummaries(calculateBudgetSummaries(categories, transactions));
  }, [categories, transactions]);

  const handleBudgetChange = (categoryId: string, value: string) => {
    setBudgetInputs({
      ...budgetInputs,
      [categoryId]: value,
    });
  };

  const handleSaveBudgets = () => {
    const updatedCategories = categories.map((category) => {
      const budgetValue = budgetInputs[category.id];
      return {
        ...category,
        budget: budgetValue ? Number(budgetValue) : undefined,
      };
    });

    setCategories(updatedCategories);
    saveCategories(updatedCategories);
    toast({
      title: "Budgets updated",
      description: "Your budgets have been saved successfully.",
    });
    
    // Update budget summaries
    setBudgetSummaries(calculateBudgetSummaries(updatedCategories, transactions));
  };

  const getProgressColor = (percentage: number): string => {
    if (percentage < 50) return "bg-success";
    if (percentage < 80) return "bg-warning";
    return "bg-destructive";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppNavbar />
      <main className="flex-1 container px-4 py-8 md:px-6">
        <h1 className="text-3xl font-bold mb-8">Budget Management</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Set Monthly Budgets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.filter(c => c.name !== "Income").map((category) => (
                  <div key={category.id} className="flex items-center gap-4">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <div className="flex-1">{category.name}</div>
                    <div className="w-28">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={budgetInputs[category.id] || ""}
                        onChange={(e) =>
                          handleBudgetChange(category.id, e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
                <Button className="mt-4 w-full" onClick={handleSaveBudgets}>
                  Save Budgets
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Budget Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {budgetSummaries.length > 0 ? (
                  budgetSummaries.map((summary) => (
                    <div key={summary.categoryId} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor:
                                categories.find(c => c.id === summary.categoryId)?.color || "#9CA3AF",
                            }}
                          ></div>
                          <span>{summary.categoryName}</span>
                        </div>
                        <div className="text-sm">
                          {formatCurrency(summary.spent)} of {formatCurrency(summary.budget)}
                        </div>
                      </div>
                      <Progress
                        value={summary.percentage}
                        className="h-2"
                        indicatorClassName={getProgressColor(summary.percentage)}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{summary.percentage.toFixed(0)}% used</span>
                        <span>{formatCurrency(summary.remaining)} remaining</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    No budgets set. Set budgets to track your spending.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <BudgetComparisonChart data={budgetSummaries} />
        </div>
      </main>
    </div>
  );
};

export default BudgetsPage;
