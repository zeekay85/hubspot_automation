type PdfDownloadButtonProps = {
  disabled?: boolean;
};

export function PdfDownloadButton({ disabled = true }: PdfDownloadButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-500 transition enabled:bg-ink enabled:text-white enabled:hover:bg-brand-700 disabled:cursor-not-allowed"
    >
      Download PDF soon
    </button>
  );
}
