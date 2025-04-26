
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import AppNavbar from "@/components/AppNavbar";
import CategoryList from "@/components/CategoryList";
import CategoryForm from "@/components/CategoryForm";
import { Category, Transaction } from "@/types";
import {
  getInitialCategories,
  getInitialTransactions,
  saveCategories,
  saveTransactions,
  calculateCategoryTotals,
} from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { PlusIcon } from "lucide-react";

const CategoriesPage: React.FC = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(
    undefined
  );

  // Initialize data
  useEffect(() => {
    setCategories(getInitialCategories());
    setTransactions(getInitialTransactions());
  }, []);

  // Save categories to localStorage whenever they change
  useEffect(() => {
    saveCategories(categories);
  }, [categories]);

  const categoryTotals = calculateCategoryTotals(transactions, categories);

  const handleAddCategory = (category: Category) => {
    setCategories([...categories, category]);
  };

  const handleUpdateCategory = (updatedCategory: Category) => {
    const updatedCategories = categories.map((c) =>
      c.id === updatedCategory.id ? updatedCategory : c
    );
    setCategories(updatedCategories);
    setEditingCategory(undefined);
  };

  const handleDeleteCategory = (id: string) => {
    // Delete the category
    setCategories(categories.filter((c) => c.id !== id));
    
    // Remove transactions with this category
    const updatedTransactions = transactions.filter(t => t.categoryId !== id);
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
    
    toast({
      title: "Category deleted",
      description: "The category and its transactions have been deleted.",
    });
  };

  const handleOpenEditDialog = (category: Category) => {
    setEditingCategory(category);
  };

  const handleCloseEditDialog = () => {
    setEditingCategory(undefined);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppNavbar />
      <main className="flex-1 container px-4 py-8 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Categories</h1>
          <Button onClick={() => setIsAddingCategory(true)}>
            <PlusIcon className="h-4 w-4 mr-2" /> Add Category
          </Button>
        </div>

        <CategoryList
          categories={categories}
          onEditCategory={handleOpenEditDialog}
          onDeleteCategory={handleDeleteCategory}
          categoryTotals={categoryTotals}
        />

        <CategoryForm
          isOpen={isAddingCategory}
          onClose={() => setIsAddingCategory(false)}
          onSave={handleAddCategory}
        />

        <CategoryForm
          isOpen={!!editingCategory}
          onClose={handleCloseEditDialog}
          onSave={handleUpdateCategory}
          initialData={editingCategory}
        />
      </main>
    </div>
  );
};

export default CategoriesPage;
