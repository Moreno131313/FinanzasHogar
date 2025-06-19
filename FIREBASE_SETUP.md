# 🔥 Configuración de Firebase

## 📋 **Requisitos previos**
- Cuenta de Google
- Proyecto creado en [Firebase Console](https://console.firebase.google.com/)

## 🚀 **Pasos para configurar Firebase**

### 1. **Crear proyecto en Firebase**
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz click en "Crear un proyecto"
3. Nombre del proyecto: `finanzas-hogar` (o el que prefieras)
4. Acepta los términos y configura Analytics (opcional)

### 2. **Configurar Authentication**
1. En la consola de Firebase, ve a **Authentication**
2. Click en "Comenzar"
3. En la pestaña **Sign-in method**:
   - Habilita **Email/Password**
   - Guarda los cambios

### 3. **Configurar Firestore Database**
1. Ve a **Firestore Database**
2. Click en "Crear base de datos"
3. Selecciona **Modo de producción** (por seguridad)
4. Elige la ubicación más cercana (ej: `us-central1`)

### 4. **Configurar reglas de Firestore**
En la pestaña **Reglas** de Firestore, usa estas reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo usuarios autenticados pueden acceder a sus propios datos
    match /users/{userId}/budgets/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. **Obtener configuración del proyecto**
1. Ve a **Configuración del proyecto** (ícono de engranaje)
2. Baja hasta **Tus aplicaciones**
3. Click en **Web** (`</>`)
4. Registra la app con nombre: `Finanzas Hogar`
5. **NO** marcar "Firebase Hosting"
6. Copia la configuración que aparece

### 6. **Actualizar el archivo de configuración**

Edita el archivo `src/lib/firebase.ts` y reemplaza los valores de ejemplo:

```typescript
const firebaseConfig = {
  apiKey: "tu-api-key-aqui",
  authDomain: "tu-project-id.firebaseapp.com", 
  projectId: "tu-project-id",
  storageBucket: "tu-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## 🔒 **Configuración de seguridad recomendada**

### **Reglas adicionales de Firestore:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reglas para presupuestos de usuarios
    match /users/{userId}/budgets/{budgetId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId
        && resource.data.keys().hasAll(['id', 'month', 'year'])
        && request.resource.data.month is number
        && request.resource.data.year is number;
    }
  }
}
```

### **Configuración de Authentication:**
1. En **Settings** > **Users**:
   - Habilita "Allow multiple accounts per email address" si es necesario
2. En **Templates**:
   - Personaliza los emails de verificación si lo deseas

## 👥 **Crear usuarios iniciales**

### **Opción 1: Desde la aplicación**
1. Ejecuta la aplicación: `npm run dev`
2. Accede a `http://localhost:3000`
3. Registra cuentas para Katherine y Duvan

### **Opción 2: Desde Firebase Console**
1. Ve a **Authentication** > **Users**
2. Click "Add user"
3. Crea usuarios para:
   - Katherine: `katherine@finanzashogar.com`
   - Duvan: `duvan@finanzashogar.com`

## 🧪 **Probar la configuración**

### **Verificar Authentication:**
```bash
# En la consola de desarrollador del navegador
console.log('Usuario actual:', firebase.auth().currentUser);
```

### **Verificar Firestore:**
```bash
# Después de autenticarse, verificar conexión
console.log('Firestore conectado:', !!firebase.firestore());
```

## 📱 **Características habilitadas**

✅ **Autenticación por email/contraseña**
- Katherine y Duvan pueden crear cuentas separadas
- Sesiones persistentes entre dispositivos
- Cierre de sesión seguro

✅ **Base de datos en tiempo real**
- Datos sincronizados automáticamente
- Acceso desde cualquier dispositivo
- Backup automático en la nube

✅ **Seguridad**
- Cada usuario solo ve sus propios datos
- Reglas de seguridad estrictas
- Validación de datos

## 🔧 **Variables de entorno (opcional)**

Para mayor seguridad en producción, puedes usar variables de entorno:

```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## ❗ **Solución de problemas**

### **Error: "Firebase config object is invalid"**
- Verifica que todos los campos estén completados
- Asegúrate de que no haya espacios extra

### **Error: "Permission denied"**
- Verifica las reglas de Firestore
- Confirma que el usuario esté autenticado

### **Error: "Network error"**
- Verifica la conexión a internet
- Confirma que Firebase esté configurado correctamente

## 🎯 **¡Listo!**

Una vez completada la configuración:
1. Reinicia la aplicación: `npm run dev`
2. Katherine y Duvan pueden crear sus cuentas
3. Los datos se sincronizarán automáticamente
4. Pueden acceder desde cualquier dispositivo

¡Firebase está configurado y listo para usar! 🚀 