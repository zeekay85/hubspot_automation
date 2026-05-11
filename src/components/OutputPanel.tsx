import { CopyButton } from './CopyButton';
import { PdfDownloadButton } from './PdfDownloadButton';

type OutputPanelProps = {
  title: string;
  description: string;
  emptyState: string;
  statusLabel?: string;
  isLoadingPreview?: boolean;
  showErrorPreview?: boolean;
};

export function OutputPanel({
  title,
  description,
  emptyState,
  statusLabel = 'Placeholder output',
  isLoadingPreview = false,
  showErrorPreview = false,
}: OutputPanelProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-600">{statusLabel}</p>
          <h3 className="mt-2 text-xl font-black tracking-tight text-ink">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <CopyButton />
          <PdfDownloadButton />
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6">
        {isLoadingPreview ? (
          <div className="space-y-3" aria-label="Loading placeholder">
            <div className="h-3 w-2/3 animate-pulse rounded-full bg-slate-200" />
            <div className="h-3 w-full animate-pulse rounded-full bg-slate-200" />
            <div className="h-3 w-5/6 animate-pulse rounded-full bg-slate-200" />
          </div>
        ) : showErrorPreview ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Error state placeholder: future API or validation messages will appear here.
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
              ✦
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">{emptyState}</p>
          </div>
        )}
      </div>
    </section>
  );
}
