'use client';

interface LoaderAnimationProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'minimal' | 'dots' | 'fashion';
  text?: string;
  className?: string;
}

export default function LoaderAnimation({ 
  size = 'md', 
  variant = 'default', 
  text = '',
  className = '' 
}: LoaderAnimationProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className={`${sizeClasses[size]} border-2 border-[#1ca4bc] border-t-transparent rounded-full animate-spin`}></div>
        {text && <span className={`ml-3 text-gray-600 ${textSizeClasses[size]}`}>{text}</span>}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-[#1ca4bc] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-[#159bb3] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-[#0d7377] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        {text && <span className={`text-gray-600 ${textSizeClasses[size]} font-medium`}>{text}</span>}
      </div>
    );
  }

  if (variant === 'fashion') {
    return (
      <div className={`flex flex-col items-center justify-center space-y-6 ${className}`}>
        <div className="relative">
          {/* Main spinning ring */}
          <div className={`${sizeClasses[size]} border-4 border-gray-200 rounded-full`}></div>
          <div className={`absolute inset-0 ${sizeClasses[size]} border-4 border-[#1ca4bc] border-t-transparent rounded-full animate-spin`}></div>
          
          {/* Inner pulsing circle */}
          <div className="absolute inset-2 bg-[#1ca4bc]/20 rounded-full animate-pulse"></div>
          
          {/* Fashion icon in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#1ca4bc]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          </div>
        </div>
        
        {text && (
          <div className="text-center">
            <span className={`text-gray-700 ${textSizeClasses[size]} font-semibold`}>{text}</span>
            <div className="flex justify-center mt-2">
              <div className="w-8 h-0.5 bg-[#1ca4bc] rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default variant - Kustom Inspira branded loader
  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      {/* Main loader animation */}
      <div className="relative">
        {/* Outer ring */}
        <div className={`${sizeClasses[size]} border-4 border-gray-200 rounded-full`}></div>
        
        {/* Spinning gradient ring */}
        <div className={`absolute inset-0 ${sizeClasses[size]} rounded-full animate-spin`} style={{
          background: 'conic-gradient(from 0deg, transparent, #1ca4bc, transparent)',
          mask: 'radial-gradient(farthest-side, transparent calc(50% - 4px), white calc(50% - 4px))',
          WebkitMask: 'radial-gradient(farthest-side, transparent calc(50% - 4px), white calc(50% - 4px))'
        }}></div>
        
        {/* Inner pulsing dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-[#1ca4bc] rounded-full animate-ping"></div>
        </div>
        
        {/* Kustom Inspira logo/icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
            <span className="text-[#1ca4bc] font-bold text-xs">K</span>
          </div>
        </div>
      </div>
      
      {/* Loading text */}
      {text && (
        <div className="text-center">
          <span className={`text-gray-700 ${textSizeClasses[size]} font-medium`}>{text}</span>
          {/* Animated dots */}
          <div className="flex justify-center space-x-1 mt-2">
            <div className="w-1 h-1 bg-[#1ca4bc] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1 h-1 bg-[#1ca4bc] rounded-full animate-bounce" style={{ animationDelay: '100ms' }}></div>
            <div className="w-1 h-1 bg-[#1ca4bc] rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
          </div>
        </div>
      )}
    </div>
  );
}

// Full screen loader component
export function FullScreenLoader({ 
  text = 'Loading...', 
  variant = 'fashion',
  showLogo = true 
}: { 
  text?: string; 
  variant?: 'default' | 'minimal' | 'dots' | 'fashion';
  showLogo?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm">
      <div className="text-center">
        {showLogo && (
          <div className="mb-8">
            <img 
              src="/assets/Kustom Inspira.png" 
              alt="Kustom Inspira" 
              className="h-12 w-auto mx-auto opacity-80"
            />
          </div>
        )}
        
        <LoaderAnimation 
          size="lg" 
          variant={variant}
          text={text}
        />
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-[#1ca4bc]">#DariKainJadiKarya</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// Button loader component
export function ButtonLoader({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  
  return (
    <div className={`${sizeClass} border-2 border-white border-t-transparent rounded-full animate-spin`}></div>
  );
}