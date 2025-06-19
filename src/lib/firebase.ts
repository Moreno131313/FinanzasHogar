import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase
// IMPORTANTE: Estas son claves públicas, es normal que estén en el código del cliente
const firebaseConfig = {
  apiKey: "AIzaSyAw1a_sAjnB0mlo07XqFBvs7V5yHmq7LsA",
  authDomain: "finanzas-hogar-eca48.firebaseapp.com",
  projectId: "finanzas-hogar-eca48",
  storageBucket: "finanzas-hogar-eca48.firebasestorage.app",
  messagingSenderId: "885847708621",
  appId: "1:885847708621:web:765f9704ffef48ecb3ea84"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Servicios de Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app; 