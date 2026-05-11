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
      className={`group rounded-3xl border bg-white p-5 text-left shadow-soft transition hover:-translate-y-1 ${
        isActive ? 'border-brand-500 ring-4 ring-brand-100' : 'border-slate-200'
      }`}
    >
      <div className={`h-2 w-20 rounded-full bg-gradient-to-r ${tool.accent}`} />
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
            {tool.eyebrow}
          </p>
          <h2 className="mt-2 text-lg font-black tracking-tight text-ink">{tool.title}</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
          {tool.status}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{tool.description}</p>
      <p className="mt-5 text-sm font-bold text-brand-600 group-hover:text-brand-700">
        View workspace →
      </p>
    </button>
  );
}
