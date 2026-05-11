import type { Tool } from '../data/tools';

type ToolCardProps = {
  tool: Tool;
  isActive: boolean;
  onSelect: () => void;
};

export function ToolCard({ tool, isActive, onSelect }: ToolCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group rounded-2xl border bg-white p-6 text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-soft ${
        isActive ? 'border-brand-300 ring-4 ring-brand-100/70' : 'border-slate-200/80'
      }`}
    >
      <div className={`h-1.5 w-16 rounded-full ${tool.accent}`} />
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
            {tool.eyebrow}
          </p>
          <h2 className="mt-2 text-lg font-extrabold tracking-tight text-ink">{tool.title}</h2>
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600">
          {tool.status}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted">{tool.description}</p>
      <p className="mt-5 text-sm font-bold text-brand-600 group-hover:text-brand-700">
        View workspace -&gt;
      </p>
    </button>
  );
}
