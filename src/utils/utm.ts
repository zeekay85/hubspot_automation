export type UtmField = 'baseUrl' | 'source' | 'medium' | 'campaign' | 'term' | 'content';

export type UtmFormValues = Record<UtmField, string>;

export type UtmErrors = Partial<Record<UtmField, string>>;

export type SavedUtmLink = UtmFormValues & {
  id: string;
  generatedUrl: string;
  createdAt: string;
};

const requiredFields: UtmField[] = ['baseUrl', 'source', 'medium', 'campaign'];

const utmParamMap: Array<[keyof Pick<UtmFormValues, 'source' | 'medium' | 'campaign' | 'term' | 'content'>, string]> = [
  ['source', 'utm_source'],
  ['medium', 'utm_medium'],
  ['campaign', 'utm_campaign'],
  ['term', 'utm_term'],
  ['content', 'utm_content'],
];

export const emptyUtmFormValues: UtmFormValues = {
  baseUrl: '',
  source: '',
  medium: '',
  campaign: '',
  term: '',
  content: '',
};

export function normalizeUtmValue(value: string) {
  return value.trim().toLowerCase();
}

export function validateUtmForm(values: UtmFormValues): UtmErrors {
  const errors: UtmErrors = {};

  requiredFields.forEach((field) => {
    if (!values[field].trim()) {
      errors[field] = 'This field is required.';
    }
  });

  if (values.baseUrl.trim()) {
    try {
      const parsedUrl = new URL(values.baseUrl.trim());

      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        errors.baseUrl = 'Enter a URL that starts with http:// or https://.';
      }
    } catch {
      errors.baseUrl = 'Enter a valid URL, including https://.';
    }
  }

  return errors;
}

export function hasUtmErrors(errors: UtmErrors) {
  return Object.keys(errors).length > 0;
}

export function generateUtmUrl(values: UtmFormValues) {
  const errors = validateUtmForm(values);

  if (hasUtmErrors(errors)) {
    return '';
  }

  const url = new URL(values.baseUrl.trim());

  utmParamMap.forEach(([field, paramName]) => {
    const normalizedValue = normalizeUtmValue(values[field]);

    if (normalizedValue) {
      url.searchParams.set(paramName, normalizedValue);
    } else {
      url.searchParams.delete(paramName);
    }
  });

  return url.toString();
}

export function createSavedUtmLink(values: UtmFormValues, generatedUrl: string): SavedUtmLink {
  return {
    ...values,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    generatedUrl,
    createdAt: new Date().toISOString(),
  };
}
