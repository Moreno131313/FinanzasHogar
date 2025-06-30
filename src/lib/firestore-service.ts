import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  where,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { MonthlyBudget, IncomeItem, ExpenseItem } from '@/types';

// Convertir MonthlyBudget para Firestore (fechas a Timestamp)
const budgetToFirestore = (budget: MonthlyBudget) => ({
  ...budget,
  createdAt: Timestamp.fromDate(budget.createdAt),
  updatedAt: Timestamp.fromDate(budget.updatedAt),
  incomes: budget.incomes.map(income => ({
    ...income,
    date: Timestamp.fromDate(income.date)
  })),
  expenses: budget.expenses.map(expense => ({
    ...expense,
    date: Timestamp.fromDate(expense.date)
  }))
});

// Convertir de Firestore a MonthlyBudget (Timestamp a Date)
const budgetFromFirestore = (data: any): MonthlyBudget => ({
  ...data,
  createdAt: data.createdAt.toDate(),
  updatedAt: data.updatedAt.toDate(),
  incomes: data.incomes.map((income: any) => ({
    ...income,
    date: income.date.toDate()
  })),
  expenses: data.expenses.map((expense: any) => ({
    ...expense,
    date: expense.date.toDate()
  }))
});

// Guardar presupuesto del usuario
export const saveBudget = async (userId: string, budget: MonthlyBudget): Promise<void> => {
  try {
    const budgetRef = doc(db, `users/${userId}/budgets`, budget.id);
    await setDoc(budgetRef, budgetToFirestore(budget));
  } catch (error) {
    console.error('Error saving budget to Firestore:', error);
    throw error;
  }
};

// Obtener todos los presupuestos del usuario - Consulta simplificada
export const getUserBudgets = async (userId: string): Promise<MonthlyBudget[]> => {
  try {
    const budgetsRef = collection(db, `users/${userId}/budgets`);
    // Solo obtener todos los documentos, sin filtros complejos
    const snapshot = await getDocs(budgetsRef);
    
    const budgets = snapshot.docs.map(doc => budgetFromFirestore(doc.data()));
    
    // Ordenar en JavaScript en lugar de Firestore
    return budgets.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year; // desc
      return b.month - a.month; // desc
    });
  } catch (error) {
    console.error('Error getting user budgets:', error);
    throw error;
  }
};

// Obtener un presupuesto específico
export const getBudget = async (userId: string, budgetId: string): Promise<MonthlyBudget | null> => {
  try {
    const budgetRef = doc(db, `users/${userId}/budgets`, budgetId);
    const snapshot = await getDoc(budgetRef);
    
    if (snapshot.exists()) {
      return budgetFromFirestore(snapshot.data());
    }
    
    return null;
  } catch (error) {
    console.error('Error getting budget:', error);
    throw error;
  }
};

// Eliminar un presupuesto
export const deleteBudget = async (userId: string, budgetId: string): Promise<void> => {
  try {
    const budgetRef = doc(db, `users/${userId}/budgets`, budgetId);
    await deleteDoc(budgetRef);
  } catch (error) {
    console.error('Error deleting budget:', error);
    throw error;
  }
};

// Obtener presupuesto del mes actual - Simplificado
export const getCurrentMonthBudget = async (userId: string): Promise<MonthlyBudget | null> => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    
    // Obtener todos los presupuestos y filtrar en JavaScript
    const budgets = await getUserBudgets(userId);
    
    // Buscar el presupuesto del mes actual
    const currentBudget = budgets.find(budget => 
      budget.month === currentMonth && budget.year === currentYear
    );
    
    return currentBudget || null;
  } catch (error) {
    console.error('Error getting current month budget:', error);
    throw error;
  }
}; 