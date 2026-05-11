type PdfDownloadButtonProps = {
  disabled?: boolean;
  label?: string;
  onClick?: () => void;
};

export function PdfDownloadButton({
  disabled = true,
  label = 'Download PDF',
  onClick,
}: PdfDownloadButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-500 shadow-sm transition enabled:border-brand-600 enabled:bg-brand-600 enabled:text-white enabled:hover:bg-brand-700 disabled:cursor-not-allowed"
    >
      {label}
    </button>
  );
}
