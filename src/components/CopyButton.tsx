type CopyButtonProps = {
  disabled?: boolean;
};

export function CopyButton({ disabled = true }: CopyButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-500 transition enabled:hover:border-brand-500 enabled:hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
    >
      Copy output
    </button>
  );
}
