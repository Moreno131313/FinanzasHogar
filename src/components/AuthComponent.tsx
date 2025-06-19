'use client';

import React, { useState } from 'react';
import { signIn, signUp } from '@/lib/auth-service';
import Logo from './Logo';

interface AuthComponentProps {
  onAuthSuccess?: () => void;
}

export default function AuthComponent({ onAuthSuccess }: AuthComponentProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, displayName);
      }
      onAuthSuccess?.();
    } catch (error: any) {
      console.error('Error de autenticación:', error);
      setError(
        error.code === 'auth/user-not-found' ? 'Usuario no encontrado' :
        error.code === 'auth/wrong-password' ? 'Contraseña incorrecta' :
        error.code === 'auth/email-already-in-use' ? 'El email ya está en uso' :
        error.code === 'auth/weak-password' ? 'La contraseña debe tener al menos 6 caracteres' :
        error.code === 'auth/invalid-email' ? 'Email inválido' :
        'Error de autenticación. Intenta de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {/* Logo y Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" showText={false} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Finanzas Hogar</h1>
          <p className="text-gray-600 mt-2">
            {isLogin ? 'Inicia sesión en tu cuenta' : 'Crea tu cuenta'}
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="input"
                placeholder="Katherine o Duvan"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-3"
          >
            {loading ? 'Cargando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
          </button>
        </form>

        {/* Cambiar entre Login y Registro */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setEmail('');
              setPassword('');
              setDisplayName('');
            }}
            className="text-primary-600 hover:text-primary-700 text-sm"
          >
            {isLogin 
              ? '¿No tienes cuenta? Crear una nueva' 
              : '¿Ya tienes cuenta? Iniciar sesión'
            }
          </button>
        </div>

        {/* Información para usuarios nuevos */}
        {!isLogin && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">💡 Información:</h3>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Cada uno puede crear su propia cuenta</li>
              <li>• Los datos se sincronizarán en todos sus dispositivos</li>
              <li>• Pueden acceder desde móvil, tablet o computadora</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 