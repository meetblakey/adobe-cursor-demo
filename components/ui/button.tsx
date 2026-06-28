'use client'

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import {
  Button as SpectrumButton,
  ActionButton as SpectrumActionButton,
  ToggleButton as SpectrumToggleButton,
} from "@adobe/react-spectrum"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { useSpectrumDesignSystem } from "@/components/spectrum-provider"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type PigmentButtonProps = ButtonPrimitive.Props & VariantProps<typeof buttonVariants>

// Pigment variant -> Spectrum visual. Spectrum has no ghost/link Button, so
// those become quiet ActionButtons; outline maps to an outline-style primary.
const SPECTRUM_BUTTON = {
  default: { kind: "button", variant: "accent" },
  secondary: { kind: "button", variant: "secondary" },
  outline: { kind: "button", variant: "primary", style: "outline" },
  destructive: { kind: "button", variant: "negative" },
  ghost: { kind: "quiet" },
  link: { kind: "quiet" },
} as const

/**
 * Renders the same Pigment Button API on top of Adobe React Spectrum. Keeps the
 * call site identical (`variant`, `onClick`, `className`, `aria-*`): `onClick`
 * becomes `onPress`, the layout `className` rides through `UNSAFE_className`
 * (Spectrum's documented escape hatch), and pressed controls become a real
 * Spectrum ToggleButton so `aria-pressed` stays a genuine toggle.
 */
function SpectrumPigmentButton({
  variant = "default",
  className,
  onClick,
  disabled,
  children,
  ...rest
}: PigmentButtonProps) {
  const ariaPressed = rest["aria-pressed"]
  const shared = {
    onPress: onClick ? () => (onClick as () => void)() : undefined,
    isDisabled: disabled || undefined,
    "aria-label": rest["aria-label"],
    // react-aria buttons support these ARIA relationship/state props — forward
    // them so toggles (e.g. the sidebar control) keep their a11y contract.
    "aria-expanded": rest["aria-expanded"],
    "aria-controls": rest["aria-controls"],
    "aria-haspopup": rest["aria-haspopup"],
    // Base UI className can be a function; Spectrum's UNSAFE_className is string-only.
    UNSAFE_className: typeof className === "string" ? className : undefined,
    children,
  }

  if (ariaPressed !== undefined) {
    return (
      <SpectrumToggleButton
        isQuiet
        isSelected={ariaPressed === true || ariaPressed === "true"}
        {...shared}
      />
    )
  }

  const map = SPECTRUM_BUTTON[variant ?? "default"]
  if (map.kind === "quiet") {
    return <SpectrumActionButton isQuiet {...shared} />
  }
  return (
    <SpectrumButton
      variant={map.variant}
      style={"style" in map ? map.style : undefined}
      {...shared}
    />
  )
}

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: PigmentButtonProps) {
  const spectrum = useSpectrumDesignSystem()

  // Spectrum has no equivalent of Base UI's `render` link-composition slot, so
  // links-styled-as-buttons stay on the composable primitive even under Spectrum.
  // ponytail: 2 call sites; revisit only if Spectrum href/elementType is wanted.
  if (spectrum && props.render == null) {
    return (
      <SpectrumPigmentButton variant={variant} className={className} {...props} />
    )
  }

  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
