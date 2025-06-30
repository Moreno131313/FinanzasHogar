import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
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
  const budgetRef = doc(db, `users/${userId}/budgets`, budget.id);
  await setDoc(budgetRef, budgetToFirestore(budget));
};

// Obtener todos los presupuestos del usuario
export const getUserBudgets = async (userId: string): Promise<MonthlyBudget[]> => {
  const budgetsRef = collection(db, `users/${userId}/budgets`);
  // Simplified query - just get all budgets and sort in JavaScript
  const snapshot = await getDocs(budgetsRef);
  
  const budgets = snapshot.docs.map(doc => budgetFromFirestore(doc.data()));
  
  // Sort in JavaScript instead of Firestore
  return budgets.sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year; // desc
    return b.month - a.month; // desc
  });
};

// Obtener un presupuesto específico
export const getBudget = async (userId: string, budgetId: string): Promise<MonthlyBudget | null> => {
  const budgetRef = doc(db, `users/${userId}/budgets`, budgetId);
  const snapshot = await getDoc(budgetRef);
  
  if (snapshot.exists()) {
    return budgetFromFirestore(snapshot.data());
  }
  
  return null;
};

// Eliminar un presupuesto
export const deleteBudget = async (userId: string, budgetId: string): Promise<void> => {
  const budgetRef = doc(db, `users/${userId}/budgets`, budgetId);
  await deleteDoc(budgetRef);
};

// Obtener presupuesto del mes actual
export const getCurrentMonthBudget = async (userId: string): Promise<MonthlyBudget | null> => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  
  const budgetsRef = collection(db, `users/${userId}/budgets`);
  // Get all budgets and filter in JavaScript
  const snapshot = await getDocs(budgetsRef);
  
  const budgets = snapshot.docs.map(doc => budgetFromFirestore(doc.data()));
  
  // Find current month budget in JavaScript
  const currentBudget = budgets.find(budget => 
    budget.month === currentMonth && budget.year === currentYear
  );
  
  return currentBudget || null;
}; 