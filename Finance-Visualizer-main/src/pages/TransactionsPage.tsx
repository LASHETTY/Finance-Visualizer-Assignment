
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import AppNavbar from "@/components/AppNavbar";
import TransactionList from "@/components/TransactionList";
import TransactionForm from "@/components/TransactionForm";
import { Transaction, Category } from "@/types";
import {
  getInitialTransactions,
  getInitialCategories,
  saveTransactions,
} from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { PlusIcon } from "lucide-react";

const TransactionsPage: React.FC = () => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(
    undefined
  );

  // Initialize data
  useEffect(() => {
    setTransactions(getInitialTransactions());
    setCategories(getInitialCategories());
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions([...transactions, transaction]);
  };

  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    const updatedTransactions = transactions.map((t) =>
      t.id === updatedTransaction.id ? updatedTransaction : t
    );
    setTransactions(updatedTransactions);
    setEditingTransaction(undefined);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
    toast({
      title: "Transaction deleted",
      description: "Your transaction has been deleted successfully.",
    });
  };

  const handleOpenEditDialog = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleCloseEditDialog = () => {
    setEditingTransaction(undefined);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppNavbar />
      <main className="flex-1 container px-4 py-8 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Transactions</h1>
          <Button onClick={() => setIsAddingTransaction(true)}>
            <PlusIcon className="h-4 w-4 mr-2" /> Add Transaction
          </Button>
        </div>

        <TransactionList
          transactions={transactions}
          categories={categories}
          onEditTransaction={handleOpenEditDialog}
          onDeleteTransaction={handleDeleteTransaction}
        />

        <TransactionForm
          isOpen={isAddingTransaction}
          onClose={() => setIsAddingTransaction(false)}
          onSave={handleAddTransaction}
          categories={categories}
        />

        <TransactionForm
          isOpen={!!editingTransaction}
          onClose={handleCloseEditDialog}
          onSave={handleUpdateTransaction}
          categories={categories}
          initialData={editingTransaction}
        />
      </main>
    </div>
  );
};

export default TransactionsPage;
