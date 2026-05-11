import { useEffect, useMemo, useState } from 'react';
import { FormInput } from '../components/FormInput';
import { SearchableSelect } from '../components/SearchableSelect';
import { Toast } from '../components/Toast';
import { UtmHistoryTable } from '../components/UtmHistoryTable';
import {
  campaignTypeOptions,
  contentTypeOptions,
  funnelStageOptions,
  mediumOptions,
  regionOptions,
  sourceOptions,
} from '../config/utmOptions';
import {
  buildRecommendedCampaignName,
  createSavedUtmLink,
  emptyUtmFormValues,
  generateUtmUrl,
  getUtmWarnings,
  hasUtmErrors,
  migrateSavedUtmLink,
  normalizeCampaignString,
  type LegacySavedUtmLink,
  type SavedUtmLink,
  type UtmField,
  type UtmFormValues,
  validateUtmForm,
} from '../utils/utm';

const storageKey = 'marketing-ops-hub:utm-history';

function readSavedLinks() {
  try {
    const savedLinks = window.localStorage.getItem(storageKey);
    return savedLinks
      ? (JSON.parse(savedLinks) as Array<SavedUtmLink | LegacySavedUtmLink>).map(migrateSavedUtmLink)
      : [];
  } catch {
    return [];
  }
}

function writeSavedLinks(links: SavedUtmLink[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(links));
}

export function UtmBuilderPage() {
  const [values, setValues] = useState<UtmFormValues>(emptyUtmFormValues);
  const [savedLinks, setSavedLinks] = useState<SavedUtmLink[]>(readSavedLinks);
  const [isHistoryLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Partial<Record<UtmField, boolean>>>({});

  const errors = useMemo(() => validateUtmForm(values), [values]);
  const generatedUrl = useMemo(() => generateUtmUrl(values), [values]);
  const recommendedCampaign = useMemo(() => buildRecommendedCampaignName(values), [values]);
  const warnings = useMemo(() => getUtmWarnings(values), [values]);
  const canUseGeneratedUrl = Boolean(generatedUrl) && !hasUtmErrors(errors);

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setToastMessage(''), 2400);

    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  const displayErrors = Object.fromEntries(
    Object.entries(errors).filter(([field]) => hasSubmitted || touchedFields[field as UtmField]),
  );

  const updateField = (field: UtmField, value: string) => {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
    setTouchedFields((currentFields) => ({
      ...currentFields,
      [field]: true,
    }));
  };

  const updateGovernedField = (field: UtmField, value: string) => {
    const normalizedValue = normalizeCampaignString(value);

    setValues((currentValues) => {
      const nextValues = {
        ...currentValues,
        [field]: normalizedValue,
      };

      return {
        ...nextValues,
        finalCampaign: buildRecommendedCampaignName(nextValues),
      };
    });
    setTouchedFields((currentFields) => ({
      ...currentFields,
      [field]: true,
    }));
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setToastMessage('UTM URL copied to clipboard.');
    } catch {
      setToastMessage('Clipboard access was blocked.');
    }
  };

  const handleCopyCurrent = async () => {
    setHasSubmitted(true);

    if (!canUseGeneratedUrl) {
      return;
    }

    await copyToClipboard(generatedUrl);
  };

  const handleSave = () => {
    setHasSubmitted(true);

    if (!canUseGeneratedUrl) {
      return;
    }

    const nextSavedLinks = [createSavedUtmLink(values, generatedUrl), ...savedLinks].slice(0, 25);
    setSavedLinks(nextSavedLinks);
    writeSavedLinks(nextSavedLinks);
    setToastMessage('UTM link saved locally.');
  };

  const handleClearHistory = () => {
    setSavedLinks([]);
    writeSavedLinks([]);
    setToastMessage('UTM history cleared.');
  };

  const handleRegenerate = (link: SavedUtmLink) => {
    setValues({
      baseUrl: link.baseUrl,
      campaignName: link.campaignName,
      source: link.source,
      medium: link.medium,
      campaignType: link.campaignType,
      region: link.region,
      contentType: link.contentType,
      funnelStage: link.funnelStage,
      finalCampaign: link.finalCampaign,
    });
    setHasSubmitted(false);
    setTouchedFields({});
    setToastMessage('Previous UTM link loaded.');
  };

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)]">
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-600">
              Functional MVP
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink">
              UTM Link Builder
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Enforce approved source, medium, region, content, and campaign naming standards.
            </p>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <FormInput
                label="Base URL"
                name="baseUrl"
                placeholder="https://example.com/demo"
                helperText="Include http:// or https://."
                value={values.baseUrl}
                error={displayErrors.baseUrl}
                readOnly={false}
                required
                onChange={(event) => updateField('baseUrl', event.target.value)}
              />
            </div>
            <FormInput
              label="Campaign Name"
              name="campaignName"
              placeholder="workday"
              helperText="Use the marketable campaign or audience name; spaces become hyphens."
              value={values.campaignName}
              error={displayErrors.campaignName}
              readOnly={false}
              required
              onChange={(event) => updateGovernedField('campaignName', event.target.value)}
            />
            <SearchableSelect
              label="Source"
              name="source"
              placeholder="Search approved sources"
              options={sourceOptions}
              helperText="Approved traffic origin used for utm_source."
              value={values.source}
              error={displayErrors.source}
              required
              onChange={(value) => updateGovernedField('source', value)}
            />
            <SearchableSelect
              label="Medium"
              name="medium"
              placeholder="Search approved media"
              options={mediumOptions}
              helperText="Approved channel grouping used for utm_medium."
              value={values.medium}
              error={displayErrors.medium}
              required
              onChange={(value) => updateGovernedField('medium', value)}
            />
            <SearchableSelect
              label="Campaign Type"
              name="campaignType"
              placeholder="Search campaign types"
              options={campaignTypeOptions}
              helperText="Used in the standardized campaign naming convention."
              value={values.campaignType}
              error={displayErrors.campaignType}
              required
              onChange={(value) => updateGovernedField('campaignType', value)}
            />
            <SearchableSelect
              label="Region"
              name="region"
              placeholder="Search regions"
              options={regionOptions}
              helperText="Region keeps reporting cuts consistent across launches."
              value={values.region}
              error={displayErrors.region}
              required
              onChange={(value) => updateGovernedField('region', value)}
            />
            <SearchableSelect
              label="Content Type"
              name="contentType"
              placeholder="Search content types"
              options={contentTypeOptions}
              helperText="Used for utm_content to classify creative or destination type."
              value={values.contentType}
              error={displayErrors.contentType}
              required
              onChange={(value) => updateGovernedField('contentType', value)}
            />
            <SearchableSelect
              label="Funnel Stage (optional)"
              name="funnelStage"
              placeholder="Search funnel stages"
              options={funnelStageOptions}
              helperText="Optional utm_term value for lifecycle reporting."
              value={values.funnelStage}
              error={displayErrors.funnelStage}
              onChange={(value) => updateGovernedField('funnelStage', value)}
            />
          </div>

          <div className="mt-7 rounded-2xl border border-brand-100 bg-brand-50/70 p-5">
            <p className="text-sm font-semibold text-ink">Recommended naming convention</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Use <span className="font-mono text-xs text-slate-700">year_type_campaign_region_source_medium</span> so campaign reporting stays consistent across HubSpot, ad platforms, and revenue dashboards.
            </p>
            <div className="mt-4 rounded-xl border border-brand-100 bg-white p-3 font-mono text-xs leading-5 text-slate-700">
              {recommendedCampaign || '2026_abm_workday_emea_linkedin_paid-social'}
            </div>
          </div>

          <div className="mt-7">
            <FormInput
              label="Final Campaign String"
              name="finalCampaign"
              placeholder="2026_abm_workday_emea_linkedin_paid-social"
              helperText="You can manually edit this before generating the URL; warnings will flag deviations."
              value={values.finalCampaign}
              error={displayErrors.finalCampaign}
              readOnly={false}
              required
              onChange={(event) => updateField('finalCampaign', normalizeCampaignString(event.target.value))}
            />
          </div>

          {warnings.length ? (
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-900">Governance warnings</p>
              <ul className="mt-2 space-y-1 text-sm leading-6 text-amber-800">
                {warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl border border-brand-600 bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
            >
              Save generated link
            </button>
            <button
              type="button"
              onClick={() => {
                setValues(emptyUtmFormValues);
                setTouchedFields({});
                setHasSubmitted(false);
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-brand-300 hover:text-brand-700"
            >
              Reset fields
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-600">
                Live preview
              </p>
              <h3 className="mt-2 text-xl font-extrabold tracking-tight text-ink">
                Generated UTM URL
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted">
                Values are lowercased, hyphenated, de-duplicated, and URL-encoded automatically.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyCurrent}
              disabled={!canUseGeneratedUrl}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition enabled:hover:border-brand-500 enabled:hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Copy URL
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-5">
            {generatedUrl ? (
              <p className="break-all rounded-xl bg-white px-4 py-4 font-mono text-sm leading-6 text-slate-700 shadow-sm">
                {generatedUrl}
              </p>
            ) : (
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-100 bg-white text-2xl font-bold text-brand-600 shadow-sm">
                  +
                </div>
                <p className="mt-4 text-sm leading-6 text-muted">
                  Enter a valid base URL and governed attribution values to preview your UTM link.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="mt-6">
        <UtmHistoryTable
          links={savedLinks}
          isLoading={isHistoryLoading}
          onCopy={copyToClipboard}
          onRegenerate={handleRegenerate}
          onClear={handleClearHistory}
        />
      </div>

      <Toast message={toastMessage} />
    </>
  );
}
