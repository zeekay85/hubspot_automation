import type { ChangeEvent } from 'react';

type TextAreaProps = {
  label: string;
  placeholder: string;
  helperText?: string;
  rows?: number;
  value?: string;
  name?: string;
  error?: string;
  readOnly?: boolean;
  required?: boolean;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
};

export function TextArea({
  label,
  placeholder,
  helperText,
  rows = 5,
  value = '',
  name,
  error,
  readOnly = true,
  required = false,
  onChange,
}: TextAreaProps) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-ink">{label}</span>
      <textarea
        className={`mt-2 w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-4 ${
          error
            ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
            : 'border-slate-200 focus:border-brand-500 focus:ring-brand-100/80'
        }`}
        name={name}
        placeholder={placeholder}
        rows={rows}
        value={value}
        readOnly={readOnly}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        onChange={onChange}
      />
      {error ? (
        <span className="mt-2 block text-xs font-medium leading-5 text-rose-600">{error}</span>
      ) : helperText ? (
        <span className="mt-2 block text-xs leading-5 text-slate-500">{helperText}</span>
      ) : null}
    </label>
  );
}
