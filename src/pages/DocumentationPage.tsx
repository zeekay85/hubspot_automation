import { useEffect, useState } from 'react';
import { DocumentationOutput } from '../components/DocumentationOutput';
import { TextArea } from '../components/TextArea';
import { Toast } from '../components/Toast';
import {
  generateDocumentation,
  type DocumentationRequest,
  type GeneratedDocumentation,
} from '../services/aiApi';

const outputTypes = ['SOP', 'Process Document', 'Meeting Summary', 'Action Plan'];

const emptyDocumentationForm: DocumentationRequest = {
  outputType: 'SOP',
  rawNotes: '',
};

export function DocumentationPage() {
  const [formValues, setFormValues] = useState<DocumentationRequest>(emptyDocumentationForm);
  const [output, setOutput] = useState('');
  const [documentation, setDocumentation] = useState<GeneratedDocumentation>();
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

  const handleGenerate = async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await generateDocumentation(formValues);
      setOutput(result.output);
      setDocumentation(result.documentation);
      setSource(result.source);
      setToastMessage('Documentation draft generated.');
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'Unable to generate documentation.',
      );
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
              Documentation Automation
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Send raw notes to the secure Express API and receive a clean draft response.
            </p>
          </div>

          <div className="mt-7 grid gap-5">
            <label className="block">
              <span className="text-sm font-semibold text-ink">Output type</span>
              <select
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100/80"
                value={formValues.outputType}
                onChange={(event) =>
                  setFormValues((currentValues) => ({
                    ...currentValues,
                    outputType: event.target.value,
                  }))
                }
              >
                {outputTypes.map((outputType) => (
                  <option key={outputType} value={outputType}>
                    {outputType}
                  </option>
                ))}
              </select>
              <span className="mt-2 block text-xs leading-5 text-slate-500">
                The backend validates this against supported documentation types.
              </span>
            </label>
            <TextArea
              label="Raw notes or process text"
              placeholder="Paste meeting notes, process details, handoff steps, owner names, or unresolved questions here."
              helperText="The backend will return a structured draft with summary, process, actions, and open questions."
              value={formValues.rawNotes}
              readOnly={false}
              rows={10}
              onChange={(event) =>
                setFormValues((currentValues) => ({
                  ...currentValues,
                  rawNotes: event.target.value,
                }))
              }
            />
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading}
              className="rounded-xl border border-brand-600 bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? 'Generating...' : 'Generate documentation'}
            </button>
            <button
              type="button"
              onClick={() => {
                setFormValues(emptyDocumentationForm);
                setOutput('');
                setDocumentation(undefined);
                setError('');
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-brand-300 hover:text-brand-700"
            >
              Reset
            </button>
          </div>
        </section>

        <DocumentationOutput
          documentation={documentation}
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
