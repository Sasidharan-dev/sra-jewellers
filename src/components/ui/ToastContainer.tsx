"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, XCircle } from "lucide-react";
import { useToastStore } from "@/lib/store/toastStore";

const icons = {
  success: <CheckCircle2 size={18} className="text-emerald-600" />,
  info: <Info size={18} className="text-gold-600" />,
  error: <XCircle size={18} className="text-maroon-600" />,
};

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 w-[min(320px,90vw)]">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            className="flex items-start gap-2.5 bg-cream-100 border border-ink-300/30 card-shadow px-4 py-3 text-sm text-ink-900"
            role="status"
          >
            {icons[t.variant ?? "success"]}
            <p className="flex-1">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="text-ink-500 hover:text-ink-900 text-xs"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
