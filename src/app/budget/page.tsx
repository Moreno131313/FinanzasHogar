'use client';

import { useState, useEffect } from 'react';
import { MonthlyBudget, IncomeItem, ExpenseItem } from '@/types';
import { 
  calculateBudgetSummary, 
  formatCurrency, 
  createEmptyBudget, 
  getCurrentMonthBudget, 
  generateItemId 
} from '@/lib/budget-utils';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, getSubcategoryType } from '@/lib/categories';
import BudgetSummaryCard from '@/components/BudgetSummaryCard';

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<MonthlyBudget[]>([]);
  const [currentBudget, setCurrentBudget] = useState<MonthlyBudget | null>(null);
  const [activeTab, setActiveTab] = useState<'income' | 'expenses'>('income');
  const [isLoading, setIsLoading] = useState(true);
  
  // Formulario de ingresos
  const [incomeForm, setIncomeForm] = useState({
    description: '',
    amount: '',
    category: '',
    subcategory: '',
    date: new Date().toISOString().split('T')[0],
  });
  
  // Formulario de gastos
  const [expenseForm, setExpenseForm] = useState({
    description: '',
    amount: '',
    category: '',
    subcategory: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = () => {
    try {
      // Verificar que estamos en el cliente
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }

      const savedBudgets = localStorage.getItem('finanzas-hogar-budgets');
      let budgetsList: MonthlyBudget[] = [];
      
      if (savedBudgets) {
        budgetsList = JSON.parse(savedBudgets);
        budgetsList = budgetsList.map(budget => ({
          ...budget,
          createdAt: new Date(budget.createdAt),
          updatedAt: new Date(budget.updatedAt),
          incomes: budget.incomes.map(income => ({
            ...income,
            date: new Date(income.date),
          })),
          expenses: budget.expenses.map(expense => ({
            ...expense,
            date: new Date(expense.date),
          })),
        }));
      }

      setBudgets(budgetsList);

      let current = getCurrentMonthBudget(budgetsList);
      if (!current) {
        const now = new Date();
        current = createEmptyBudget(now.getMonth() + 1, now.getFullYear());
        budgetsList.push(current);
        setBudgets(budgetsList);
        saveBudgets([...budgetsList]);
      }

      setCurrentBudget(current);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading budgets:', error);
      setIsLoading(false);
    }
  };

  const saveBudgets = (budgetsList: MonthlyBudget[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('finanzas-hogar-budgets', JSON.stringify(budgetsList));
    }
  };

  const addIncome = () => {
    if (!currentBudget || !incomeForm.amount || !incomeForm.category || !incomeForm.subcategory) return;

    const newIncome: IncomeItem = {
      id: generateItemId(),
      description: incomeForm.description || incomeForm.subcategory,
      amount: parseFloat(incomeForm.amount),
      category: incomeForm.category as any,
      subcategory: incomeForm.subcategory,
      date: new Date(incomeForm.date),
    };

    const updatedBudget = {
      ...currentBudget,
      incomes: [...currentBudget.incomes, newIncome],
      updatedAt: new Date(),
    };

    const updatedBudgets = budgets.map(b => 
      b.id === currentBudget.id ? updatedBudget : b
    );

    setBudgets(updatedBudgets);
    setCurrentBudget(updatedBudget);
    saveBudgets(updatedBudgets);

    // Limpiar formulario
    setIncomeForm({
      description: '',
      amount: '',
      category: '',
      subcategory: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const addExpense = () => {
    if (!currentBudget || !expenseForm.amount || !expenseForm.category || !expenseForm.subcategory) return;

    const expenseType = getSubcategoryType(expenseForm.category as any, expenseForm.subcategory);

    const newExpense: ExpenseItem = {
      id: generateItemId(),
      description: expenseForm.description || expenseForm.subcategory,
      amount: parseFloat(expenseForm.amount),
      category: expenseForm.category as any,
      subcategory: expenseForm.subcategory,
      type: expenseType,
      date: new Date(expenseForm.date),
    };

    const updatedBudget = {
      ...currentBudget,
      expenses: [...currentBudget.expenses, newExpense],
      updatedAt: new Date(),
    };

    const updatedBudgets = budgets.map(b => 
      b.id === currentBudget.id ? updatedBudget : b
    );

    setBudgets(updatedBudgets);
    setCurrentBudget(updatedBudget);
    saveBudgets(updatedBudgets);

    // Limpiar formulario
    setExpenseForm({
      description: '',
      amount: '',
      category: '',
      subcategory: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const deleteIncome = (id: string) => {
    if (!currentBudget) return;

    const updatedBudget = {
      ...currentBudget,
      incomes: currentBudget.incomes.filter(income => income.id !== id),
      updatedAt: new Date(),
    };

    const updatedBudgets = budgets.map(b => 
      b.id === currentBudget.id ? updatedBudget : b
    );

    setBudgets(updatedBudgets);
    setCurrentBudget(updatedBudget);
    saveBudgets(updatedBudgets);
  };

  const deleteExpense = (id: string) => {
    if (!currentBudget) return;

    const updatedBudget = {
      ...currentBudget,
      expenses: currentBudget.expenses.filter(expense => expense.id !== id),
      updatedAt: new Date(),
    };

    const updatedBudgets = budgets.map(b => 
      b.id === currentBudget.id ? updatedBudget : b
    );

    setBudgets(updatedBudgets);
    setCurrentBudget(updatedBudget);
    saveBudgets(updatedBudgets);
  };

  if (isLoading || !currentBudget) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando presupuesto...</p>
        </div>
      </div>
    );
  }

  const summary = calculateBudgetSummary(currentBudget);
  const selectedIncomeCategory = incomeForm.category ? INCOME_CATEGORIES[incomeForm.category as keyof typeof INCOME_CATEGORIES] : null;
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const selectedCategory = expenseForm.category ? EXPENSE_CATEGORIES[expenseForm.category as keyof typeof EXPENSE_CATEGORIES] : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Presupuesto
        </h1>
        <p className="text-gray-600 mt-1">
          {monthNames[currentBudget.month - 1]} {currentBudget.year}
        </p>
      </div>

      {/* Resumen del presupuesto */}
      <BudgetSummaryCard summary={summary} />

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('income')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'income'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              💰 Ingresos ({currentBudget.incomes.length})
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'expenses'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              💸 Gastos ({currentBudget.expenses.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'income' && (
            <div className="space-y-6">
              {/* Formulario de ingresos */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Agregar Ingreso</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <select
                      value={incomeForm.category}
                      onChange={(e) => setIncomeForm({ ...incomeForm, category: e.target.value, subcategory: '' })}
                      className="input"
                    >
                      <option value="">Seleccionar persona</option>
                      {Object.entries(INCOME_CATEGORIES).map(([key, config]) => (
                        <option key={key} value={key}>
                          {config.icon} {config.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <select
                      value={incomeForm.subcategory}
                      onChange={(e) => setIncomeForm({ ...incomeForm, subcategory: e.target.value })}
                      className="input"
                      disabled={!selectedIncomeCategory}
                    >
                      <option value="">Seleccionar tipo de ingreso</option>
                      {selectedIncomeCategory?.subcategories.map(subcat => (
                        <option key={subcat} value={subcat}>{subcat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Descripción personalizada (opcional)"
                      value={incomeForm.description}
                      onChange={(e) => setIncomeForm({ ...incomeForm, description: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Monto"
                      value={incomeForm.amount}
                      onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <input
                      type="date"
                      value={incomeForm.date}
                      onChange={(e) => setIncomeForm({ ...incomeForm, date: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={addIncome}
                    className="btn btn-primary"
                    disabled={!incomeForm.category || !incomeForm.subcategory || !incomeForm.amount}
                  >
                    Agregar Ingreso
                  </button>
                </div>
              </div>

              {/* Lista de ingresos */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Ingresos del Mes - Total: {formatCurrency(summary.totalIncome)}
                </h3>
                {currentBudget.incomes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <span className="text-4xl block mb-2">💰</span>
                    No hay ingresos registrados
                  </div>
                ) : (
                  <div className="space-y-2">
                    {currentBudget.incomes.map(income => {
                      const incomeCategory = INCOME_CATEGORIES[income.category as keyof typeof INCOME_CATEGORIES];
                      return (
                        <div key={income.id} className="flex items-center justify-between p-4 bg-success-50 rounded-lg border border-success-200">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span>{incomeCategory?.icon}</span>
                              <p className="font-medium text-success-800">{income.description}</p>
                            </div>
                            <p className="text-sm text-success-600">
                              {incomeCategory?.name} • {income.subcategory} • {income.date.toLocaleDateString('es-CO')}
                            </p>
                          </div>
                        <div className="flex items-center space-x-4">
                          <span className="font-semibold text-success-800">
                            {formatCurrency(income.amount)}
                          </span>
                          <button
                            onClick={() => deleteIncome(income.id)}
                            className="btn btn-danger px-2 py-1 text-sm"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'expenses' && (
            <div className="space-y-6">
              {/* Formulario de gastos */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Agregar Gasto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <select
                      value={expenseForm.category}
                      onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value, subcategory: '' })}
                      className="input"
                    >
                      <option value="">Seleccionar categoría</option>
                      {Object.entries(EXPENSE_CATEGORIES).map(([key, config]) => (
                        <option key={key} value={key}>
                          {config.icon} {config.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <select
                      value={expenseForm.subcategory}
                      onChange={(e) => setExpenseForm({ ...expenseForm, subcategory: e.target.value })}
                      className="input"
                      disabled={!selectedCategory}
                    >
                      <option value="">Seleccionar subcategoría</option>
                      {selectedCategory?.subcategories.map(sub => (
                        <option key={sub.name} value={sub.name}>{sub.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Descripción personalizada (opcional)"
                      value={expenseForm.description}
                      onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Monto"
                      value={expenseForm.amount}
                      onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <input
                      type="date"
                      value={expenseForm.date}
                      onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={addExpense}
                    className="btn btn-primary"
                    disabled={!expenseForm.category || !expenseForm.subcategory || !expenseForm.amount}
                  >
                    Agregar Gasto
                  </button>
                </div>
              </div>

              {/* Lista de gastos */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Gastos del Mes - Total: {formatCurrency(summary.totalExpenses)}
                </h3>
                {currentBudget.expenses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <span className="text-4xl block mb-2">💸</span>
                    No hay gastos registrados
                  </div>
                ) : (
                  <div className="space-y-2">
                    {currentBudget.expenses.map(expense => {
                      const categoryConfig = EXPENSE_CATEGORIES[expense.category];
                      const typeColors = {
                        essential: 'bg-danger-50 border-danger-200 text-danger-800',
                        'non-essential': 'bg-warning-50 border-warning-200 text-warning-800',
                        variable: 'bg-gray-50 border-gray-200 text-gray-800',
                      };
                      
                      return (
                        <div key={expense.id} className={`flex items-center justify-between p-4 rounded-lg border ${typeColors[expense.type]}`}>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span>{categoryConfig?.icon}</span>
                              <span className="font-medium">
                                {expense.description}
                              </span>
                              <span className="text-xs px-2 py-1 bg-white rounded-full">
                                {expense.type === 'essential' ? 'Esencial' : 
                                 expense.type === 'non-essential' ? 'No esencial' : 'Variable'}
                              </span>
                            </div>
                            <p className="text-sm opacity-75">
                              {categoryConfig?.name} • {expense.date.toLocaleDateString('es-CO')}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="font-semibold">
                              {formatCurrency(expense.amount)}
                            </span>
                            <button
                              onClick={() => deleteExpense(expense.id)}
                              className="btn btn-danger px-2 py-1 text-sm"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 