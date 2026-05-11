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
};

const sectionLabels = [
  ['Step-by-Step Process', 'processSteps'],
  ['Roles & Responsibilities', 'rolesResponsibilities'],
  ['Action Items', 'actionItems'],
  ['Risks & Open Questions', 'risksOpenQuestions'],
  ['Recommended Format', 'recommendedFormat'],
] as const;

export function DocumentationOutput({
  documentation,
  output,
  source,
  isLoading,
  error,
  onCopy,
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
        <div className="flex flex-wrap gap-2">
          <CopyButton disabled={!output} onClick={onCopy} label="Copy document" />
          <PdfDownloadButton />
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
