import { FormInput } from '../components/FormInput';
import { OutputPanel } from '../components/OutputPanel';
import { TextArea } from '../components/TextArea';

export function CampaignBriefPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)]">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-600">Static form</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-ink">Campaign Brief Generator</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Capture the inputs a marketing operations team needs before generating a campaign brief in a later phase.
          </p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <FormInput label="Campaign name" placeholder="Spring pipeline acceleration" />
          <FormInput label="Campaign goal" placeholder="Increase demo requests from target accounts" />
          <FormInput label="Target audience" placeholder="VP Marketing, RevOps leaders, Demand Gen managers" />
          <FormInput label="Channels" placeholder="Email, paid social, webinar, partner newsletter" />
          <FormInput label="Budget" placeholder="$25,000" />
          <FormInput label="Timeline" placeholder="June 1 - July 15" />
          <TextArea
            label="KPIs"
            placeholder="MQLs, pipeline sourced, demo conversion rate"
            helperText="Phase 4 will send these details to the backend AI endpoint."
            rows={4}
          />
          <TextArea
            label="Notes"
            placeholder="Add launch context, dependencies, approvals, or positioning notes."
            rows={4}
          />
        </div>
      </section>

      <OutputPanel
        title="Generated brief preview"
        description="Future AI output will include executive summary, objective, audience, channel strategy, messages, timeline, KPIs, risks, and next steps."
        emptyState="No campaign brief has been generated yet. Complete Phase 4 to connect this panel to Gemini through the Express backend."
      />
    </div>
  );
}
