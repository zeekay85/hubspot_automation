type PdfDownloadButtonProps = {
  disabled?: boolean;
};

export function PdfDownloadButton({ disabled = true }: PdfDownloadButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-500 shadow-sm transition enabled:border-brand-600 enabled:bg-brand-600 enabled:text-white enabled:hover:bg-brand-700 disabled:cursor-not-allowed"
    >
      Download PDF soon
    </button>
  );
}
