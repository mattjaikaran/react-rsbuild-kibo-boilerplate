import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number
  height?: string | number
  circle?: boolean
}

function Skeleton({
  className,
  width,
  height,
  circle,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-muted',
        circle ? 'rounded-full' : 'rounded-md',
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
      {...props}
    />
  )
}

function SkeletonText({
  lines = 1,
  className,
  lastLineWidth = '60%',
}: {
  lines?: number
  className?: string
  lastLineWidth?: string
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          style={{
            width: i === lines - 1 && lines > 1 ? lastLineWidth : '100%',
          }}
        />
      ))}
    </div>
  )
}

function SkeletonAvatar({
  size = 40,
  className,
}: {
  size?: number
  className?: string
}) {
  return <Skeleton width={size} height={size} circle className={className} />
}

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-4 rounded-lg border p-4', className)}>
      <div className="flex items-center space-x-4">
        <SkeletonAvatar />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  )
}

function SkeletonTableRow({
  columns = 4,
  className,
}: {
  columns?: number
  className?: string
}) {
  return (
    <div className={cn('flex items-center space-x-4 py-3', className)}>
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4 flex-1"
          style={{ maxWidth: i === 0 ? '200px' : undefined }}
        />
      ))}
    </div>
  )
}

function SkeletonTable({
  rows = 5,
  columns = 4,
  className,
}: {
  rows?: number
  columns?: number
  className?: string
}) {
  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center space-x-4 border-b py-3">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-4 flex-1"
            style={{ maxWidth: i === 0 ? '200px' : undefined }}
          />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonTableRow key={i} columns={columns} />
      ))}
    </div>
  )
}

function SkeletonForm({
  fields = 4,
  className,
}: {
  fields?: number
  className?: string
}) {
  return (
    <div className={cn('space-y-6', className)}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <Skeleton className="h-10 w-32" />
    </div>
  )
}

function SkeletonStatCard({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-2 rounded-lg border p-6', className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8" circle />
      </div>
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-20" />
    </div>
  )
}

function SkeletonListItem({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center space-x-4 py-3', className)}>
      <Skeleton className="h-2 w-2" circle />
      <div className="flex-1 space-y-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-4 w-16" />
    </div>
  )
}

function SkeletonPageHeader({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-96" />
    </div>
  )
}

export {
  Skeleton,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonForm,
  SkeletonListItem,
  SkeletonPageHeader,
  SkeletonStatCard,
  SkeletonTable,
  SkeletonTableRow,
  SkeletonText,
}
