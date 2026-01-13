interface FormLayoutProps {
  title: string
  description?: string
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
}

export function FormLayout({ 
  title, 
  description, 
  children,
  maxWidth = 'lg'
}: FormLayoutProps) {
  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className={`${maxWidthClass[maxWidth]} mx-auto px-4`}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="mt-2 text-gray-600">{description}</p>
          )}
        </div>
        
        {/* Form card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {children}
        </div>
      </div>
    </div>
  )
}

// For multi-step forms or sectioned forms
export function FormSection({ 
  title, 
  description, 
  children 
}: { 
  title: string
  description?: string
  children: React.ReactNode 
}) {
  return (
    <div className="pb-8 mb-8 border-b border-gray-200 last:border-0 last:pb-0 last:mb-0">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}
