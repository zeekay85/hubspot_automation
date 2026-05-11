import { FormInput } from '../components/FormInput';
import { OutputPanel } from '../components/OutputPanel';
import { TextArea } from '../components/TextArea';

export function DocumentationPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)]">
      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-600">Static form</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink">Documentation Automation</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Prepare a structured workspace for turning messy notes into polished operational documentation.
          </p>
        </div>

        <div className="mt-7 grid gap-5">
          <FormInput
            label="Output type"
            placeholder="SOP, Process Document, Meeting Summary, or Action Plan"
            helperText="A dropdown will be enabled when the AI workflow is connected."
          />
          <TextArea
            label="Raw notes or process text"
            placeholder="Paste meeting notes, process details, handoff steps, owner names, or unresolved questions here."
            helperText="Phase 5 will generate summary, steps, roles, action items, risks, and open questions."
            rows={10}
          />
        </div>
      </section>

      <OutputPanel
        title="Generated documentation preview"
        description="Future output will be professionally formatted for enablement and team handoffs."
        emptyState="No documentation has been generated yet. Phase 5 will connect this panel to the backend AI endpoint."
        showErrorPreview
      />
    </div>
  );
}
