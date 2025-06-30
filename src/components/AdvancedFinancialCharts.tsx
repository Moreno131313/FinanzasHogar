'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { MonthlyBudget, ExpenseItem, IncomeItem } from '@/types';
import { formatCurrency } from '@/lib/budget-utils';

interface AdvancedFinancialChartsProps {
  currentBudget: MonthlyBudget;
  budgets: MonthlyBudget[];
}

// Colores definidos para cada persona
const PERSON_COLORS = {
  duvan: '#3B82F6', // Azul
  katherine: '#EC4899', // Rosa
  compartidos: '#10B981', // Verde
};

const AdvancedFinancialCharts: React.FC<AdvancedFinancialChartsProps> = ({
  currentBudget,
  budgets,
}) => {
  
  // Función para determinar la persona según la categoría/subcategoría
  const getPersonFromItem = (item: IncomeItem | ExpenseItem): 'duvan' | 'katherine' | 'compartidos' => {
    const description = item.description.toLowerCase();
    const subcategory = item.subcategory.toLowerCase();
    
    if (description.includes('duvan') || subcategory.includes('duvan') || 
        description.includes('moreno') || subcategory.includes('moreno')) {
      return 'duvan';
    }
    if (description.includes('katherine') || subcategory.includes('katherine') || 
        description.includes('morena') || subcategory.includes('morena')) {
      return 'katherine';
    }
    return 'compartidos';
  };

  // Datos para gráfico de ingresos por persona
  const incomeByPerson = React.useMemo(() => {
    const data = { duvan: 0, katherine: 0, compartidos: 0 };
    
    currentBudget.incomes.forEach(income => {
      const person = getPersonFromItem(income);
      data[person] += income.amount;
    });
    
    return [
      { name: 'Duvan', value: data.duvan, color: PERSON_COLORS.duvan },
      { name: 'Katherine', value: data.katherine, color: PERSON_COLORS.katherine },
      { name: 'Compartidos', value: data.compartidos, color: PERSON_COLORS.compartidos },
    ];
  }, [currentBudget.incomes]);

  // Datos para gráfico de gastos por persona
  const expensesByPerson = React.useMemo(() => {
    const data = { duvan: 0, katherine: 0, compartidos: 0 };
    
    currentBudget.expenses.forEach(expense => {
      const person = getPersonFromItem(expense);
      data[person] += expense.amount;
    });
    
    return [
      { name: 'Duvan', value: data.duvan, color: PERSON_COLORS.duvan },
      { name: 'Katherine', value: data.katherine, color: PERSON_COLORS.katherine },
      { name: 'Compartidos', value: data.compartidos, color: PERSON_COLORS.compartidos },
    ];
  }, [currentBudget.expenses]);

  // Análisis de gastos por categoría y persona
  const expensesByCategory = React.useMemo(() => {
    const categoryData: Record<string, { duvan: number; katherine: number; compartidos: number; total: number }> = {};
    
    currentBudget.expenses.forEach(expense => {
      const category = expense.category;
      const person = getPersonFromItem(expense);
      
      if (!categoryData[category]) {
        categoryData[category] = { duvan: 0, katherine: 0, compartidos: 0, total: 0 };
      }
      
      categoryData[category][person] += expense.amount;
      categoryData[category].total += expense.amount;
    });
    
    return Object.entries(categoryData)
      .map(([category, data]) => ({
        category: category.charAt(0).toUpperCase() + category.slice(1),
        duvan: data.duvan,
        katherine: data.katherine,
        compartidos: data.compartidos,
        total: data.total,
      }))
      .sort((a, b) => b.total - a.total);
  }, [currentBudget.expenses]);

  // Tendencia de gastos por persona en los últimos meses
  const monthlyTrendByPerson = React.useMemo(() => {
    return budgets
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      })
      .slice(-6) // Últimos 6 meses
      .map(budget => {
        const monthName = new Date(budget.year, budget.month - 1).toLocaleDateString('es-ES', { 
          month: 'short', 
          year: '2-digit' 
        });
        
        const expenses = { duvan: 0, katherine: 0, compartidos: 0 };
        const incomes = { duvan: 0, katherine: 0, compartidos: 0 };
        
        budget.expenses.forEach(expense => {
          const person = getPersonFromItem(expense);
          expenses[person] += expense.amount;
        });
        
        budget.incomes.forEach(income => {
          const person = getPersonFromItem(income);
          incomes[person] += income.amount;
        });
        
        return {
          month: monthName,
          gastosDuvan: expenses.duvan,
          gastosKatherine: expenses.katherine,
          gastosCompartidos: expenses.compartidos,
          ingresosDuvan: incomes.duvan,
          ingresosKatherine: incomes.katherine,
          ingresosCompartidos: incomes.compartidos,
        };
      });
  }, [budgets]);

  // Análisis de eficiencia financiera
  const financialEfficiency = React.useMemo(() => {
    const totalIncome = currentBudget.incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpenses = currentBudget.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const essentialExpenses = currentBudget.expenses
      .filter(expense => expense.type === 'essential')
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
    const essentialRate = totalExpenses > 0 ? (essentialExpenses / totalExpenses) * 100 : 0;
    
    return [
      { 
        name: 'Tasa de Ahorro', 
        value: Math.max(0, savingsRate), 
        benchmark: 20, 
        color: savingsRate > 20 ? '#10B981' : savingsRate > 10 ? '#F59E0B' : '#EF4444' 
      },
      { 
        name: 'Gastos Esenciales', 
        value: essentialRate, 
        benchmark: 70, 
        color: essentialRate < 70 ? '#10B981' : essentialRate < 80 ? '#F59E0B' : '#EF4444' 
      },
    ];
  }, [currentBudget]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((pld: any, index: number) => (
            <p key={index} style={{ color: pld.color }}>
              {`${pld.dataKey}: ${formatCurrency(pld.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Resumen Visual por Persona */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">👥 Resumen Financiero por Persona</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Duvan', color: PERSON_COLORS.duvan, icon: '👨‍💼' },
            { name: 'Katherine', color: PERSON_COLORS.katherine, icon: '👩‍💼' },
            { name: 'Compartidos', color: PERSON_COLORS.compartidos, icon: '🏠' }
          ].map(person => {
            const personIncome = incomeByPerson.find(i => i.name === person.name)?.value || 0;
            const personExpenses = expensesByPerson.find(e => e.name === person.name)?.value || 0;
            const balance = personIncome - personExpenses;
            
            return (
              <div key={person.name} className="text-center p-4 rounded-lg border-2" style={{ borderColor: person.color }}>
                <div className="text-3xl mb-2">{person.icon}</div>
                <h4 className="font-semibold text-lg" style={{ color: person.color }}>{person.name}</h4>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Ingresos:</span>
                    <span className="font-medium text-green-600">{formatCurrency(personIncome)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Gastos:</span>
                    <span className="font-medium text-red-600">{formatCurrency(personExpenses)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold pt-2 border-t">
                    <span>Balance:</span>
                    <span className={balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(balance)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gráfico de Ingresos por Persona */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">💰 Distribución de Ingresos</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={incomeByPerson}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {incomeByPerson.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Gastos por Persona */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">💸 Distribución de Gastos</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expensesByPerson}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expensesByPerson.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gastos por Categoría y Persona */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">📊 Análisis por Categoría y Persona</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={expensesByCategory} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="duvan" 
                stackId="a" 
                name="Duvan" 
                fill={PERSON_COLORS.duvan} 
              />
              <Bar 
                dataKey="katherine" 
                stackId="a" 
                name="Katherine" 
                fill={PERSON_COLORS.katherine} 
              />
              <Bar 
                dataKey="compartidos" 
                stackId="a" 
                name="Compartidos" 
                fill={PERSON_COLORS.compartidos} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tendencia Mensual por Persona */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">📈 Tendencia de Gastos (6 meses)</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTrendByPerson} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="gastosDuvan" 
                stroke={PERSON_COLORS.duvan} 
                name="Gastos Duvan"
                strokeWidth={3}
              />
              <Line 
                type="monotone" 
                dataKey="gastosKatherine" 
                stroke={PERSON_COLORS.katherine} 
                name="Gastos Katherine"
                strokeWidth={3}
              />
              <Line 
                type="monotone" 
                dataKey="gastosCompartidos" 
                stroke={PERSON_COLORS.compartidos} 
                name="Gastos Compartidos"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Indicadores de Salud Financiera */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">🎯 Indicadores de Salud Financiera</h3>
        <div className="space-y-4">
          {financialEfficiency.map((indicator, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{indicator.name}</p>
                <p className="text-sm text-gray-600">
                  Meta: {indicator.benchmark}% | Actual: {indicator.value.toFixed(1)}%
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full"
                    style={{ 
                      width: `${Math.min(100, (indicator.value / indicator.benchmark) * 100)}%`,
                      backgroundColor: indicator.color 
                    }}
                  ></div>
                </div>
                <span 
                  className="text-lg font-bold"
                  style={{ color: indicator.color }}
                >
                  {indicator.value > indicator.benchmark ? '✅' : '⚠️'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recomendaciones Inteligentes */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">💡 Recomendaciones para Mejorar</h3>
        <div className="space-y-3">
          {expensesByPerson.find(p => p.name === 'Duvan')?.value && expensesByPerson.find(p => p.name === 'Katherine')?.value && 
           expensesByPerson.find(p => p.name === 'Duvan')!.value > expensesByPerson.find(p => p.name === 'Katherine')!.value && (
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <span className="text-blue-600 text-xl">💡</span>
              <div>
                <p className="font-medium text-blue-900">Desequilibrio en gastos de Duvan</p>
                <p className="text-sm text-blue-700">
                  Duvan tiene gastos mayores que Katherine. Considera revisar gastos personales o redistribuir gastos compartidos.
                </p>
              </div>
            </div>
          )}
          
          {financialEfficiency[0]?.value < 10 && (
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
              <span className="text-yellow-600 text-xl">⚠️</span>
              <div>
                <p className="font-medium text-yellow-900">Urgente: Mejorar tasa de ahorro</p>
                <p className="text-sm text-yellow-700">
                  Su tasa de ahorro está muy baja. Identifiquen gastos no esenciales que puedan reducir.
                </p>
              </div>
            </div>
          )}
          
          {financialEfficiency[1]?.value > 80 && (
            <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
              <span className="text-red-600 text-xl">🚨</span>
              <div>
                <p className="font-medium text-red-900">Optimizar gastos fijos</p>
                <p className="text-sm text-red-700">
                  Demasiados gastos esenciales. Busquen alternativas más económicas para servicios básicos.
                </p>
              </div>
            </div>
          )}
          
          <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
            <span className="text-green-600 text-xl">💰</span>
            <div>
              <p className="font-medium text-green-900">Estrategia recomendada</p>
              <p className="text-sm text-green-700">
                Implementen la regla 50/30/20: 50% gastos esenciales, 30% gastos personales, 20% ahorros.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFinancialCharts; 