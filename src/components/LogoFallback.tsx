'use client';

interface LogoFallbackProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function LogoFallback({ size = 'md', showText = true }: LogoFallbackProps) {
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

  return (
    <div className="flex items-center space-x-3">
      {/* Logo Fallback */}
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-200`}>
        <span className="text-white font-bold text-sm">FH</span>
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