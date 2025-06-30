'use client';

import { useState, useEffect } from 'react';
import { MonthlyBudget } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import AdvancedFinancialCharts from '@/components/AdvancedFinancialCharts';
import { createEmptyBudget } from '@/lib/budget-utils';

export default function ReportsPage() {
  const { loading: authLoading } = useAuth();
  const [budgets, setBudgets] = useState<MonthlyBudget[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      loadBudgets();
    }
  }, [authLoading]);

  const loadBudgets = async () => {
    try {
      // Usar únicamente localStorage para simplicidad en Vercel
      const budgetsList = loadFromLocalStorage();

      setBudgets(budgetsList);
      
      // Seleccionar el mes más reciente por defecto
      if (budgetsList.length > 0) {
        const latest = budgetsList.sort((a, b) => {
          if (a.year !== b.year) return b.year - a.year;
          return b.month - a.month;
        })[0];
        setSelectedMonth(`${latest.year}-${latest.month.toString().padStart(2, '0')}`);
      } else {
        // Si no hay presupuestos, crear uno actual para mostrar algo
        const now = new Date();
        const currentBudget = createEmptyBudget(now.getMonth() + 1, now.getFullYear());
        const newBudgetsList = [currentBudget];
        setBudgets(newBudgetsList);
        setSelectedMonth(`${currentBudget.year}-${currentBudget.month.toString().padStart(2, '0')}`);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading budgets:', error);
      setIsLoading(false);
    }
  };

  const loadFromLocalStorage = (): MonthlyBudget[] => {
    try {
      const savedBudget = localStorage.getItem('currentBudget');
      if (savedBudget) {
        const budget = JSON.parse(savedBudget);
        // Convertir strings de fecha a Date objects
        budget.createdAt = new Date(budget.createdAt);
        budget.updatedAt = new Date(budget.updatedAt);
        budget.incomes = budget.incomes.map((income: any) => ({
          ...income,
          date: new Date(income.date)
        }));
        budget.expenses = budget.expenses.map((expense: any) => ({
          ...expense,
          date: new Date(expense.date)
        }));
        return [budget];
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    
    return [];
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const getAvailableMonths = () => {
    // Usar Set para eliminar duplicados basados en el valor mes-año
    const uniqueMonths = new Map();
    
    budgets.forEach(budget => {
      const monthKey = `${budget.year}-${budget.month.toString().padStart(2, '0')}`;
      if (!uniqueMonths.has(monthKey)) {
        uniqueMonths.set(monthKey, {
          value: monthKey,
          label: `${monthNames[budget.month - 1]} ${budget.year}`,
          budget: budget
        });
      }
    });
    
    return Array.from(uniqueMonths.values())
      .sort((a, b) => b.value.localeCompare(a.value));
  };

  const selectedBudget = budgets.find(budget => 
    `${budget.year}-${budget.month.toString().padStart(2, '0')}` === selectedMonth
  );

  if (authLoading || isLoading) {
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
            Reportes y Análisis Financieros
          </h1>
          <p className="text-gray-600 mt-1">
            Análisis inteligente por persona para mejores decisiones financieras
            <span className="text-sm text-orange-600 ml-2">(Modo local)</span>
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              📊 Reportes y Análisis Financieros
            </h1>
            <p className="text-gray-600 mt-1">
              Análisis inteligente por persona para mejores decisiones financieras
              <span className="text-sm text-orange-600 ml-2">(Modo local)</span>
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

      {/* Gráficos Avanzados por Persona */}
      <AdvancedFinancialCharts 
        currentBudget={selectedBudget}
        budgets={budgets}
      />


    </div>
  );
} 