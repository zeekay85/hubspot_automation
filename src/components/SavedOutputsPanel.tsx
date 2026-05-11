import type { SavedOutput, SavedOutputType } from '../utils/savedOutputs';

type SavedOutputsPanelProps = {
  title: string;
  documentType: SavedOutputType;
  outputs: SavedOutput[];
  onOpen: (output: SavedOutput) => void;
  onDelete: (id: string) => void;
};

export function SavedOutputsPanel({
  title,
  documentType,
  outputs,
  onOpen,
  onDelete,
}: SavedOutputsPanelProps) {
  return (
    <section className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-600">Saved outputs</p>
        <h3 className="mt-2 text-xl font-extrabold tracking-tight text-ink">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-muted">
          Reopen recent {documentType.toLowerCase()} outputs saved locally in this browser.
        </p>
      </div>

      {outputs.length ? (
        <div className="mt-5 grid gap-3">
          {outputs.map((output) => (
            <div
              key={output.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-bold text-ink">{output.title}</p>
                <p className="mt-1 text-xs text-muted">
                  {output.documentType} • {new Date(output.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onOpen(output)}
                  className="rounded-xl border border-brand-200 bg-white px-3 py-2 text-xs font-semibold text-brand-700 shadow-sm transition hover:bg-brand-50"
                >
                  Reopen
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(output.id)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-rose-300 hover:text-rose-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-8 text-center">
          <p className="text-sm font-semibold text-ink">No saved outputs yet</p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Generated outputs will appear here after they are saved locally.
          </p>
        </div>
      )}
    </section>
  );
}
