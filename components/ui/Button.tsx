import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children, 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        // Base styles
        'inline-flex items-center justify-center font-medium transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        
        // Variants
        variant === 'primary' && 'bg-brand-500 text-white hover:bg-brand-600',
        variant === 'secondary' && 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        variant === 'outline' && 'border border-gray-300 bg-transparent hover:bg-gray-50',
        variant === 'ghost' && 'bg-transparent hover:bg-gray-100',
        variant === 'destructive' && 'bg-red-500 text-white hover:bg-red-600',
        
        // Sizes
        size === 'sm' && 'text-sm px-3 py-1.5 rounded-md',
        size === 'md' && 'text-sm px-4 py-2 rounded-lg',
        size === 'lg' && 'text-base px-6 py-3 rounded-lg',
        
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
