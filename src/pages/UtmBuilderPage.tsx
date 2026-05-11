import { FormInput } from '../components/FormInput';
import { OutputPanel } from '../components/OutputPanel';

export function UtmBuilderPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)]">
      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-600">Static form</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink">UTM Link Builder</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            A clean placeholder for the Phase 2 builder workflow: validate, encode, preview, copy, and save links locally.
          </p>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <FormInput label="Base URL" placeholder="https://example.com/demo" helperText="Validation arrives in Phase 2." />
          </div>
          <FormInput label="Source" placeholder="linkedin" />
          <FormInput label="Medium" placeholder="paid-social" />
          <FormInput label="Campaign" placeholder="spring-pipeline" />
          <FormInput label="Term (optional)" placeholder="revops-software" />
          <FormInput label="Content (optional)" placeholder="carousel-ad-a" />
        </div>

        <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
          <p className="text-sm font-semibold text-ink">Saved UTM history placeholder</p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Phase 2 will show a table of generated links from local storage with a clear history action.
          </p>
        </div>
      </section>

      <OutputPanel
        title="Live URL preview"
        description="Phase 2 will generate a lowercase, URL-encoded UTM link as fields change."
        emptyState="Your generated UTM URL will appear here after Phase 2 is implemented."
      />
    </div>
  );
}
