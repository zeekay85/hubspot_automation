type ToolHelpPanelProps = {
  title: string;
  description: string;
  bullets: string[];
};

export function ToolHelpPanel({ title, description, bullets }: ToolHelpPanelProps) {
  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            What this tool does
          </p>
          <h3 className="mt-2 text-base font-extrabold tracking-tight text-ink">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
        </div>
        <div className="group relative inline-flex self-start">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-100 bg-white text-sm font-bold text-brand-700 shadow-sm"
            aria-label="Show tool guidance"
          >
            ?
          </button>
          <div className="pointer-events-none absolute right-0 top-10 z-30 w-64 rounded-2xl border border-slate-200 bg-white p-3 text-xs leading-5 text-slate-600 opacity-0 shadow-card transition group-hover:opacity-100 group-focus-within:opacity-100">
            Add operational details such as attribution gaps, owners, routing rules, lifecycle
            stages, and reporting needs for a more realistic output.
          </div>
        </div>
      </div>
      <ul className="mt-4 grid gap-2 text-sm leading-6 text-slate-700 md:grid-cols-3">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2 rounded-xl bg-white p-3 shadow-sm">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
