type FormInputProps = {
  label: string;
  placeholder: string;
  helperText?: string;
  value?: string;
};

export function FormInput({ label, placeholder, helperText, value = '' }: FormInputProps) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-ink">{label}</span>
      <input
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
        placeholder={placeholder}
        value={value}
        readOnly
      />
      {helperText ? <span className="mt-2 block text-xs text-slate-500">{helperText}</span> : null}
    </label>
  );
}
