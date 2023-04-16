import * as React from 'react'
import { VariantProps, cva } from 'class-variance-authority'

import { cn } from '../utils/utils'

const buttonVariants = cva(
  'w-fit inline-flex items-center justify-center font-highlight rounded-md text-white transition-colors disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      tone: {
        blue: 'bg-brightBlue shadow-brightBlue',
        pink: 'bg-brightPink shadow-brightPink',
        purple: 'bg-darkPurple shadow-darkPurple',
      },
      roundness: {
        full: 'rounded-full',
        standard: 'rounded-md',
      },
      size: {
        small: 'px-[1vw] py-[0.36vw] text-[0.4vw] leading-[0.4vw] hover-shadow-sm',
        medium: 'px-[3vw] py-[1.08vw] text-[1.2vw] leading-[1.2vw] hover-shadow-md',
        large: 'px-[4.5vw] py-[1.62vw] text-[1.8vw] leading-[1.8vw] hover-shadow-lg',
      },
    },
    defaultVariants: {
      tone: 'blue',
      roundness: 'standard',
      size: 'medium',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((
  { className, tone, roundness, size, ...props },
  ref
) => (
  <button
    className={cn(buttonVariants({ tone, roundness, className, size }))}
    ref={ref}
    {...props}
  />
))
Button.displayName = 'Button'

export { Button, buttonVariants }
