export interface IncomeItem {
  id: string;
  description: string;
  amount: number;
  category: IncomeCategory;
  subcategory: string;
  date: Date;
}

export type IncomeCategory = 
  | 'katherine'
  | 'duvan'
  | 'compartidos';

export interface ExpenseItem {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  subcategory: string;
  type: 'essential' | 'non-essential' | 'variable';
  date: Date;
}

export type ExpenseCategory = 
  | 'vivienda'
  | 'transporte'
  | 'alimentacion'
  | 'educacion'
  | 'otros-gastos';

export interface CategoryConfig {
  name: string;
  color: string;
  icon: string;
  subcategories: SubcategoryConfig[];
}

export interface SubcategoryConfig {
  name: string;
  type: 'essential' | 'non-essential' | 'variable';
}

export interface MonthlyBudget {
  id: string;
  month: number;
  year: number;
  incomes: IncomeItem[];
  expenses: ExpenseItem[];
  tithePercentage: number; // 10% diezmo
  savingsPercentage: number; // 10% ahorro
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetSummary {
  totalIncome: number;
  totalExpenses: number;
  titheAmount: number;
  savingsAmount: number;
  availableAmount: number;
  budgetBalance: number;
}

export interface MonthlyComparison {
  currentMonth: BudgetSummary;
  previousMonth: BudgetSummary;
  growth: {
    income: number;
    expenses: number;
    savings: number;
  };
} 