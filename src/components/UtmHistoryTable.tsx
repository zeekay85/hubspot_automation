import type { SavedUtmLink } from '../utils/utm';

type UtmHistoryTableProps = {
  links: SavedUtmLink[];
  isLoading: boolean;
  onCopy: (url: string) => void;
  onRegenerate: (link: SavedUtmLink) => void;
  onClear: () => void;
};

function formatTimestamp(timestamp: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(timestamp));
}

export function UtmHistoryTable({
  links,
  isLoading,
  onCopy,
  onRegenerate,
  onClear,
}: UtmHistoryTableProps) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-600">
            Local history
          </p>
          <h3 className="mt-2 text-xl font-extrabold tracking-tight text-ink">Saved UTM links</h3>
          <p className="mt-2 text-sm leading-6 text-muted">
            Reuse previous campaign links or copy them for QA without leaving the dashboard.
          </p>
        </div>
        <button
          type="button"
          onClick={onClear}
          disabled={!links.length}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition enabled:hover:border-rose-300 enabled:hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Clear History
        </button>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
        {isLoading ? (
          <div className="space-y-3 bg-slate-50/80 p-5" aria-label="Loading saved UTM links">
            <div className="h-3 w-1/3 animate-pulse rounded-full bg-slate-200" />
            <div className="h-3 w-full animate-pulse rounded-full bg-slate-200" />
            <div className="h-3 w-5/6 animate-pulse rounded-full bg-slate-200" />
          </div>
        ) : links.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                <tr>
                  <th className="px-4 py-3">Generated</th>
                  <th className="px-4 py-3">Campaign</th>
                  <th className="px-4 py-3">URL</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {links.map((link) => (
                  <tr key={link.id} className="align-top">
                    <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                      {formatTimestamp(link.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-ink">{link.campaign || 'Untitled'}</p>
                      <p className="mt-1 text-xs text-muted">
                        {link.source} / {link.medium}
                      </p>
                    </td>
                    <td className="max-w-md px-4 py-4">
                      <p className="break-all rounded-xl bg-slate-50 px-3 py-2 font-mono text-xs leading-5 text-slate-700">
                        {link.generatedUrl}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => onRegenerate(link)}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-brand-300 hover:text-brand-700"
                        >
                          Regenerate
                        </button>
                        <button
                          type="button"
                          onClick={() => onCopy(link.generatedUrl)}
                          className="rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-700 shadow-sm transition hover:border-brand-300 hover:bg-brand-100"
                        >
                          Copy
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-slate-50/80 p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-100 bg-white text-lg font-bold text-brand-600 shadow-sm">
              +
            </div>
            <p className="mt-4 text-sm font-semibold text-ink">No saved links yet</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Generate a valid UTM URL and save it to build your local launch history.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
