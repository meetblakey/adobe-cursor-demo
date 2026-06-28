'use client'

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { Badge as SpectrumBadge } from "@adobe/react-spectrum"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { useSpectrumDesignSystem } from "@/components/spectrum-provider"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type PigmentBadgeProps = useRender.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants>

// Pigment variant -> Spectrum Badge semantic color. Spectrum has no outline
// badge, so the muted/outline chips map to the neutral semantic.
const SPECTRUM_BADGE = {
  default: "indigo",
  secondary: "neutral",
  destructive: "negative",
  outline: "neutral",
  ghost: "neutral",
  link: "indigo",
} as const

const SPECTRUM_BADGE_COLOR_CLASS =
  /^(?:text-|bg-|border-|hover:text-|hover:bg-|dark:text-|dark:bg-|dark:border-)/

function spectrumBadgeClassName(className?: string) {
  if (typeof className !== "string") return undefined
  const layoutOnly = className
    .split(/\s+/)
    .filter((token) => token && !SPECTRUM_BADGE_COLOR_CLASS.test(token))
    .join(" ")
  return layoutOnly || undefined
}

// Legacy path keeps Base UI's useRender hook isolated so the public Badge can
// switch implementations without breaking the rules of hooks.
function LegacyBadge({
  className,
  variant = "default",
  render,
  ...props
}: PigmentBadgeProps) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

function Badge({ variant = "default", ...props }: PigmentBadgeProps) {
  const spectrum = useSpectrumDesignSystem()

  // Base UI `render` composition has no Spectrum equivalent — keep it on the
  // primitive even under Spectrum (no Badge call site uses it today).
  if (spectrum && props.render == null) {
    return (
      <SpectrumBadge
        variant={SPECTRUM_BADGE[variant ?? "default"]}
        UNSAFE_className={spectrumBadgeClassName(props.className)}
      >
        {props.children as React.ReactNode}
      </SpectrumBadge>
    )
  }

  return <LegacyBadge variant={variant} {...props} />
}

export { Badge, badgeVariants }
