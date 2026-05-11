import { useId } from 'react';
import type { UtmOption } from '../config/utmOptions';

type SearchableSelectProps = {
  label: string;
  name: string;
  value: string;
  options: UtmOption[];
  placeholder: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  onChange: (value: string) => void;
};

export function SearchableSelect({
  label,
  name,
  value,
  options,
  placeholder,
  helperText,
  error,
  required = false,
  onChange,
}: SearchableSelectProps) {
  const listId = useId();

  return (
    <label className="block">
      <span className="text-sm font-semibold text-ink">{label}</span>
      <input
        className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-4 ${
          error
            ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
            : 'border-slate-200 focus:border-brand-500 focus:ring-brand-100/80'
        }`}
        list={listId}
        name={name}
        value={value}
        placeholder={placeholder}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        onChange={(event) => onChange(event.target.value)}
      />
      <datalist id={listId}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </datalist>
      {error ? (
        <span className="mt-2 block text-xs font-medium leading-5 text-rose-600">{error}</span>
      ) : helperText ? (
        <span className="mt-2 block text-xs leading-5 text-slate-500">{helperText}</span>
      ) : null}
    </label>
  );
}
