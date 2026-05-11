import {
  campaignTypeOptions,
  contentTypeOptions,
  funnelStageOptions,
  mediumOptions,
  regionOptions,
  sourceOptions,
} from '../config/utmOptions';

export type UtmField =
  | 'baseUrl'
  | 'campaignName'
  | 'source'
  | 'medium'
  | 'campaignType'
  | 'region'
  | 'contentType'
  | 'funnelStage'
  | 'finalCampaign';

export type UtmFormValues = Record<UtmField, string>;

export type UtmErrors = Partial<Record<UtmField, string>>;

export type SavedUtmLink = UtmFormValues & {
  id: string;
  generatedUrl: string;
  createdAt: string;
};

export type LegacySavedUtmLink = {
  id: string;
  baseUrl: string;
  source: string;
  medium: string;
  campaign?: string;
  term?: string;
  content?: string;
  generatedUrl: string;
  createdAt: string;
};

const requiredFields: UtmField[] = [
  'baseUrl',
  'campaignName',
  'source',
  'medium',
  'campaignType',
  'region',
  'contentType',
  'finalCampaign',
];

const allowedValues: Partial<Record<UtmField, string[]>> = {
  source: sourceOptions.map((option) => option.value),
  medium: mediumOptions.map((option) => option.value),
  campaignType: campaignTypeOptions.map((option) => option.value),
  region: regionOptions.map((option) => option.value),
  contentType: contentTypeOptions.map((option) => option.value),
  funnelStage: funnelStageOptions.map((option) => option.value),
};

export const emptyUtmFormValues: UtmFormValues = {
  baseUrl: '',
  campaignName: '',
  source: '',
  medium: '',
  campaignType: '',
  region: 'global',
  contentType: '',
  funnelStage: '',
  finalCampaign: '',
};

export function normalizeUtmValue(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function buildRecommendedCampaignName(values: UtmFormValues, year = new Date().getFullYear()) {
  const namingParts = [
    values.campaignType,
    values.campaignName,
    values.region,
    values.source,
    values.medium,
  ].map(normalizeUtmValue);

  if (namingParts.some((part) => !part)) {
    return '';
  }

  return [
    String(year),
    ...namingParts,
  ]
    .join('_')
    .replace(/_{2,}/g, '_')
    .replace(/^_+|_+$/g, '');
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

  Object.entries(allowedValues).forEach(([field, options]) => {
    const value = values[field as UtmField];

    if (value && options && !options.includes(normalizeUtmValue(value))) {
      errors[field as UtmField] = 'Select a governed value from the approved list.';
    }
  });

  return errors;
}

export function getUtmWarnings(values: UtmFormValues) {
  const warnings: string[] = [];
  const recommendedCampaign = buildRecommendedCampaignName(values);
  const normalizedFinalCampaign = normalizeCampaignString(values.finalCampaign);

  if (values.finalCampaign && values.finalCampaign !== normalizedFinalCampaign) {
    warnings.push('Final campaign string contains uppercase letters, spaces, or repeated separators.');
  }

  if (recommendedCampaign && normalizedFinalCampaign && normalizedFinalCampaign !== recommendedCampaign) {
    warnings.push('Final campaign string differs from the recommended naming convention.');
  }

  if (values.medium === 'paid-social' && !['linkedin', 'facebook', 'instagram', 'x', 'youtube'].includes(values.source)) {
    warnings.push('Paid social medium is usually paired with a social source.');
  }

  if (values.medium === 'paid-search' && !['google', 'microsoft'].includes(values.source)) {
    warnings.push('Paid search medium is usually paired with google or microsoft.');
  }

  if (values.source === 'email' && !['email', 'nurture'].includes(values.medium)) {
    warnings.push('Email source is usually paired with email or nurture medium.');
  }

  return warnings;
}

export function hasUtmErrors(errors: UtmErrors) {
  return Object.keys(errors).length > 0;
}

export function normalizeCampaignString(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/_{2,}/g, '_')
    .replace(/[-_]+$/g, '')
    .replace(/^[-_]+/g, '');
}

export function generateUtmUrl(values: UtmFormValues) {
  const normalizedValues = normalizeUtmFormValues(values);
  const errors = validateUtmForm(normalizedValues);

  if (hasUtmErrors(errors)) {
    return '';
  }

  const url = new URL(normalizedValues.baseUrl.trim());

  url.searchParams.set('utm_source', normalizedValues.source);
  url.searchParams.set('utm_medium', normalizedValues.medium);
  url.searchParams.set('utm_campaign', normalizedValues.finalCampaign);
  url.searchParams.set('utm_content', normalizedValues.contentType);

  if (normalizedValues.funnelStage) {
    url.searchParams.set('utm_term', normalizedValues.funnelStage);
  } else {
    url.searchParams.delete('utm_term');
  }

  return url.toString();
}

export function normalizeUtmFormValues(values: UtmFormValues): UtmFormValues {
  return {
    baseUrl: values.baseUrl.trim(),
    campaignName: normalizeUtmValue(values.campaignName),
    source: normalizeUtmValue(values.source),
    medium: normalizeUtmValue(values.medium),
    campaignType: normalizeUtmValue(values.campaignType),
    region: normalizeUtmValue(values.region),
    contentType: normalizeUtmValue(values.contentType),
    funnelStage: normalizeUtmValue(values.funnelStage),
    finalCampaign: normalizeCampaignString(values.finalCampaign),
  };
}

export function createSavedUtmLink(values: UtmFormValues, generatedUrl: string): SavedUtmLink {
  return {
    ...normalizeUtmFormValues(values),
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    generatedUrl,
    createdAt: new Date().toISOString(),
  };
}

export function migrateSavedUtmLink(link: SavedUtmLink | LegacySavedUtmLink): SavedUtmLink {
  if ('campaignName' in link) {
    return link;
  }

  const migratedValues: UtmFormValues = {
    baseUrl: link.baseUrl,
    campaignName: link.campaign ?? '',
    source: link.source,
    medium: link.medium,
    campaignType: 'demand-gen',
    region: 'global',
    contentType: link.content || 'ad',
    funnelStage: link.term || '',
    finalCampaign: link.campaign ?? '',
  };

  return {
    ...normalizeUtmFormValues(migratedValues),
    id: link.id,
    generatedUrl: link.generatedUrl,
    createdAt: link.createdAt,
  };
}
