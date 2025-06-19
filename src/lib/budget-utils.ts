import { MonthlyBudget, BudgetSummary, IncomeItem, ExpenseItem } from '@/types';

export const calculateBudgetSummary = (budget: MonthlyBudget): BudgetSummary => {
  const totalIncome = budget.incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = budget.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const titheAmount = totalIncome * (budget.tithePercentage / 100);
  const savingsAmount = totalIncome * (budget.savingsPercentage / 100);
  
  // Total presupuesto = ingresos - diezmo - ahorro
  const budgetTotal = totalIncome - titheAmount - savingsAmount;
  
  // Disponible = presupuesto total - gastos
  const availableAmount = budgetTotal - totalExpenses;
  
  return {
    totalIncome,
    totalExpenses,
    titheAmount,
    savingsAmount,
    availableAmount,
    budgetBalance: availableAmount,
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getExpensesByCategory = (expenses: ExpenseItem[]) => {
  const byCategory = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = [];
    }
    acc[expense.category].push(expense);
    return acc;
  }, {} as Record<string, ExpenseItem[]>);

  return Object.entries(byCategory).map(([category, items]: [string, ExpenseItem[]]) => ({
    category,
    items,
    total: items.reduce((sum: number, item: ExpenseItem) => sum + item.amount, 0),
  }));
};

export const getExpensesByType = (expenses: ExpenseItem[]) => {
  const essential = expenses.filter(e => e.type === 'essential');
  const nonEssential = expenses.filter(e => e.type === 'non-essential');
  const variable = expenses.filter(e => e.type === 'variable');

  return {
    essential: {
      items: essential,
      total: essential.reduce((sum, item) => sum + item.amount, 0),
    },
    nonEssential: {
      items: nonEssential,
      total: nonEssential.reduce((sum, item) => sum + item.amount, 0),
    },
    variable: {
      items: variable,
      total: variable.reduce((sum, item) => sum + item.amount, 0),
    },
  };
};

export const getMonthlyTrend = (budgets: MonthlyBudget[]) => {
  return budgets
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    })
    .map(budget => ({
      month: `${budget.year}-${budget.month.toString().padStart(2, '0')}`,
      ...calculateBudgetSummary(budget),
    }));
};

export const generateBudgetId = (): string => {
  return `budget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateItemId = (): string => {
  return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getCurrentMonthBudget = (budgets: MonthlyBudget[]): MonthlyBudget | null => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  
  return budgets.find(budget => 
    budget.month === currentMonth && budget.year === currentYear
  ) || null;
};

export const createEmptyBudget = (month: number, year: number): MonthlyBudget => {
  return {
    id: generateBudgetId(),
    month,
    year,
    incomes: [],
    expenses: [],
    tithePercentage: 10, // 10% diezmo por defecto
    savingsPercentage: 10, // 10% ahorro por defecto
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}; 