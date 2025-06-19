import { ExpenseItem } from '@/types';
import { getExpensesByCategory, formatCurrency } from '@/lib/budget-utils';
import { EXPENSE_CATEGORIES } from '@/lib/categories';

interface ExpensesByCategoryProps {
  expenses: ExpenseItem[];
}

export default function ExpensesByCategory({ expenses }: ExpensesByCategoryProps) {
  const expensesByCategory = getExpensesByCategory(expenses);

  if (expenses.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Gastos por Categoría</h3>
        <div className="text-center py-8">
          <span className="text-4xl">📊</span>
          <p className="text-gray-500 mt-2">No hay gastos registrados este mes</p>
        </div>
      </div>
    );
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Gastos por Categoría</h3>
      <div className="space-y-4">
        {expensesByCategory.map(({ category, total }) => {
          const categoryConfig = EXPENSE_CATEGORIES[category as keyof typeof EXPENSE_CATEGORIES];
          const percentage = totalExpenses > 0 ? (total / totalExpenses) * 100 : 0;
          
          return (
            <div key={category} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-xl">{categoryConfig?.icon || '📋'}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {categoryConfig?.name || category}
                  </p>
                  <p className="text-xs text-gray-500">
                    {percentage.toFixed(1)}% del total
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {formatCurrency(total)}
                </p>
                <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 