"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground transition-all duration-300 focus-visible:border-primary/50 focus-visible:ring-primary/20 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-24 w-full rounded-xl border bg-transparent px-4 py-3 text-base shadow-sm outline-none focus-visible:ring-[4px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm hover:border-primary/30 hover:bg-primary/[0.02] dark:hover:bg-primary/[0.05]",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
