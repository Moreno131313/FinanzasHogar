import { formatCurrency } from '@/lib/budget-utils';

interface IncomeVsExpensesChartProps {
  income: number;
  expenses: number;
  tithe: number;
  savings: number;
}

export default function IncomeVsExpensesChart({ 
  income, 
  expenses, 
  tithe, 
  savings 
}: IncomeVsExpensesChartProps) {
  const budgetAfterDeductions = income - tithe - savings;
  const remaining = budgetAfterDeductions - expenses;
  
  // Calcular porcentajes para la visualización
  const expensePercentage = budgetAfterDeductions > 0 ? (expenses / budgetAfterDeductions) * 100 : 0;
  const remainingPercentage = budgetAfterDeductions > 0 ? (remaining / budgetAfterDeductions) * 100 : 0;

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Distribución del Presupuesto</h3>
      
      {/* Barra de progreso visual */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Presupuesto disponible</span>
          <span className="text-sm font-medium text-gray-900">
            {formatCurrency(budgetAfterDeductions)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div className="flex h-full">
            <div
              className="bg-danger-500"
              style={{ width: `${Math.min(expensePercentage, 100)}%` }}
              title={`Gastos: ${formatCurrency(expenses)}`}
            ></div>
            <div
              className="bg-success-500"
              style={{ width: `${Math.max(0, Math.min(remainingPercentage, 100 - expensePercentage))}%` }}
              title={`Disponible: ${formatCurrency(remaining)}`}
            ></div>
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Gastos: {expensePercentage.toFixed(1)}%</span>
          <span>Disponible: {Math.max(0, remainingPercentage).toFixed(1)}%</span>
        </div>
      </div>

      {/* Desglose de ingresos */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-success-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-success-600">💰</span>
            <span className="text-sm font-medium text-success-800">Ingresos totales</span>
          </div>
          <span className="text-sm font-semibold text-success-800">
            {formatCurrency(income)}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-purple-600">🙏</span>
            <span className="text-sm font-medium text-purple-800">Diezmo (10%)</span>
          </div>
          <span className="text-sm font-semibold text-purple-800">
            -{formatCurrency(tithe)}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-primary-600">🏦</span>
            <span className="text-sm font-medium text-primary-800">Ahorros (10%)</span>
          </div>
          <span className="text-sm font-semibold text-primary-800">
            -{formatCurrency(savings)}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border-2 border-gray-200">
          <div className="flex items-center space-x-2">
            <span>💼</span>
            <span className="text-sm font-medium text-gray-800">Presupuesto disponible</span>
          </div>
          <span className="text-sm font-semibold text-gray-800">
            {formatCurrency(budgetAfterDeductions)}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-danger-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-danger-600">💸</span>
            <span className="text-sm font-medium text-danger-800">Gastos totales</span>
          </div>
          <span className="text-sm font-semibold text-danger-800">
            -{formatCurrency(expenses)}
          </span>
        </div>

        <div className={`flex items-center justify-between p-3 rounded-lg ${
          remaining >= 0 ? 'bg-success-50 border-2 border-success-200' : 'bg-danger-50 border-2 border-danger-200'
        }`}>
          <div className="flex items-center space-x-2">
            <span>{remaining >= 0 ? '✅' : '⚠️'}</span>
            <span className={`text-sm font-medium ${
              remaining >= 0 ? 'text-success-800' : 'text-danger-800'
            }`}>
              {remaining >= 0 ? 'Saldo disponible' : 'Déficit'}
            </span>
          </div>
          <span className={`text-sm font-semibold ${
            remaining >= 0 ? 'text-success-800' : 'text-danger-800'
          }`}>
            {formatCurrency(Math.abs(remaining))}
          </span>
        </div>
      </div>
    </div>
  );
} 