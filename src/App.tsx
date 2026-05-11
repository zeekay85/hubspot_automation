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
    <div className="min-h-screen bg-slate-50 text-ink lg:flex">
      <Sidebar activeTool={activeTool} tools={tools} onSelectTool={setActiveTool} />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <section className="overflow-hidden rounded-[2rem] bg-ink text-white shadow-soft">
          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-brand-500/30 blur-3xl" />
            <div className="relative max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-brand-100">
                Portfolio dashboard scaffold
              </p>
              <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
                Marketing Ops Hub
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200">
                A SaaS-style command center for campaign planning, attribution QA, and documentation automation. Phase 1 focuses on layout, reusable UI, and static placeholders only.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 xl:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              isActive={tool.id === activeTool}
              onSelect={() => setActiveTool(tool.id)}
            />
          ))}
        </section>

        <section className="mt-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-slate-400">
                Active workspace
              </p>
              <h2 className="text-2xl font-black tracking-tight text-ink">{selectedTool.title}</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-600">{selectedTool.description}</p>
          </div>
          {renderWorkspace()}
        </section>
      </main>
    </div>
  );
}

export default App;
