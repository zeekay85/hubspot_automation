import { useMemo, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ToolCard } from './components/ToolCard';
import { tools, type ToolId } from './data/tools';
import { CampaignBriefPage } from './pages/CampaignBriefPage';
import { DocumentationPage } from './pages/DocumentationPage';
import { UtmBuilderPage } from './pages/UtmBuilderPage';

function App() {
  const [activeTool, setActiveTool] = useState<ToolId>('campaign');
  const selectedTool = useMemo(
    () => tools.find((tool) => tool.id === activeTool) ?? tools[0],
    [activeTool],
  );

  const renderWorkspace = () => {
    switch (activeTool) {
      case 'campaign':
        return <CampaignBriefPage />;
      case 'utm':
        return <UtmBuilderPage />;
      case 'documentation':
        return <DocumentationPage />;
      default:
        return <CampaignBriefPage />;
    }
  };

  return (
    <div className="min-h-screen text-ink lg:flex">
      <Sidebar activeTool={activeTool} tools={tools} onSelectTool={setActiveTool} />

      <main className="flex-1 p-4 sm:p-8 lg:p-10">
        <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-soft backdrop-blur">
          <div className="p-7 sm:p-9 lg:p-11">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-600">
                Portfolio dashboard scaffold
              </p>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">
                Marketing Ops Hub
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
                A SaaS-style command center for campaign planning, attribution QA, and documentation automation. Phase 1 focuses on layout, reusable UI, and static placeholders only.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 xl:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              isActive={tool.id === activeTool}
              onSelect={() => setActiveTool(tool.id)}
            />
          ))}
        </section>

        <section className="mt-9">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                Active workspace
              </p>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-ink">{selectedTool.title}</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-muted">{selectedTool.description}</p>
          </div>
          {renderWorkspace()}
        </section>
      </main>
    </div>
  );
}

export default App;
