import { cn } from '../../lib/utils'

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive'
  className?: string
}

export function Alert({ 
  className, 
  variant = 'default', 
  ...props 
}: AlertProps) {
  const variants = {
    default: 'bg-blue-50 text-blue-900 border-blue-200',
    destructive: 'bg-red-50 text-red-900 border-red-200'
  }

  return (
    <div
      className={cn(
        'relative w-full rounded-lg border p-4',
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export interface AlertDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string
}

export function AlertDescription({ className, ...props }: AlertDescriptionProps) {
  return (
    <div
      className={cn('text-sm [&_p]:leading-relaxed', className)}
      {...props}
    />
  )
}