import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react"

export function ErrorSummary({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="mt-4 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4"
    >
      <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
      <p className="text-sm text-destructive">{message}</p>
    </div>
  )
}

export function LoadingState({ label = "Submitting…" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      {label}
    </span>
  )
}

export function SuccessMessage({
  title = "Thank you — we've received your enquiry",
  description = "A member of the STRENTOR team will be in touch shortly at the email you provided.",
}: {
  title?: string
  description?: string
}) {
  return (
    <div className="rounded-2xl border border-[#C9A96A]/30 bg-[#C9A96A]/5 p-8 text-center">
      <CheckCircle2 className="mx-auto h-12 w-12 text-[#C9A96A]" />
      <h3 className="mt-4 text-xl font-bold text-foreground">{title}</h3>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </div>
  )
}
