# 💰 Finanzas Hogar

Aplicación web para gestionar el presupuesto personal mensual del hogar.

## 📋 Características

- **Dashboard interactivo** con resumen del presupuesto actual
- **Gestión de ingresos** por categorías (salarios, honorarios, ingresos ocasionales, etc.)
- **Gestión de gastos** organizados por categorías:
  - 🏠 Vivienda (arrendamiento, servicios, internet, etc.)
  - 🚗 Transporte (gasolina, taxi/bus, mantenimiento)
  - 🍽️ Alimentación (mercado, restaurantes, refrigerios)
  - 📚 Educación (matrículas, útiles, ruta escolar)
  - 💼 Otros gastos (salud, seguros, entretenimiento)
- **Cálculo automático** de diezmo (10%) y ahorros (10%)
- **Visualización** del saldo disponible y distribución del presupuesto
- **Almacenamiento local** de datos en el navegador
- **Interfaz moderna** y responsive con Tailwind CSS

## 🚀 Tecnologías

- **Next.js 15** - Framework de React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **React Hooks** - Gestión de estado

## 📦 Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repo>
   cd finanzas-hogar
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador:**
   Visita `http://localhost:3000`

## 🎯 Uso

### Dashboard Principal
- Ve el resumen de tu presupuesto actual
- Visualiza ingresos totales, gastos, diezmo, ahorros y saldo disponible
- Gráficos de distribución del presupuesto

### Gestión de Presupuesto
1. **Agregar Ingresos:**
   - Selecciona el tipo de ingreso
   - Ingresa el monto y fecha
   - Se calcula automáticamente el 10% para diezmo y 10% para ahorros

2. **Agregar Gastos:**
   - Selecciona la categoría y subcategoría
   - Los gastos se clasifican automáticamente como esenciales, no esenciales o variables
   - Ingresa el monto y fecha

### Categorías de Gastos

**🏠 Vivienda:**
- Arrendamiento
- Planes de teléfono
- Internet
- Servicios (electricidad, gas, agua)
- Aseo y mantenimiento

**🚗 Transporte:**
- Taxi/bus
- Gasolina
- Mantenimiento vehicular

**🍽️ Alimentación:**
- Mercado/despensa
- Restaurantes
- Refrigerios

**📚 Educación:**
- Matrículas/pensiones
- Ruta escolar
- Útiles y papelería
- Uniformes

**💼 Otros Gastos:**
- Salud y medicamentos
- Pólizas de seguros
- Entretenimiento
- Cuidado personal

## 📊 Características del Presupuesto

- **Ingresos totales:** Suma de todos los ingresos del mes
- **Diezmo (10%):** Cálculo automático del 10% de ingresos
- **Ahorros (10%):** Cálculo automático del 10% de ingresos
- **Presupuesto disponible:** Ingresos - Diezmo - Ahorros
- **Saldo disponible:** Presupuesto disponible - Gastos totales

## 🎨 Diseño

La aplicación cuenta con:
- Diseño responsive para móviles y escritorio
- Colores diferenciados por tipo de gasto
- Iconos intuitivos para cada categoría
- Interfaz limpia y moderna

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Páginas de Next.js
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Dashboard
│   └── budget/            # Gestión de presupuesto
├── components/            # Componentes reutilizables
├── lib/                   # Utilidades y configuración
│   ├── budget-utils.ts    # Funciones de cálculo
│   └── categories.ts      # Configuración de categorías
└── types/                 # Tipos TypeScript
```

## 🔧 Scripts Disponibles

```bash
npm run dev      # Modo desarrollo
npm run build    # Construir para producción
npm run start    # Ejecutar versión de producción
npm run lint     # Verificar código
```

## 💾 Almacenamiento

Los datos se guardan localmente en el navegador usando `localStorage`. No se requiere base de datos externa.

## 🤝 Contribuir

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit cambios (`git commit -am 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. 