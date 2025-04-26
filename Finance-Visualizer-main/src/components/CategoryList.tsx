
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Category } from "@/types";
import { formatCurrency } from "@/lib/data";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface CategoryListProps {
  categories: Category[];
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
  categoryTotals: {
    id: string;
    name: string;
    value: number;
    color: string;
  }[];
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  onEditCategory,
  onDeleteCategory,
  categoryTotals,
}) => {
  const getCategoryTotal = (categoryId: string): number => {
    const categoryTotal = categoryTotals.find(ct => ct.id === categoryId);
    return categoryTotal ? categoryTotal.value : 0;
  };

  const getBudgetPercentage = (categoryId: string): number => {
    const category = categories.find(c => c.id === categoryId);
    if (!category || !category.budget || category.budget <= 0) return 0;
    
    const total = getCategoryTotal(categoryId);
    return Math.min(100, Math.round((total / category.budget) * 100));
  };
  
  const getProgressColor = (percentage: number): string => {
    if (percentage < 50) return 'bg-success';
    if (percentage < 80) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Color</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Spent</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length > 0 ? (
            categories.map((category) => {
              const total = getCategoryTotal(category.id);
              const percentage = getBudgetPercentage(category.id);
              
              return (
                <TableRow key={category.id}>
                  <TableCell>
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    ></div>
                  </TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    {category.budget ? formatCurrency(category.budget) : "—"}
                  </TableCell>
                  <TableCell>{formatCurrency(total)}</TableCell>
                  <TableCell>
                    {category.budget ? (
                      <div className="space-y-1">
                        <Progress 
                          value={percentage} 
                          className="h-2" 
                          indicatorClassName={getProgressColor(percentage)} 
                        />
                        <p className="text-xs text-muted-foreground">{percentage}%</p>
                      </div>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditCategory(category)}
                      >
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Category</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this category? This will also delete all transactions in this category.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDeleteCategory(category.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                No categories found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoryList;
