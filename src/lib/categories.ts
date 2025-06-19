import { CategoryConfig, ExpenseCategory } from '@/types';

export const EXPENSE_CATEGORIES: Record<ExpenseCategory, CategoryConfig> = {
  vivienda: {
    name: 'Vivienda',
    color: 'bg-blue-500',
    icon: '🏠',
    subcategories: [
      { name: 'Arrendamiento', type: 'essential' },
      { name: 'Plan Moreno Wom', type: 'non-essential' },
      { name: 'Plan Morena Claro', type: 'non-essential' },
      { name: 'Internet Hogar Movistar', type: 'essential' },
      { name: 'Cuota celular semana 1', type: 'essential' },
      { name: 'Cuota celular semana 2', type: 'essential' },
      { name: 'Cuota celular semana 3', type: 'essential' },
      { name: 'Cuota celular semana 4', type: 'essential' },
      { name: 'Electricidad', type: 'essential' },
      { name: 'Gas', type: 'essential' },
      { name: 'Agua', type: 'non-essential' },
      { name: 'T.V. Cable, plataformas', type: 'non-essential' },
      { name: 'Aseo', type: 'essential' },
      { name: 'Mantenimiento/reparac.', type: 'non-essential' },
      { name: 'Suministros', type: 'non-essential' },
    ],
  },
  transporte: {
    name: 'Transporte',
    color: 'bg-green-500',
    icon: '🚗',
    subcategories: [
      { name: 'Gastos de taxi o bus', type: 'non-essential' },
      { name: 'Gasolina', type: 'non-essential' },
      { name: 'Mantenimiento', type: 'non-essential' },
    ],
  },
  alimentacion: {
    name: 'Alimentación',
    color: 'bg-orange-500',
    icon: '🍽️',
    subcategories: [
      { name: 'Mercado / despensa', type: 'essential' },
      { name: 'Restaurantes', type: 'non-essential' },
      { name: 'Refrigerios', type: 'essential' },
      { name: 'Otros en alimentación', type: 'variable' },
    ],
  },
  educacion: {
    name: 'Educación',
    color: 'bg-purple-500',
    icon: '📚',
    subcategories: [
      { name: 'Matrículas / pensiones', type: 'essential' },
      { name: 'Ruta escolar', type: 'essential' },
      { name: 'Útiles y papelería', type: 'essential' },
      { name: 'Uniformes', type: 'variable' },
      { name: 'Cuotas extraordinarias', type: 'variable' },
      { name: 'Otros gastos educativos', type: 'variable' },
    ],
  },
  'otros-gastos': {
    name: 'Otros gastos',
    color: 'bg-red-500',
    icon: '💼',
    subcategories: [
      { name: 'Salud', type: 'essential' },
      { name: 'Medicamentos no POS', type: 'essential' },
      { name: 'Pólizas de seguros', type: 'essential' },
      { name: 'Gastos mascotas', type: 'essential' },
      { name: 'Cuidado personal/Higiene', type: 'essential' },
      { name: 'Impuestos', type: 'variable' },
      { name: 'Préstamos', type: 'essential' },
      { name: 'Tarjetas de crédito', type: 'essential' },
      { name: 'Entretenimiento', type: 'variable' },
      { name: 'Otros gastos', type: 'variable' },
    ],
  },
};

export const INCOME_CATEGORIES = {
  katherine: {
    name: 'Katherine',
    icon: '👩‍💼',
    color: 'bg-pink-500',
    subcategories: [
      'Salario Katherine',
      'Honorarios Katherine',
      'Bonificaciones Katherine',
      'Otros ingresos Katherine',
    ],
  },
  duvan: {
    name: 'Duvan',
    icon: '👨‍💼', 
    color: 'bg-blue-500',
    subcategories: [
      'Salario Duvan',
      'Honorarios Duvan',
      'Bonificaciones Duvan',
      'Otros ingresos Duvan',
    ],
  },
  compartidos: {
    name: 'Ingresos Compartidos',
    icon: '🏠',
    color: 'bg-green-500',
    subcategories: [
      'Ingresos conjuntos',
      'Devoluciones',
      'Regalos o ayudas familiares',
      'Otros ingresos compartidos',
    ],
  },
};

export const getCategoryByName = (categoryName: string): ExpenseCategory | null => {
  const categories = Object.keys(EXPENSE_CATEGORIES) as ExpenseCategory[];
  return categories.find(key => EXPENSE_CATEGORIES[key].name === categoryName) || null;
};

export const getSubcategoryType = (category: ExpenseCategory, subcategoryName: string): 'essential' | 'non-essential' | 'variable' => {
  const categoryConfig = EXPENSE_CATEGORIES[category];
  const subcategory = categoryConfig.subcategories.find(sub => sub.name === subcategoryName);
  return subcategory?.type || 'variable';
}; 