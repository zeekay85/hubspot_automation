import type { CampaignBrief } from '../services/aiApi';
import { CopyButton } from './CopyButton';
import { PdfDownloadButton } from './PdfDownloadButton';

type CampaignBriefOutputProps = {
  brief?: CampaignBrief;
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
  ['Campaign Goal', 'campaignGoal'],
  ['Target Audience', 'targetAudience'],
  ['Channel Strategy', 'channelStrategy'],
  ['Recommended Messaging', 'recommendedMessaging'],
  ['Timeline', 'timeline'],
  ['KPIs', 'kpis'],
  ['Risks & Dependencies', 'risksDependencies'],
  ['Next Steps', 'nextSteps'],
] as const;

const advancedSections = [
  ['Operational Readiness Checklist', 'operationalReadinessChecklist'],
  ['Reporting Recommendations', 'reportingRecommendations'],
  ['Attribution & Tracking Considerations', 'attributionTrackingConsiderations'],
  ['Sales/BDR Alignment Notes', 'salesBdrAlignmentNotes'],
  ['Recommended Automation Workflows', 'recommendedAutomationWorkflows'],
  ['Suggested Lifecycle Progression', 'suggestedLifecycleProgression'],
  ['Suggested SLA Recommendations', 'suggestedSlaRecommendations'],
  ['Governance Checks', 'governanceChecks'],
  ['Observed GTM Risks', 'observedGtmRisks'],
  ['Key Operational Constraints', 'keyOperationalConstraints'],
] as const;

export function CampaignBriefOutput({
  brief,
  output,
  source,
  isLoading,
  error,
  onCopy,
  onSave,
  onDownloadMarkdown,
  onDownloadPdf,
}: CampaignBriefOutputProps) {
  const riskTone = brief?.operationalRiskAssessment.riskLevel.includes('High')
    ? 'border-rose-200 bg-rose-50 text-rose-700'
    : brief?.operationalRiskAssessment.riskLevel.includes('Medium')
      ? 'border-amber-200 bg-amber-50 text-amber-700'
      : 'border-emerald-200 bg-emerald-50 text-emerald-700';

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-600">
            {source === 'gemini' ? 'Gemini response' : source === 'mock' ? 'Mock response' : 'AI preview'}
          </p>
          <h3 className="mt-2 text-xl font-extrabold tracking-tight text-ink">
            Generated brief preview
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted">
            A structured campaign brief formatted for review, handoff, and portfolio demos.
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
          <div className="space-y-3" aria-label="Generating campaign brief">
            <div className="h-3 w-2/3 animate-pulse rounded-full bg-slate-200" />
            <div className="h-3 w-full animate-pulse rounded-full bg-slate-200" />
            <div className="h-3 w-5/6 animate-pulse rounded-full bg-slate-200" />
            <div className="h-3 w-3/5 animate-pulse rounded-full bg-slate-200" />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-700">
            {error}
          </div>
        ) : brief ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
              <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">
                Executive Summary
              </h4>
              <p className="mt-3 text-sm leading-6 text-slate-700">{brief.executiveSummary}</p>
            </div>

            {brief.kpiHighlights.length ? (
              <div className="grid gap-3 sm:grid-cols-3">
                {brief.kpiHighlights.map((kpi) => (
                  <div
                    key={`${kpi.label}-${kpi.value}`}
                    className="rounded-2xl border border-brand-100 bg-brand-50/70 p-4 shadow-sm"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-600">
                      {kpi.label}
                    </p>
                    <p className="mt-2 text-sm font-bold leading-5 text-ink">{kpi.value}</p>
                    <p className="mt-2 text-xs leading-5 text-muted">{kpi.context}</p>
                  </div>
                ))}
              </div>
            ) : null}

            <div className={`rounded-2xl border p-5 shadow-sm ${riskTone}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-[0.18em]">
                    Operational Readiness Score
                  </h4>
                  <p className="mt-2 text-sm leading-6">{brief.operationalRiskAssessment.summary}</p>
                </div>
                <div className="text-3xl font-extrabold">{brief.operationalRiskAssessment.score}%</div>
              </div>
              <p className="mt-3 inline-flex rounded-full bg-white/70 px-3 py-1 text-xs font-bold">
                {brief.operationalRiskAssessment.riskLevel}
              </p>
            </div>

            {sectionLabels.map(([label, key]) => (
              <div key={key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
                  {label}
                </h4>
                {Array.isArray(brief[key]) ? (
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                    {brief[key].map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm leading-6 text-slate-700">{brief[key]}</p>
                )}
              </div>
            ))}

            {brief.operationalReadinessChecklist.length ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
                <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
                  Operational Recommendations
                </h4>
                <p className="mt-2 text-sm leading-6 text-emerald-800">
                  Prioritize these readiness checks before launch to protect attribution, routing,
                  and reporting quality.
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-emerald-900">
                  {brief.operationalReadinessChecklist.slice(0, 3).map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {brief.preservedStrategicContext.length ? (
              <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5 shadow-sm">
                <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-700">
                  Preserved Strategic Context
                </h4>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-indigo-900">
                  {brief.preservedStrategicContext.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {brief.sourceTiedRecommendations.length ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
                <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">
                  Source-Tied Recommendations
                </h4>
                <div className="mt-4 grid gap-3">
                  {brief.sourceTiedRecommendations.map((item) => (
                    <div
                      key={`${item.sourceConcern}-${item.recommendation}`}
                      className="rounded-xl border border-amber-200 bg-white p-4"
                    >
                      <p className="text-sm font-bold text-ink">{item.sourceConcern}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-700">{item.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <details className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <summary className="cursor-pointer text-sm font-bold uppercase tracking-[0.18em] text-brand-600">
                Advanced GTM Insights
              </summary>
              <div className="mt-5 space-y-4">
                {advancedSections.map(([label, key]) => (
                  <div key={key} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                    <h5 className="text-sm font-bold text-ink">{label}</h5>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                      {brief[key].map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </details>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-100 bg-white text-2xl font-bold text-brand-600 shadow-sm">
              +
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">
              Complete the form and generate a campaign brief to preview the structured output.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
