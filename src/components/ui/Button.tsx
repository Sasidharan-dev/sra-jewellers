import { cn } from "@/lib/utils";
import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-maroon-800 text-cream-100 hover:bg-maroon-900 border border-maroon-800",
  secondary:
    "bg-gold-500 text-maroon-950 hover:bg-gold-400 border border-gold-500",
  outline:
    "bg-transparent text-maroon-800 border border-maroon-800 hover:bg-maroon-800 hover:text-cream-100",
  ghost:
    "bg-transparent text-ink-700 border border-transparent hover:bg-cream-300",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-xs px-3.5 py-2 gap-1.5",
  md: "text-sm px-5 py-2.5 gap-2",
  lg: "text-sm px-7 py-3.5 gap-2.5",
};

const base =
  "inline-flex items-center justify-center font-medium tracking-wide transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap";

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type LinkButtonProps = BaseProps & {
  href: string;
  children: ReactNode;
  className?: string;
  target?: string;
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  fullWidth,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        base,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {icon && iconPosition === "left" && icon}
      {children}
      {icon && iconPosition === "right" && icon}
    </button>
  );
}

export function LinkButton({
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  fullWidth,
  className,
  href,
  children,
  target,
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      target={target}
      className={cn(
        base,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className
      )}
    >
      {icon && iconPosition === "left" && icon}
      {children}
      {icon && iconPosition === "right" && icon}
    </Link>
  );
}
