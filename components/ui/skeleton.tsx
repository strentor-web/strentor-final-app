import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-md bg-muted bg-[linear-gradient(110deg,hsl(var(--muted))_40%,hsl(var(--primary)/0.18)_50%,hsl(var(--muted))_60%)] bg-[length:200%_100%]",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
