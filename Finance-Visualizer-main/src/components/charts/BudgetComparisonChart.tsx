
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { BudgetSummary } from "@/types";
import { formatCurrency } from "@/lib/data";

interface BudgetComparisonChartProps {
  data: BudgetSummary[];
}

const BudgetComparisonChart: React.FC<BudgetComparisonChartProps> = ({ data }) => {
  const sortedData = [...data].sort((a, b) => b.percentage - a.percentage);

  const chartData = sortedData.map(item => ({
    name: item.categoryName,
    spent: item.spent,
    budget: item.budget,
    percentage: item.percentage,
    remaining: item.remaining,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-4 rounded-md shadow-sm">
          <p className="font-semibold">{label}</p>
          <p>Budget: {formatCurrency(payload[1].value)}</p>
          <p>Spent: {formatCurrency(payload[0].value)}</p>
          <p>Remaining: {formatCurrency(payload[1].value - payload[0].value)}</p>
          <p>Used: {payload[0].payload.percentage.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget vs. Actual</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">No budget data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs. Actual</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" tickFormatter={(value) => `$${value}`} />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine x={0} stroke="#000" />
              <Bar
                dataKey="spent"
                fill="#EF4444"
                radius={[0, 4, 4, 0]}
                name="Spent"
              />
              <Bar
                dataKey="budget"
                fill="#3B82F6"
                radius={[0, 4, 4, 0]}
                name="Budget"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetComparisonChart;
