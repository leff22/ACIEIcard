import { cn } from '../../lib/utils'

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  className?: string
}

export function Progress({ className, value = 0, ...props }: ProgressProps) {
  return (
    <div
      className={cn('relative w-full overflow-hidden rounded-full bg-gray-200', className)}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-blue-600 transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </div>
  )
}