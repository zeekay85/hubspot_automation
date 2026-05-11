import type { ChangeEvent } from 'react';

type FormInputProps = {
  label: string;
  placeholder: string;
  helperText?: string;
  value?: string;
  name?: string;
  type?: string;
  error?: string;
  readOnly?: boolean;
  required?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function FormInput({
  label,
  placeholder,
  helperText,
  value = '',
  name,
  type = 'text',
  error,
  readOnly = true,
  required = false,
  onChange,
}: FormInputProps) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-ink">{label}</span>
      <input
        className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-4 ${
          error
            ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
            : 'border-slate-200 focus:border-brand-500 focus:ring-brand-100/80'
        }`}
        name={name}
        type={type}
        placeholder={placeholder}
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
