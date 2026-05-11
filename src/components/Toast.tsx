type ToastProps = {
  message: string;
};

export function Toast({ message }: ToastProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      className="fixed bottom-5 right-5 z-50 rounded-xl border border-brand-100 bg-white px-4 py-3 text-sm font-semibold text-ink shadow-soft"
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
