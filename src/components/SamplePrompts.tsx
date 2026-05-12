type SamplePromptsProps = {
  title: string;
  samples: Array<{
    title: string;
    description: string;
    prompt: string;
    onUse?: () => void;
  }>;
};

export function SamplePrompts({ title, samples }: SamplePromptsProps) {
  return (
    <section className="mt-6 rounded-2xl border border-brand-100 bg-brand-50/60 p-6 shadow-card">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-600">
        Operational Insights Powered by AI
      </p>
      <h3 className="mt-2 text-xl font-extrabold tracking-tight text-ink">{title}</h3>
      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {samples.map((sample) => (
          <div
            key={sample.title}
            className="rounded-2xl border border-brand-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-card"
          >
            <p className="text-sm font-bold text-ink">{sample.title}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{sample.description}</p>
            <p className="mt-3 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600">
              {sample.prompt}
            </p>
            {sample.onUse ? (
              <button
                type="button"
                onClick={sample.onUse}
                className="mt-4 rounded-xl border border-brand-200 bg-white px-3 py-2 text-xs font-semibold text-brand-700 shadow-sm transition hover:bg-brand-50"
              >
                Load example
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
