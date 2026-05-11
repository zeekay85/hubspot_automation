import { CopyButton } from './CopyButton';
import { PdfDownloadButton } from './PdfDownloadButton';

type AiOutputPanelProps = {
  title: string;
  description: string;
  emptyState: string;
  output: string;
  source?: 'gemini' | 'mock';
  isLoading: boolean;
  error: string;
  onCopy: () => void;
};

export function AiOutputPanel({
  title,
  description,
  emptyState,
  output,
  source,
  isLoading,
  error,
  onCopy,
}: AiOutputPanelProps) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-600">
            {source === 'gemini' ? 'Gemini response' : source === 'mock' ? 'Mock response' : 'AI preview'}
          </p>
          <h3 className="mt-2 text-xl font-extrabold tracking-tight text-ink">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <CopyButton disabled={!output} onClick={onCopy} label="Copy output" />
          <PdfDownloadButton />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-6">
        {isLoading ? (
          <div className="space-y-3" aria-label="Generating output">
            <div className="h-3 w-2/3 animate-pulse rounded-full bg-slate-200" />
            <div className="h-3 w-full animate-pulse rounded-full bg-slate-200" />
            <div className="h-3 w-5/6 animate-pulse rounded-full bg-slate-200" />
            <div className="h-3 w-3/5 animate-pulse rounded-full bg-slate-200" />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-700">
            {error}
          </div>
        ) : output ? (
          <pre className="whitespace-pre-wrap rounded-xl bg-white px-4 py-4 text-sm leading-6 text-slate-700 shadow-sm">
            {output}
          </pre>
        ) : (
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-100 bg-white text-2xl font-bold text-brand-600 shadow-sm">
              +
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">{emptyState}</p>
          </div>
        )}
      </div>
    </section>
  );
}
