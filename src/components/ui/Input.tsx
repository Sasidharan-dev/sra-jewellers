import { cn } from "@/lib/utils";
import {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  forwardRef,
} from "react";

const fieldBase =
  "w-full rounded-none border border-ink-300/60 bg-cream-100 px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-500 focus:border-gold-500 transition-colors";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }
>(({ className, label, error, id, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-ink-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn(fieldBase, error && "border-maroon-600", className)}
        {...props}
      />
      {error && <span className="text-xs text-maroon-600">{error}</span>}
    </div>
  );
});
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }
>(({ className, label, error, id, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-ink-700">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        className={cn(fieldBase, "min-h-28 resize-y", error && "border-maroon-600", className)}
        {...props}
      />
      {error && <span className="text-xs text-maroon-600">{error}</span>}
    </div>
  );
});
Textarea.displayName = "Textarea";

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement> & { label?: string; error?: string }
>(({ className, label, error, id, children, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-ink-700">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={cn(fieldBase, "cursor-pointer", error && "border-maroon-600", className)}
        {...props}
      >
        {children}
      </select>
      {error && <span className="text-xs text-maroon-600">{error}</span>}
    </div>
  );
});
Select.displayName = "Select";
