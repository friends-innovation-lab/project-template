import { cn } from '@/lib/utils'

interface AvatarProps {
  src?: string
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Avatar({ src, name, size = 'md' }: AvatarProps) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  }
  
  if (src) {
    return (
      <img 
        src={src} 
        alt={name}
        className={cn('rounded-full object-cover', sizes[size])}
      />
    )
  }
  
  return (
    <div className={cn(
      'rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-medium',
      sizes[size]
    )}>
      {initials}
    </div>
  )
}
