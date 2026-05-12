import type { Tool, ToolId } from '../data/tools';

type SidebarProps = {
  activeTool: ToolId;
  tools: Tool[];
  onSelectTool: (toolId: ToolId) => void;
};

export function Sidebar({ activeTool, tools, onSelectTool }: SidebarProps) {
  return (
    <aside className="border-b border-slate-200/80 bg-white/85 p-4 backdrop-blur-xl lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r lg:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-brand-100 bg-brand-600 text-lg font-extrabold text-white shadow-sm">
          <span className="tracking-tight">M</span>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-600">
            Marketing
          </p>
          <h1 className="text-xl font-extrabold tracking-tight text-ink">Ops Hub</h1>
        </div>
      </div>

      <div className="mt-9 rounded-2xl border border-brand-100 bg-brand-50/70 p-4">
        <p className="text-sm font-bold text-brand-700">Operational AI workspace</p>
        <p className="mt-1 text-sm leading-6 text-muted">
          Generate, save, reopen, copy, and export RevOps-ready campaign and documentation outputs.
        </p>
      </div>

      <nav className="mt-9 space-y-2" aria-label="Marketing operations tools">
        {tools.map((tool) => {
          const isActive = tool.id === activeTool;

          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => onSelectTool(tool.id)}
              className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                isActive
                  ? 'border-brand-200 bg-brand-50 text-brand-700 shadow-sm'
                  : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-white hover:text-ink'
              }`}
            >
              <span className="block text-xs font-bold uppercase tracking-[0.18em] opacity-70">
                {tool.eyebrow}
              </span>
              <span className="mt-1 block font-bold">{tool.title}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
