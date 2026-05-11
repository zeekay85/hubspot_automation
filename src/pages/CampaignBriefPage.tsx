import { useEffect, useState } from 'react';
import { AiOutputPanel } from '../components/AiOutputPanel';
import { FormInput } from '../components/FormInput';
import { TextArea } from '../components/TextArea';
import { Toast } from '../components/Toast';
import { generateCampaignBrief, type CampaignBriefRequest } from '../services/aiApi';

const emptyCampaignForm: CampaignBriefRequest = {
  campaignName: '',
  campaignGoal: '',
  targetAudience: '',
  channels: '',
  budget: '',
  timeline: '',
  kpis: '',
  notes: '',
};

export function CampaignBriefPage() {
  const [formValues, setFormValues] = useState<CampaignBriefRequest>(emptyCampaignForm);
  const [output, setOutput] = useState('');
  const [source, setSource] = useState<'gemini' | 'mock'>();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setToastMessage(''), 2400);

    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  const updateField = (field: keyof CampaignBriefRequest, value: string) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await generateCampaignBrief(formValues);
      setOutput(result.output);
      setSource(result.source);
      setToastMessage('Campaign brief generated.');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to generate brief.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyOutput = async () => {
    if (!output) {
      return;
    }

    await navigator.clipboard.writeText(output);
    setToastMessage('Output copied to clipboard.');
  };

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)]">
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-600">
              Backend connected
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink">
              Campaign Brief Generator
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Send campaign inputs to the secure Express API. The backend uses Gemini when configured,
              or a mock response while the API key is missing.
            </p>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-2">
            <FormInput
              label="Campaign name"
              placeholder="Spring pipeline acceleration"
              value={formValues.campaignName}
              readOnly={false}
              onChange={(event) => updateField('campaignName', event.target.value)}
            />
            <FormInput
              label="Campaign goal"
              placeholder="Increase demo requests from target accounts"
              value={formValues.campaignGoal}
              readOnly={false}
              onChange={(event) => updateField('campaignGoal', event.target.value)}
            />
            <FormInput
              label="Target audience"
              placeholder="VP Marketing, RevOps leaders, Demand Gen managers"
              value={formValues.targetAudience}
              readOnly={false}
              onChange={(event) => updateField('targetAudience', event.target.value)}
            />
            <FormInput
              label="Channels"
              placeholder="Email, paid social, webinar, partner newsletter"
              value={formValues.channels}
              readOnly={false}
              onChange={(event) => updateField('channels', event.target.value)}
            />
            <FormInput
              label="Budget"
              placeholder="$25,000"
              value={formValues.budget}
              readOnly={false}
              onChange={(event) => updateField('budget', event.target.value)}
            />
            <FormInput
              label="Timeline"
              placeholder="June 1 - July 15"
              value={formValues.timeline}
              readOnly={false}
              onChange={(event) => updateField('timeline', event.target.value)}
            />
            <TextArea
              label="KPIs"
              placeholder="MQLs, pipeline sourced, demo conversion rate"
              value={formValues.kpis}
              readOnly={false}
              rows={4}
              onChange={(event) => updateField('kpis', event.target.value)}
            />
            <TextArea
              label="Notes"
              placeholder="Add launch context, dependencies, approvals, or positioning notes."
              value={formValues.notes}
              readOnly={false}
              rows={4}
              onChange={(event) => updateField('notes', event.target.value)}
            />
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading}
              className="rounded-xl border border-brand-600 bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? 'Generating...' : 'Generate brief'}
            </button>
            <button
              type="button"
              onClick={() => {
                setFormValues(emptyCampaignForm);
                setOutput('');
                setError('');
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-brand-300 hover:text-brand-700"
            >
              Reset
            </button>
          </div>
        </section>

        <AiOutputPanel
          title="Generated brief preview"
          description="The backend returns a structured draft while keeping Gemini credentials server-side."
          emptyState="Complete the form and generate a campaign brief to preview the backend response."
          output={output}
          source={source}
          isLoading={isLoading}
          error={error}
          onCopy={copyOutput}
        />
      </div>

      <Toast message={toastMessage} />
    </>
  );
}
