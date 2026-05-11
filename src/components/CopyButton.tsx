type CopyButtonProps = {
  disabled?: boolean;
  label?: string;
  onClick?: () => void;
};

export function CopyButton({ disabled = true, label = 'Copy output', onClick }: CopyButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-500 shadow-sm transition enabled:hover:border-brand-500 enabled:hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {label}
    </button>
  );
}
