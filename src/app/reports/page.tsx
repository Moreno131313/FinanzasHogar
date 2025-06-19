'use client';

import { useState, useEffect } from 'react';
import { MonthlyBudget } from '@/types';
import { 
  calculateBudgetSummary, 
  formatCurrency, 
  getExpensesByCategory,
  getExpensesByType,
  getMonthlyTrend
} from '@/lib/budget-utils';
import { EXPENSE_CATEGORIES } from '@/lib/categories';

export default function ReportsPage() {
  const [budgets, setBudgets] = useState<MonthlyBudget[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = () => {
    // Verificar que estamos en el cliente
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    try {
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
    
    // Seleccionar el mes más reciente por defecto
    if (budgetsList.length > 0) {
      const latest = budgetsList.sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.month - a.month;
      })[0];
      setSelectedMonth(`${latest.year}-${latest.month.toString().padStart(2, '0')}`);
    }
    setIsLoading(false);
    } catch (error) {
      console.error('Error loading budgets:', error);
      setIsLoading(false);
    }
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const getAvailableMonths = () => {
    return budgets
      .map(budget => ({
        value: `${budget.year}-${budget.month.toString().padStart(2, '0')}`,
        label: `${monthNames[budget.month - 1]} ${budget.year}`,
        budget: budget
      }))
      .sort((a, b) => b.value.localeCompare(a.value));
  };

  const selectedBudget = budgets.find(budget => 
    `${budget.year}-${budget.month.toString().padStart(2, '0')}` === selectedMonth
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  if (!selectedBudget) {
    return (
      <div className="space-y-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">
            Reportes y Análisis
          </h1>
          <p className="text-gray-600 mt-1">
            Análisis detallado de tus finanzas
          </p>
        </div>
        
        <div className="text-center py-8">
          <span className="text-4xl block mb-4">📊</span>
          <p className="text-gray-600">No hay datos de presupuesto para mostrar reportes.</p>
          <p className="text-gray-500 text-sm mt-2">Agrega algunos ingresos y gastos primero.</p>
        </div>
      </div>
    );
  }

  const summary = calculateBudgetSummary(selectedBudget);
  const expensesByCategory = getExpensesByCategory(selectedBudget.expenses);
  const expensesByType = getExpensesByType(selectedBudget.expenses);
  const monthlyTrend = getMonthlyTrend(budgets);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Reportes y Análisis
            </h1>
            <p className="text-gray-600 mt-1">
              Análisis detallado de tus finanzas
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="input min-w-48"
            >
              <option value="">Seleccionar mes</option>
              {getAvailableMonths().map(month => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Resumen Ejecutivo */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          📊 Resumen Ejecutivo - {monthNames[selectedBudget.month - 1]} {selectedBudget.year}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-success-50 rounded-lg">
            <p className="text-2xl font-bold text-success-700">{formatCurrency(summary.totalIncome)}</p>
            <p className="text-sm text-success-600">Ingresos Totales</p>
          </div>
          <div className="text-center p-4 bg-danger-50 rounded-lg">
            <p className="text-2xl font-bold text-danger-700">{formatCurrency(summary.totalExpenses)}</p>
            <p className="text-sm text-danger-600">Gastos Totales</p>
          </div>
          <div className="text-center p-4 bg-primary-50 rounded-lg">
            <p className="text-2xl font-bold text-primary-700">{formatCurrency(summary.savingsAmount)}</p>
            <p className="text-sm text-primary-600">Para Ahorros</p>
          </div>
          <div className={`text-center p-4 rounded-lg ${
            summary.availableAmount >= 0 ? 'bg-success-50' : 'bg-danger-50'
          }`}>
            <p className={`text-2xl font-bold ${
              summary.availableAmount >= 0 ? 'text-success-700' : 'text-danger-700'
            }`}>
              {formatCurrency(Math.abs(summary.availableAmount))}
            </p>
            <p className={`text-sm ${
              summary.availableAmount >= 0 ? 'text-success-600' : 'text-danger-600'
            }`}>
              {summary.availableAmount >= 0 ? 'Disponible' : 'Déficit'}
            </p>
          </div>
        </div>
      </div>

      {/* Análisis por Categorías */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          🏷️ Análisis por Categorías
        </h2>
        {expensesByCategory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <span className="text-4xl block mb-2">📊</span>
            No hay gastos registrados para analizar
          </div>
        ) : (
          <div className="space-y-4">
            {expensesByCategory.map(({ category, total, items }) => {
              const categoryConfig = EXPENSE_CATEGORIES[category as keyof typeof EXPENSE_CATEGORIES];
              const percentage = summary.totalExpenses > 0 ? (total / summary.totalExpenses) * 100 : 0;
              
              return (
                <div key={category} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{categoryConfig?.icon || '📋'}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {categoryConfig?.name || category}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {items.length} transacciones • {percentage.toFixed(1)}% del total
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{formatCurrency(total)}</p>
                    </div>
                  </div>
                  
                  {/* Barra de progreso */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  
                  {/* Lista de gastos en esta categoría */}
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm bg-gray-50 rounded p-2">
                        <span className="text-gray-700">{item.description}</span>
                        <span className="font-medium text-gray-900">{formatCurrency(item.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Análisis por Tipo de Gasto */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          🎯 Análisis por Tipo de Gasto
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-danger-200 rounded-lg p-4 bg-danger-50">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl">🔴</span>
              <h3 className="font-semibold text-danger-800">Gastos Esenciales</h3>
            </div>
            <p className="text-2xl font-bold text-danger-700">{formatCurrency(expensesByType.essential.total)}</p>
            <p className="text-sm text-danger-600">{expensesByType.essential.items.length} transacciones</p>
            <p className="text-xs text-danger-500 mt-1">
              {summary.totalExpenses > 0 ? ((expensesByType.essential.total / summary.totalExpenses) * 100).toFixed(1) : 0}% del total
            </p>
          </div>

          <div className="border border-warning-200 rounded-lg p-4 bg-warning-50">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl">🟡</span>
              <h3 className="font-semibold text-warning-800">Gastos No Esenciales</h3>
            </div>
            <p className="text-2xl font-bold text-warning-700">{formatCurrency(expensesByType.nonEssential.total)}</p>
            <p className="text-sm text-warning-600">{expensesByType.nonEssential.items.length} transacciones</p>
            <p className="text-xs text-warning-500 mt-1">
              {summary.totalExpenses > 0 ? ((expensesByType.nonEssential.total / summary.totalExpenses) * 100).toFixed(1) : 0}% del total
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl">⚫</span>
              <h3 className="font-semibold text-gray-800">Gastos Variables</h3>
            </div>
            <p className="text-2xl font-bold text-gray-700">{formatCurrency(expensesByType.variable.total)}</p>
            <p className="text-sm text-gray-600">{expensesByType.variable.items.length} transacciones</p>
            <p className="text-xs text-gray-500 mt-1">
              {summary.totalExpenses > 0 ? ((expensesByType.variable.total / summary.totalExpenses) * 100).toFixed(1) : 0}% del total
            </p>
          </div>
        </div>
      </div>

      {/* Tendencia Mensual */}
      {monthlyTrend.length > 1 && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📈 Tendencia Mensual
          </h2>
          <div className="space-y-4">
            {monthlyTrend.map((month, index) => {
              const [year, monthNum] = month.month.split('-');
              const monthName = monthNames[parseInt(monthNum) - 1];
              const isSelected = month.month === selectedMonth;
              
              return (
                <div 
                  key={month.month} 
                  className={`p-4 rounded-lg border ${
                    isSelected ? 'border-primary-300 bg-primary-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{monthName} {year}</h3>
                      <p className="text-sm text-gray-500">
                        Balance: {month.availableAmount >= 0 ? '+' : ''}{formatCurrency(month.availableAmount)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-success-600 text-sm">↗ {formatCurrency(month.totalIncome)}</p>
                      <p className="text-danger-600 text-sm">↘ {formatCurrency(month.totalExpenses)}</p>
                    </div>
                  </div>
                  
                  {/* Barra de progreso del balance */}
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          month.availableAmount >= 0 ? 'bg-success-500' : 'bg-danger-500'
                        }`}
                        style={{ 
                          width: `${Math.min(Math.abs(month.availableAmount) / Math.max(month.totalIncome, 1) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recomendaciones */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          💡 Recomendaciones
        </h2>
        <div className="space-y-4">
          {summary.availableAmount < 0 && (
            <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
              <h3 className="font-semibold text-danger-800 mb-2">⚠️ Déficit Presupuestario</h3>
              <p className="text-danger-700 text-sm">
                Tienes un déficit de {formatCurrency(Math.abs(summary.availableAmount))}. 
                Considera reducir gastos no esenciales o buscar ingresos adicionales.
              </p>
            </div>
          )}
          
          {expensesByType.nonEssential.total > expensesByType.essential.total && (
            <div className="p-4 bg-warning-50 border border-warning-200 rounded-lg">
              <h3 className="font-semibold text-warning-800 mb-2">🟡 Gastos No Esenciales Altos</h3>
              <p className="text-warning-700 text-sm">
                Tus gastos no esenciales ({formatCurrency(expensesByType.nonEssential.total)}) superan 
                a los esenciales ({formatCurrency(expensesByType.essential.total)}). 
                Revisa si puedes optimizar algunos gastos.
              </p>
            </div>
          )}
          
          {summary.availableAmount > summary.totalIncome * 0.2 && (
            <div className="p-4 bg-success-50 border border-success-200 rounded-lg">
              <h3 className="font-semibold text-success-800 mb-2">✅ Excelente Control</h3>
              <p className="text-success-700 text-sm">
                ¡Felicitaciones! Tienes un buen control de gastos con {formatCurrency(summary.availableAmount)} disponible. 
                Considera aumentar tus ahorros o inversiones.
              </p>
            </div>
          )}

          {selectedBudget.incomes.length === 0 && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">📝 Sin Ingresos Registrados</h3>
              <p className="text-gray-700 text-sm">
                No has registrado ingresos este mes. Agrega tus fuentes de ingresos para un análisis más completo.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 