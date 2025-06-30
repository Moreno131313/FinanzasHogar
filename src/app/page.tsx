'use client';

import { useState, useEffect } from 'react';
import { MonthlyBudget, BudgetSummary } from '@/types';
import { calculateBudgetSummary, formatCurrency, createEmptyBudget } from '@/lib/budget-utils';
import { 
  getUserBudgets, 
  getCurrentMonthBudget as getFirebaseCurrentMonthBudget,
  saveBudget 
} from '@/lib/firestore-service';
import { useAuth } from '@/contexts/AuthContext';
import BudgetSummaryCard from '@/components/BudgetSummaryCard';
import ExpensesByCategory from '@/components/ExpensesByCategory';
import IncomeVsExpensesChart from '@/components/IncomeVsExpensesChart';
import Logo from '@/components/Logo';

export default function Dashboard() {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<MonthlyBudget[]>([]);
  const [currentBudget, setCurrentBudget] = useState<MonthlyBudget | null>(null);
  const [summary, setSummary] = useState<BudgetSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBudgets();
  }, [user]);

  const loadBudgets = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      // Cargar presupuestos desde Firebase
      const budgetsList = await getUserBudgets(user.uid);
      setBudgets(budgetsList);

      // Buscar presupuesto del mes actual
      let current = await getFirebaseCurrentMonthBudget(user.uid);
      if (!current) {
        const now = new Date();
        current = createEmptyBudget(now.getMonth() + 1, now.getFullYear());
        await saveBudget(user.uid, current);
        setBudgets(prev => [...prev, current!]);
      }

      setCurrentBudget(current);
      setSummary(calculateBudgetSummary(current));
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading budgets:', error);
      setIsLoading(false);
    }
  };

  if (isLoading || !currentBudget || !summary) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando presupuesto...</p>
        </div>
      </div>
    );
  }

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return (
    <div className="space-y-8">
      {/* Header del Dashboard */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Logo size="lg" showText={false} />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard de Finanzas
              </h1>
              <p className="text-gray-600 mt-1">
                Presupuesto de {monthNames[currentBudget.month - 1]} {currentBudget.year}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Saldo disponible</p>
            <p className={`text-2xl font-bold ${
              summary.availableAmount >= 0 ? 'text-success-600' : 'text-danger-600'
            }`}>
              {formatCurrency(summary.availableAmount)}
            </p>
          </div>
        </div>
      </div>

      {/* Tarjetas de Resumen */}
      <BudgetSummaryCard summary={summary} />

      {/* Gráficos y Análisis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <IncomeVsExpensesChart 
          income={summary.totalIncome}
          expenses={summary.totalExpenses}
          tithe={summary.titheAmount}
          savings={summary.savingsAmount}
        />
        <ExpensesByCategory expenses={currentBudget.expenses} />
      </div>

      {/* Enlaces rápidos */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => window.location.href = '/budget?tab=income'}
            className="btn btn-primary flex items-center justify-center space-x-2 py-3"
          >
            <span>💰</span>
            <span>Agregar Ingreso</span>
          </button>
          <button
            onClick={() => window.location.href = '/budget?tab=expenses'}
            className="btn btn-secondary flex items-center justify-center space-x-2 py-3"
          >
            <span>💸</span>
            <span>Agregar Gasto</span>
          </button>
          <button
            onClick={() => window.location.href = '/reports'}
            className="btn btn-secondary flex items-center justify-center space-x-2 py-3"
          >
            <span>📊</span>
            <span>Ver Reportes</span>
          </button>
        </div>
      </div>
    </div>
  );
} 