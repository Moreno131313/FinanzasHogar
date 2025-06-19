'use client';

import Image from 'next/image';
import { useState } from 'react';
import LogoFallback from './LogoFallback';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function Logo({ size = 'md', showText = true }: LogoProps) {
  const [imageError, setImageError] = useState(false);
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  // Si hay error con la imagen, mostrar fallback
  if (imageError) {
    return <LogoFallback size={size} showText={showText} />;
  }

  return (
    <div className="flex items-center space-x-3">
      {/* Logo Image */}
      <div className={`${sizeClasses[size]} relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200`}>
        <Image
          src="/imagenes/presupuesto.png"
          alt="Finanzas Hogar Logo"
          fill
          className="object-cover"
          sizes={`${sizeClasses[size]}`}
          priority
          onError={() => setImageError(true)}
        />
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${textSizeClasses[size]} font-bold text-gray-900 leading-tight`}>
            Finanzas Hogar
          </h1>
          {size !== 'sm' && (
            <p className="text-xs text-gray-500 -mt-1">
              Presupuesto Personal
            </p>
          )}
        </div>
      )}
    </div>
  );
} 