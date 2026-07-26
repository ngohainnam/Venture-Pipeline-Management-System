import { Loader2 } from "lucide-react"

interface MobileLoadingStateProps {
  label?: string
}

export function MobileLoadingState({
  label = "Loading",
}: MobileLoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 text-gray-600">
      <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  )
}
