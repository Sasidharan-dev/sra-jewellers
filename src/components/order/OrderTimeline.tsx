import { Check } from "lucide-react";
import { orderStatusSteps } from "@/data/orders";
import { cn } from "@/lib/utils";

export function OrderTimeline({ currentStepIndex }: { currentStepIndex: number }) {
  return (
    <ol className="flex flex-col gap-0">
      {orderStatusSteps.map((step, i) => {
        const completed = i <= currentStepIndex;
        const isLast = i === orderStatusSteps.length - 1;
        return (
          <li key={step} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs",
                  completed
                    ? "bg-maroon-800 border-maroon-800 text-cream-100"
                    : "border-ink-300/60 text-ink-300"
                )}
              >
                {completed ? <Check size={14} /> : i + 1}
              </span>
              {!isLast && (
                <span
                  className={cn(
                    "w-0.5 flex-1 min-h-8",
                    completed && i < currentStepIndex ? "bg-maroon-800" : "bg-ink-300/40"
                  )}
                />
              )}
            </div>
            <div className={cn("pb-8", isLast && "pb-0")}>
              <p
                className={cn(
                  "text-sm font-medium",
                  completed ? "text-maroon-900" : "text-ink-500"
                )}
              >
                {step}
              </p>
              {i === currentStepIndex && (
                <p className="text-xs text-gold-600 mt-0.5">Current status</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
