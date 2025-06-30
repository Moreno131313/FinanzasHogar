'use client';

import { useState, useEffect } from 'react';
import { MonthlyBudget } from '@/types';
import { getUserBudgets } from '@/lib/firestore-service';
import { useAuth } from '@/contexts/AuthContext';
import AdvancedFinancialCharts from '@/components/AdvancedFinancialCharts';

export default function ReportsPage() {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<MonthlyBudget[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
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
            Reportes y Análisis Financieros
          </h1>
          <p className="text-gray-600 mt-1">
            Análisis inteligente por persona para mejores decisiones financieras
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