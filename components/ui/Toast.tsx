'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from 'react';

export type ToastKind = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
}

interface ToastContextValue {
  show: (message: string, kind?: ToastKind) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const AUTO_DISMISS_MS = 2200;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const show = useCallback((message: string, kind: ToastKind = 'info') => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, kind, message }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, AUTO_DISMISS_MS);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <ToastViewport toasts={toasts} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // SSR / no provider — fail open (console only) so callers don't crash.
    return {
      show: (m: string) => {
        // eslint-disable-next-line no-console
        console.log('[toast]', m);
      },
    };
  }
  return ctx;
}

function ToastViewport({ toasts }: { toasts: Toast[] }) {
  // Animate in with subtle slide-up
  return (
    <div
      className="fixed bottom-16 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}

function ToastItem({ toast }: { toast: Toast }) {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => setEntered(true));
  }, []);

  const colorClass =
    toast.kind === 'success'
      ? 'bg-text text-bg'
      : toast.kind === 'error'
        ? 'bg-text text-bg border border-[#ff3b30]'
        : 'bg-bg-muted text-text border border-border';

  return (
    <div
      role="status"
      className={[
        'px-4 h-9 inline-flex items-center text-[13px] tracking-tight',
        'rounded-pill shadow-apple-card pointer-events-auto',
        'transition-all duration-slow ease-apple',
        entered
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-4 scale-95',
        colorClass,
      ].join(' ')}
    >
      {toast.message}
    </div>
  );
}
