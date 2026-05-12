import type { GeneratedDocumentation } from '../services/aiApi';
import { CopyButton } from './CopyButton';
import { PdfDownloadButton } from './PdfDownloadButton';

type DocumentationOutputProps = {
  documentation?: GeneratedDocumentation;
  output: string;
  source?: 'gemini' | 'mock';
  isLoading: boolean;
  error: string;
  onCopy: () => void;
  onSave: () => void;
  onDownloadMarkdown: () => void;
  onDownloadPdf: () => void;
};

const sectionLabels = [
  ['Step-by-Step Process', 'processSteps'],
  ['Roles & Responsibilities', 'rolesResponsibilities'],
  ['Action Items', 'actionItems'],
  ['Risks & Open Questions', 'risksOpenQuestions'],
  ['Recommended Format', 'recommendedFormat'],
  ['QA Recommendations', 'qaRecommendations'],
  ['Stakeholder Dependencies', 'stakeholderDependencies'],
  ['Implementation Checklist', 'implementationChecklist'],
] as const;

const priorityStyles = {
  high: 'border-rose-200 bg-rose-50 text-rose-800',
  medium: 'border-amber-200 bg-amber-50 text-amber-800',
  low: 'border-slate-200 bg-slate-50 text-slate-700',
};

export function DocumentationOutput({
  documentation,
  output,
  source,
  isLoading,
  error,
  onCopy,
  onSave,
  onDownloadMarkdown,
  onDownloadPdf,
}: DocumentationOutputProps) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-600">
            {source === 'gemini' ? 'Gemini response' : source === 'mock' ? 'Mock response' : 'AI preview'}
          </p>
          <h3 className="mt-2 text-xl font-extrabold tracking-tight text-ink">
            Generated documentation preview
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted">
            A structured operational document formatted for review, ownership, and handoff.
          </p>
        </div>
        <div className="sticky top-3 z-20 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white/90 p-2 shadow-sm backdrop-blur">
          <CopyButton disabled={!output} onClick={onSave} label="Save" />
          <CopyButton disabled={!output} onClick={onCopy} label="Copy All" />
          <CopyButton disabled={!output} onClick={onDownloadMarkdown} label="Markdown" />
          <PdfDownloadButton disabled={!output} onClick={onDownloadPdf} />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-6">
        {isLoading ? (
          <div className="space-y-3" aria-label="Generating documentation">
            <div className="h-3 w-2/3 animate-pulse rounded-full bg-slate-200" />
            <div className="h-3 w-full animate-pulse rounded-full bg-slate-200" />
            <div className="h-3 w-5/6 animate-pulse rounded-full bg-slate-200" />
            <div className="h-3 w-3/5 animate-pulse rounded-full bg-slate-200" />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-700">
            {error}
          </div>
        ) : documentation ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
              <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">
                {documentation.title}
              </h4>
              <p className="mt-3 text-sm leading-6 text-slate-700">{documentation.summary}</p>
            </div>

            {documentation.priorityRecommendations.high.length ||
            documentation.priorityRecommendations.medium.length ||
            documentation.priorityRecommendations.low.length ? (
              <div className="grid gap-3 lg:grid-cols-3">
                {(['high', 'medium', 'low'] as const).map((priority) => (
                  <div
                    key={priority}
                    className={`rounded-2xl border p-4 shadow-sm ${priorityStyles[priority]}`}
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.16em]">
                      {priority} priority
                    </p>
                    <ul className="mt-3 space-y-2 text-sm leading-6">
                      {documentation.priorityRecommendations[priority].map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : null}

            {documentation.governanceRisks.length ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 shadow-sm">
                <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-rose-700">
                  Critical Risks
                </h4>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-rose-800">
                  {documentation.governanceRisks.slice(0, 3).map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {documentation.workflowLogic.length ? (
              <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-5 shadow-sm">
                <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-brand-700">
                  Suggested Workflow Logic
                </h4>
                <div className="mt-4 grid gap-3">
                  {documentation.workflowLogic.map((workflow) => (
                    <div key={workflow.name} className="rounded-xl border border-brand-100 bg-white p-4">
                      <p className="text-sm font-bold text-ink">{workflow.name}</p>
                      <dl className="mt-3 grid gap-2 text-sm leading-6 text-slate-700">
                        <div>
                          <dt className="font-semibold text-slate-500">Trigger</dt>
                          <dd>{workflow.trigger}</dd>
                        </div>
                        <div>
                          <dt className="font-semibold text-slate-500">Logic</dt>
                          <dd>{workflow.logic}</dd>
                        </div>
                        <div>
                          <dt className="font-semibold text-slate-500">Outcome</dt>
                          <dd>{workflow.outcome}</dd>
                        </div>
                      </dl>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {sectionLabels.map(([label, key]) => (
              <div key={key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
                  {label}
                </h4>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                  {documentation[key].map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {documentation.operationalMaturityInsights.length ? (
              <details className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <summary className="cursor-pointer text-sm font-bold uppercase tracking-[0.18em] text-brand-600">
                  Operational Maturity Insights
                </summary>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
                  {documentation.operationalMaturityInsights.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </details>
            ) : null}
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-100 bg-white text-2xl font-bold text-brand-600 shadow-sm">
              +
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">
              Paste notes and generate documentation to preview the structured output.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
