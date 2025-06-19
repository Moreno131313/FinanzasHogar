import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User,
  updateProfile
} from 'firebase/auth';
import { auth } from './firebase';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

// Función para convertir Firebase User a AuthUser
export const convertFirebaseUser = (user: User): AuthUser => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName
});

// Iniciar sesión
export const signIn = async (email: string, password: string): Promise<AuthUser> => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return convertFirebaseUser(result.user);
};

// Registrar nuevo usuario
export const signUp = async (email: string, password: string, displayName: string): Promise<AuthUser> => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  
  // Actualizar el perfil con el nombre
  await updateProfile(result.user, { displayName });
  
  return convertFirebaseUser(result.user);
};

// Cerrar sesión
export const logOut = async (): Promise<void> => {
  await signOut(auth);
};

// Observar cambios en el estado de autenticación
export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user ? convertFirebaseUser(user) : null);
  });
}; 