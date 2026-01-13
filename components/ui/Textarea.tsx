import { cn } from '@/lib/utils'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Textarea({ 
  label, 
  error, 
  className, 
  id,
  ...props 
}: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s/g, '-')
  
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={cn(
          'block w-full rounded-lg border px-3 py-2 text-sm',
          'focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-brand-500',
          'placeholder:text-gray-400 resize-none',
          error 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-gray-300',
          className
        )}
        rows={4}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
