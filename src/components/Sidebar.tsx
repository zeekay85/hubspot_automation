import type { Tool, ToolId } from '../data/tools';

type SidebarProps = {
  activeTool: ToolId;
  tools: Tool[];
  onSelectTool: (toolId: ToolId) => void;
};

export function Sidebar({ activeTool, tools, onSelectTool }: SidebarProps) {
  return (
    <aside className="border-b border-slate-200 bg-white/90 p-4 backdrop-blur lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r lg:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-lg font-black text-white shadow-soft">
          MO
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
            Marketing
          </p>
          <h1 className="text-xl font-black tracking-tight text-ink">Ops Hub</h1>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-brand-100 bg-brand-50 p-4">
        <p className="text-sm font-bold text-brand-700">Phase 1</p>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Static dashboard scaffold with placeholders for future automation, saved history,
          and PDF exports.
        </p>
      </div>

      <nav className="mt-8 space-y-2" aria-label="Marketing operations tools">
        {tools.map((tool) => {
          const isActive = tool.id === activeTool;

          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => onSelectTool(tool.id)}
              className={`w-full rounded-2xl px-4 py-3 text-left transition ${
                isActive
                  ? 'bg-ink text-white shadow-soft'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-ink'
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
