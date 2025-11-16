import { Toaster as SonnerToaster } from "sonner"

export type { ToasterProps } from "sonner"
export { toast } from "sonner"

export function Toaster() {
  return (
    <SonnerToaster
      richColors
      toastOptions={{
        classNames: {
          toast:
            "border border-border bg-background text-foreground shadow-lg data-[type=success]:border-emerald-500/40 data-[type=error]:border-destructive/60",
          title: "text-sm font-semibold",
          description: "text-muted-foreground",
        },
      }}
    />
  )
}
