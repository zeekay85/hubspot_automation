export type UtmOption = {
  value: string;
  label: string;
  helperText?: string;
};

export const sourceOptions: UtmOption[] = [
  { value: 'linkedin', label: 'linkedin' },
  { value: 'google', label: 'google' },
  { value: 'microsoft', label: 'microsoft' },
  { value: 'facebook', label: 'facebook' },
  { value: 'instagram', label: 'instagram' },
  { value: 'x', label: 'x' },
  { value: 'youtube', label: 'youtube' },
  { value: 'email', label: 'email' },
  { value: 'hubspot', label: 'hubspot' },
  { value: 'salesloft', label: 'salesloft' },
  { value: 'partner', label: 'partner' },
  { value: 'webinar', label: 'webinar' },
  { value: 'event', label: 'event' },
  { value: 'organic-social', label: 'organic-social' },
  { value: 'direct', label: 'direct' },
  { value: 'referral', label: 'referral' },
];

export const mediumOptions: UtmOption[] = [
  { value: 'paid-social', label: 'paid-social' },
  { value: 'paid-search', label: 'paid-search' },
  { value: 'organic-social', label: 'organic-social' },
  { value: 'email', label: 'email' },
  { value: 'cpc', label: 'cpc' },
  { value: 'display', label: 'display' },
  { value: 'webinar', label: 'webinar' },
  { value: 'event', label: 'event' },
  { value: 'referral', label: 'referral' },
  { value: 'nurture', label: 'nurture' },
  { value: 'partner', label: 'partner' },
  { value: 'retargeting', label: 'retargeting' },
  { value: 'social', label: 'social' },
  { value: 'direct-mail', label: 'direct-mail' },
];

export const campaignTypeOptions: UtmOption[] = [
  { value: 'brand', label: 'brand' },
  { value: 'demand-gen', label: 'demand-gen' },
  { value: 'webinar', label: 'webinar' },
  { value: 'event', label: 'event' },
  { value: 'abm', label: 'abm' },
  { value: 'nurture', label: 'nurture' },
  { value: 'partner', label: 'partner' },
  { value: 'product-launch', label: 'product-launch' },
  { value: 'customer-marketing', label: 'customer-marketing' },
  { value: 'retargeting', label: 'retargeting' },
  { value: 'thought-leadership', label: 'thought-leadership' },
];

export const regionOptions: UtmOption[] = [
  { value: 'global', label: 'global' },
  { value: 'na', label: 'na' },
  { value: 'emea', label: 'emea' },
  { value: 'apac', label: 'apac' },
  { value: 'latam', label: 'latam' },
];

export const contentTypeOptions: UtmOption[] = [
  { value: 'ad', label: 'ad' },
  { value: 'banner', label: 'banner' },
  { value: 'carousel', label: 'carousel' },
  { value: 'email', label: 'email' },
  { value: 'landing-page', label: 'landing-page' },
  { value: 'cta', label: 'cta' },
  { value: 'social-post', label: 'social-post' },
  { value: 'video', label: 'video' },
  { value: 'ebook', label: 'ebook' },
  { value: 'whitepaper', label: 'whitepaper' },
  { value: 'webinar-page', label: 'webinar-page' },
];

export const funnelStageOptions: UtmOption[] = [
  { value: 'aware', label: 'aware' },
  { value: 'engaged', label: 'engaged' },
  { value: 'mqa', label: 'mqa' },
  { value: 'opportunity', label: 'opportunity' },
  { value: 'customer', label: 'customer' },
];
