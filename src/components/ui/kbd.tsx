import { forwardRef, Children } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const kbdVariants = cva(
  'inline-flex items-center justify-center font-mono text-xs font-semibold rounded border border-border bg-muted text-muted-foreground shadow-sm transition-colors',
  {
    variants: {
      size: {
        xs: 'h-5 min-w-[1.25rem] px-1 text-[10px]',
        sm: 'h-6 min-w-[1.5rem] px-1.5 text-xs',
        md: 'h-7 min-w-[1.75rem] px-2 text-sm',
        lg: 'h-8 min-w-[2rem] px-2.5 text-base',
      },
      variant: {
        default: 'bg-muted border-border text-muted-foreground',
        outline: 'bg-background border-border text-foreground',
        solid: 'bg-primary border-primary text-primary-foreground shadow-md',
        ghost:
          'border-transparent bg-transparent text-muted-foreground hover:bg-muted',
      },
    },
    defaultVariants: {
      size: 'sm',
      variant: 'default',
    },
  }
)

export interface KbdProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof kbdVariants> {
  children: React.ReactNode
}

const Kbd = forwardRef<HTMLElement, KbdProps>(
  ({ className, children, size, variant, ...props }, ref) => {
    // Handle common key mappings
    const formatKey = (key: React.ReactNode): React.ReactNode => {
      const keyMappings: Record<string, string> = {
        cmd: '⌘',
        command: '⌘',
        ctrl: '⌃',
        control: '⌃',
        alt: '⌥',
        option: '⌥',
        shift: '⇧',
        enter: '↵',
        return: '↵',
        backspace: '⌫',
        delete: '⌦',
        tab: '⇥',
        escape: '⎋',
        esc: '⎋',
        ' ': '␣',
        up: '↑',
        down: '↓',
        left: '←',
        right: '→',
        home: '⤒',
        end: '⤓',
        pageup: '⇞',
        pagedown: '⇟',
      }

      if (typeof key === 'string') {
        return keyMappings[key.toLowerCase()] ?? key
      }
      return key
    }

    return (
      <kbd
        className={cn(kbdVariants({ size, variant }), className)}
        ref={ref}
        {...props}
      >
        {Children.map(children, (child) =>
          typeof child === 'string' ? formatKey(child) : child
        )}
      </kbd>
    )
  }
)

Kbd.displayName = 'Kbd'

export { Kbd, kbdVariants }
