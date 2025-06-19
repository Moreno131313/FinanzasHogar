import { BudgetSummary } from '@/types';
import { formatCurrency } from '@/lib/budget-utils';

interface BudgetSummaryCardProps {
  summary: BudgetSummary;
}

export default function BudgetSummaryCard({ summary }: BudgetSummaryCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {/* Total Ingresos */}
      <div className="card">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
              <span className="text-success-600 text-xl">💰</span>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Ingresos totales</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(summary.totalIncome)}
            </p>
          </div>
        </div>
      </div>

      {/* Total Gastos */}
      <div className="card">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-danger-100 rounded-lg flex items-center justify-center">
              <span className="text-danger-600 text-xl">💸</span>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Gastos totales</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(summary.totalExpenses)}
            </p>
          </div>
        </div>
      </div>

      {/* Diezmo (10%) */}
      <div className="card">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 text-xl">🙏</span>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Diezmo (10%)</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(summary.titheAmount)}
            </p>
          </div>
        </div>
      </div>

      {/* Ahorros (10%) */}
      <div className="card">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <span className="text-primary-600 text-xl">🏦</span>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Para ahorros (10%)</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(summary.savingsAmount)}
            </p>
          </div>
        </div>
      </div>

      {/* Disponible */}
      <div className="card">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              summary.availableAmount >= 0 
                ? 'bg-success-100' 
                : 'bg-danger-100'
            }`}>
              <span className={
                summary.availableAmount >= 0 
                  ? 'text-success-600' 
                  : 'text-danger-600'
              }>
                {summary.availableAmount >= 0 ? '✅' : '⚠️'}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Disponible</p>
            <p className={`text-lg font-semibold ${
              summary.availableAmount >= 0 
                ? 'text-success-600' 
                : 'text-danger-600'
            }`}>
              {formatCurrency(summary.availableAmount)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 