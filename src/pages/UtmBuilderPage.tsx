import { useEffect, useMemo, useState } from 'react';
import { FormInput } from '../components/FormInput';
import { Toast } from '../components/Toast';
import { UtmHistoryTable } from '../components/UtmHistoryTable';
import {
  createSavedUtmLink,
  emptyUtmFormValues,
  generateUtmUrl,
  hasUtmErrors,
  type SavedUtmLink,
  type UtmField,
  type UtmFormValues,
  validateUtmForm,
} from '../utils/utm';

const storageKey = 'marketing-ops-hub:utm-history';

function readSavedLinks() {
  try {
    const savedLinks = window.localStorage.getItem(storageKey);
    return savedLinks ? (JSON.parse(savedLinks) as SavedUtmLink[]) : [];
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
      source: link.source,
      medium: link.medium,
      campaign: link.campaign,
      term: link.term,
      content: link.content,
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
              Build lowercase, encoded campaign links with inline validation and local saved history.
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
              label="Source"
              name="source"
              placeholder="linkedin"
              value={values.source}
              error={displayErrors.source}
              readOnly={false}
              required
              onChange={(event) => updateField('source', event.target.value)}
            />
            <FormInput
              label="Medium"
              name="medium"
              placeholder="paid-social"
              value={values.medium}
              error={displayErrors.medium}
              readOnly={false}
              required
              onChange={(event) => updateField('medium', event.target.value)}
            />
            <FormInput
              label="Campaign"
              name="campaign"
              placeholder="spring-pipeline"
              value={values.campaign}
              error={displayErrors.campaign}
              readOnly={false}
              required
              onChange={(event) => updateField('campaign', event.target.value)}
            />
            <FormInput
              label="Term (optional)"
              name="term"
              placeholder="revops-software"
              value={values.term}
              readOnly={false}
              onChange={(event) => updateField('term', event.target.value)}
            />
            <FormInput
              label="Content (optional)"
              name="content"
              placeholder="carousel-ad-a"
              value={values.content}
              readOnly={false}
              onChange={(event) => updateField('content', event.target.value)}
            />
          </div>

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
                Values are normalized to lowercase and encoded automatically.
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
                  Enter a valid base URL, source, medium, and campaign to preview your UTM link.
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
